import type { CodeSnippet } from './clubeSnippets'

/* Trechos do workflow n8n do Clube da Economia, revisados à mão.
   O export original carrega cookie de sessão, CSRF e IDs de canal em texto
   puro — nada disso aparece aqui: os valores foram trocados por placeholder e
   as credenciais vivem no cofre do n8n, referenciadas por nome. */

export const n8nSnippets: CodeSnippet[] = [
  {
    label: 'FLUXO',
    file: 'workflow/visão-geral.md',
    lang: 'md',
    note: 'Como as cinco rotinas se dividem e por que elas são independentes umas das outras.',
    code: `# Pipeline de coleta e publicação

Cinco rotinas independentes, cada uma com o próprio gatilho. Nenhuma chama a
outra: elas se comunicam pelo estado das linhas no banco. Uma falha na coleta
não impede a publicação do que já está pronto, e cada etapa pode ser reprocessada
sozinha.

## Os gatilhos

| Horário | Rotina | Entrada → saída |
|---|---|---|
| 07:00 | Coleta | Categorias ativas → produtos novos |
| 08:00 | Afiliação | Produtos sem \`affiliate_url\` → link gerado |
| 30/30min, 9h–22h | Publicação | Ofertas prontas → post no Telegram |
| 03:00 | Revalidação | Produtos ativos → preço atualizado |
| 00:00 | Inativação | Produtos sem sincronização → inativos |

## O caminho de uma oferta

\`\`\`
CATEGORIAS ATIVAS  →  embaralha  →  percorre em lote
                                          │
                                    baixa o HTML
                                          │
                                   ┌──────┴──────┐
                              carousel?      polycard?
                                   └──────┬──────┘
                                          │
                              filtra vazios · extrai ID
                                          │
                              categoriza · limpa a URL
                                          │
                                  upsert em products
                                          │
                                   espera 10s ─┘ (volta ao lote)
\`\`\`

## Estado como contrato

Cada rotina reconhece seu trabalho por uma coluna:

- \`affiliate_url IS NULL\` → ainda não passou pela afiliação
- \`telegram_sent_at IS NULL\` → ainda não foi publicado
- \`active = false\` → saiu da vitrine

Isso substitui uma fila: o banco é a fila. O custo é uma consulta a mais por
rotina; o ganho é que qualquer etapa pode cair e ser retomada sem perder nada.`,
  },
  {
    label: 'PARSER DUPLO',
    file: 'nodes/If2 + PAGINA COM POLYCARD.js',
    lang: 'js',
    note: 'O Mercado Livre serve dois layouts diferentes para as mesmas listagens. Um nó de condição detecta qual veio e roteia para o parser correspondente, em vez de tentar um seletor que funcione nos dois.',
    code: `// ── Nó If: qual layout o Mercado Livre devolveu? ──────────────────
// true  → carrossel dinâmico
// false → grade de poly-cards
{
  leftValue: "={{ $json.data }}",
  rightValue: "dynamic-carousel__item-container",
  operator: { type: "string", operation: "contains" }
}

// ── Parser da grade de poly-cards ─────────────────────────────────
// O preço vem partido em dois elementos (inteiro e centavos), então é
// remontado tanto como texto para exibir quanto como número para comparar.
const extractMoney = (block) => {
  if (!block) return { texto: null, valor: null };

  const frac  = block.match(/data-andes-money-amount-fraction="true"[^>]*>([^<]+)</);
  const cents = block.match(/data-andes-money-amount-cents="true"[^>]*>([^<]+)</);
  if (!frac) return { texto: null, valor: null };

  const fracRaw  = frac[1].trim();
  const centsRaw = cents ? cents[1].trim() : null;

  const texto = centsRaw ? \`R$ \${fracRaw},\${centsRaw}\` : \`R$ \${fracRaw}\`;
  const valor = parseFloat(
    centsRaw ? \`\${fracRaw.replace(/\\D/g, '')}.\${centsRaw.replace(/\\D/g, '')}\`
             : fracRaw.replace(/\\D/g, '')
  );

  return { texto, valor: Number.isFinite(valor) ? valor : null };
};

const extractProducts = (html) => {
  const products = [];
  const seen = new Set();

  // Fatia o HTML nos limites de cada card em vez de usar um seletor global:
  // assim título, imagem e preço não se misturam entre produtos vizinhos.
  const cardStartRegex = /<div\\b[^>]*class="[^"]*\\bpoly-card\\b[^"]*"[^>]*>/g;
  const starts = [...html.matchAll(cardStartRegex)].map((m) => m.index);

  for (let i = 0; i < starts.length; i++) {
    const card = html.slice(starts[i], starts[i + 1] || html.length);

    const titleMatch = card.match(
      /<a\\b([^>]*class="[^"]*\\bpoly-component__title\\b[^"]*"[^>]*)>([\\s\\S]*?)<\\/a>/
    );
    if (!titleMatch) continue;

    const title    = clean(titleMatch[2]);
    const current  = extractMoney(card.match(/<div class="poly-price__current">([\\s\\S]*?)<\\/div>/)?.[1]);
    const previous = extractMoney(card.match(/<s\\s[^>]*andes-money-amount--previous[\\s\\S]*?<\\/s>/)?.[0]);

    // A mesma oferta aparece repetida em blocos diferentes da página.
    const dedupKey = \`\${title}|\${current.texto}|\${imageUrl}\`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    products.push({
      nomeProduto: title,
      precoAtual: current.texto,
      preco_atual_numero: current.valor,
      precoOriginal: previous.texto,
      preco_original_numero: previous.valor,
    });
  }

  return products;
};`,
  },
  {
    label: 'CATEGORIZAÇÃO',
    file: 'nodes/LIMPAR URL PRODUTO.js',
    lang: 'js',
    note: 'A categoria do anúncio no Mercado Livre é ampla demais para filtrar a vitrine. A classificação é refeita por palavra-chave do título, com a ordem das regras importando: a primeira que casa vence.',
    code: `for (const item of $input.all()) {
  // Remove os parâmetros de rastreio: a mesma oferta chega com querystrings
  // diferentes e viraria produto duplicado no banco.
  if (item.json.urlOriginal) {
    item.json.urlOriginal = item.json.urlOriginal.split('?')[0];
  }

  const titulo = (item.json.nomeProduto || "").toLowerCase();
  let categoria = "Outros";

  // A ordem importa: "fone" antes de "smartphone" evita que um fone de ouvido
  // para iPhone caia em Smartphones por causa da marca no título.
  if (/headset|mouse|teclado|headphone|mousepad/.test(titulo)) {
    categoria = "Periféricos";
  } else if (/carregador|capinha|película|power bank|cabo usb|fone|airpod/.test(titulo)) {
    categoria = "Acessórios Celulares";
  } else if (/notebook|laptop|macbook|ideapad/.test(titulo)) {
    categoria = "Notebooks";
  } else if (/monitor|tela|display/.test(titulo)) {
    categoria = "Monitores";
  } else if (/tv|smart tv|televisão/.test(titulo)) {
    categoria = "Smart TVs";
  } else if (/alexa|echo|lâmpada|fechadura|smart home/.test(titulo)) {
    categoria = "Casa Inteligente";
  } else if (/ps5|playstation|xbox|nintendo|console|game/.test(titulo)) {
    categoria = "Games";
  } else if (/smartphone|iphone|galaxy|xiaomi|celular|poco|motorola/.test(titulo)) {
    categoria = "Smartphones";
  }

  item.json.grupoOferta = categoria;
}

return $input.all();

// ── Extração do ID do anúncio, em nó separado ─────────────────────
// O ID canônico vem embutido na URL em dois formatos (MLB-123 e MLB123).
const matchId = urlOriginal.match(/MLB-?\\d+/i);
item.json.idProduto = matchId
  ? matchId[0].replace('-', '').toUpperCase()
  : "SEM_ID";`,
  },
  {
    label: 'ANTIBLOQUEIO',
    file: 'workflow/estratégia-de-coleta.json',
    lang: 'json',
    note: 'Coleta contínua contra um site que não quer ser coletado. As quatro medidas abaixo existem para a rotina durar: sessão reaproveitada, ordem imprevisível, lotes pequenos e pausa entre eles.',
    code: `// 1. A sessão é resolvida uma vez e guardada no Redis, em vez de
//    refeita a cada execução. O valor vem do cofre de credenciais.
{
  "name": "COOKIES",
  "type": "n8n-nodes-base.redis",
  "parameters": { "operation": "get", "key": "cookies-mercadolivre" },
  "credentials": { "redis": "<credencial-do-cofre>" }
}

// 2. As categorias são embaralhadas a cada execução: a mesma ordem
//    todo dia no mesmo horário é assinatura de robô.
{
  "name": "MISTURAR",
  "type": "n8n-nodes-base.sort",
  "parameters": { "type": "random" }
}

// 3. A afiliação percorre em lotes de 20, não a lista inteira de uma vez.
{
  "name": "LOOP",
  "type": "n8n-nodes-base.splitInBatches",
  "parameters": { "batchSize": 20 }
}

// 4. Pausa entre lotes, e o loop só então volta para o próximo.
{
  "name": "WAIT",
  "type": "n8n-nodes-base.wait",
  "parameters": { "amount": 15 }
}

// A publicação usa a mesma ideia no gatilho: a cada 30 minutos, mas só
// dentro da janela em que existe gente lendo o canal.
{
  "name": "ACIONA A CADA 30 MIN",
  "type": "n8n-nodes-base.scheduleTrigger",
  "parameters": {
    "rule": { "interval": [{ "field": "cronExpression",
                             "expression": "0 */30 9-22 * * *" }] }
  }
}`,
  },
  {
    label: 'PUBLICAÇÃO',
    file: 'nodes/DISPARA NO TELEGRAM.json',
    lang: 'json',
    note: 'A oferta vira post com foto e legenda em Markdown. O preço cheio só entra na mensagem quando existe, e a falha no envio não derruba a execução — o produto continua na fila para a próxima janela.',
    code: `{
  "name": "DISPARA NO TELEGRAM",
  "type": "n8n-nodes-base.telegram",
  "parameters": {
    "operation": "sendPhoto",
    "chatId": "<id-do-canal>",
    "file": "={{ $json.image_url }}",
    "additionalFields": {
      "parse_mode": "Markdown",
      "caption": "=🚨 *OFERTA ENCONTRADA!* 📦

*{{ $json.title }}*

{{ $json.original_price
     ? \`📉 De: R$ \${$json.original_price.toString().replace('.', ',')}\\n\`
     : '' }}💸 Por: *R$ {{ $json.price.toString().replace('.', ',') }}* {{ $json.discount || '' }}

🔗 *Compre aqui:* {{ $json.affiliate_url }}"
    }
  },
  // Falha de envio não interrompe o lote: sem marcar telegram_sent_at,
  // o produto simplesmente reaparece na próxima janela de publicação.
  "onError": "continueRegularOutput",
  "credentials": { "telegramApi": "<credencial-do-cofre>" }
}

// A fila de publicação é uma consulta, não uma estrutura à parte:
// ofertas de hoje, já afiliadas e ainda não enviadas.
{
  "name": "BUSCA TODOS PRONTOS",
  "type": "n8n-nodes-base.supabase",
  "parameters": {
    "operation": "getAll",
    "tableId": "products",
    "filters": { "conditions": [
      { "keyName": "affiliate_url",    "condition": "ilike", "keyValue": "*http*" },
      { "keyName": "telegram_sent_at", "condition": "is",    "keyValue": "null" },
      { "keyName": "created_at",       "condition": "gte",
        "keyValue": "={{ $now.startOf('day').toISO() }}" }
    ]}
  }
}`,
  },
]
