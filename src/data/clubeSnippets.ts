/* Trechos curados do Clube da Economia, exibidos no visualizador de código do
   portfólio. Copiados do repositório privado e revisados manualmente: nenhum
   valor de credencial aparece aqui — as configurações sensíveis são injetadas
   por variável de ambiente e ficam representadas apenas pela chave. */

import { clubeReadme } from './clubeReadme'

export type CodeSnippet = {
  label: string
  file: string
  lang: 'java' | 'sql' | 'md' | 'js' | 'json'
  note: string
  code: string
}

export const clubeSnippets: CodeSnippet[] = [
  {
    label: 'README',
    file: 'README.md',
    lang: 'md',
    note: 'Documentação do repositório: o problema que o projeto ataca, o desenho da arquitetura, as decisões técnicas e como subir o ambiente.',
    code: clubeReadme,
  },
  {
    label: 'OAUTH + CACHE',
    file: 'services/MercadoLivreService.java',
    lang: 'java',
    note: 'Autenticação client_credentials na API do Mercado Livre. O token é reaproveitado enquanto válido e renovado com 60s de margem, evitando uma ida à rede a cada chamada.',
    code: `@Service
public class MercadoLivreService {

    @Value("\${app.ml.affiliate.app-id}")
    private String appId;

    @Value("\${app.ml.affiliate.client-secret}")
    private String clientSecret;          // injetado por variável de ambiente

    private String accessToken = null;
    private long tokenExpiresAt = 0;

    private synchronized String getAccessToken() {
        // token ainda válido: reaproveita sem ir à rede
        if (accessToken != null && System.currentTimeMillis() < tokenExpiresAt) {
            return accessToken;
        }

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", appId);
        form.add("client_secret", clientSecret);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.mercadolibre.com/oauth/token",
                new HttpEntity<>(form, headers), Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            this.accessToken = (String) response.getBody().get("access_token");
            long expiresIn = ((Number) response.getBody().get("expires_in")).longValue();
            // 60s de margem para não usar um token que expira em trânsito
            this.tokenExpiresAt = System.currentTimeMillis() + ((expiresIn - 60) * 1000L);
            return accessToken;
        }

        throw new RuntimeException("Não foi possível gerar o token do Mercado Livre");
    }
}`,
  },
  {
    label: 'BUSCA EM LOTE',
    file: 'services/MercadoLivreService.java',
    lang: 'java',
    note: 'Consulta de preços em lote: uma requisição para N produtos em vez de N requisições. O endpoint multi-get responde por item, então cada resultado é validado individualmente antes de entrar no mapa.',
    code: `public Map<String, Double> getProductsPrices(List<String> mlIds) {
    if (mlIds == null || mlIds.isEmpty()) return Collections.emptyMap();

    String url = "https://api.mercadolibre.com/items?ids=" + String.join(",", mlIds);

    HttpHeaders headers = new HttpHeaders();
    headers.setBearerAuth(getAccessToken());

    Map<String, Double> prices = new HashMap<>();

    ResponseEntity<List> response = restTemplate.exchange(
            url, HttpMethod.GET, new HttpEntity<>(headers), List.class);

    if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
        for (Object itemObj : response.getBody()) {
            // o multi-get devolve um status por item: só aproveita os 200
            if (itemObj instanceof Map itemMap
                    && itemMap.get("code") instanceof Number code
                    && code.intValue() == 200) {

                Map<?, ?> body = (Map<?, ?>) itemMap.get("body");
                if (body != null && body.get("id") instanceof String id
                        && body.get("price") instanceof Number price) {
                    prices.put(id, price.doubleValue());
                }
            }
        }
    }
    return prices;
}`,
  },
  {
    label: 'JOB EM LOTE',
    file: 'jobs/ProductActivityScheduler.java',
    lang: 'java',
    note: 'Rotina diária de preços fatiada em lotes de 20 — o limite documentado do multi-get da API. Compara com o valor salvo e acumula só o que mudou para uma única escrita com saveAll, em vez de um save por produto.',
    code: `@Component
@Slf4j
@RequiredArgsConstructor
public class ProductActivityScheduler {

    // Limite documentado do multi-get da API do Mercado Livre.
    static final int BATCH_SIZE = 20;

    private final ProductRepository productRepository;
    private final MercadoLivreService mercadoLivreService;

    // Atualiza o preço dos produtos ativos, depois da limpeza dos inativos.
    @Scheduled(cron = "0 0 4 * * *")
    public void updateProductPrices() {
        List<Product> activeProducts = productRepository.findByActiveTrueOrderByUpdatedAtDesc();
        int updatedCount = 0;

        for (int i = 0; i < activeProducts.size(); i += BATCH_SIZE) {
            List<Product> batch = activeProducts.subList(i, Math.min(activeProducts.size(), i + BATCH_SIZE));
            List<String> mlIds = batch.stream()
                    .map(Product::getMlId)
                    .filter(id -> id != null && !id.isEmpty())
                    .collect(Collectors.toList());

            if (mlIds.isEmpty()) continue;

            Map<String, Double> newPrices = mercadoLivreService.getProductsPrices(mlIds);

            List<Product> productsToSave = new ArrayList<>();
            for (Product product : batch) {
                Double newPrice = newPrices.get(product.getMlId());
                // grava só o que realmente mudou de preço
                if (newPrice != null && !newPrice.equals(product.getPrice())) {
                    product.setPrice(newPrice);
                    productsToSave.add(product);
                }
            }

            if (!productsToSave.isEmpty()) {
                productRepository.saveAll(productsToSave);   // escrita em lote
                updatedCount += productsToSave.size();
            }
        }

        log.info("Atualização diária concluída. Produtos atualizados: {}", updatedCount);
    }
}`,
  },
  {
    label: 'TESTES',
    file: 'services/MercadoLivreServiceTest.java',
    lang: 'java',
    note: 'Testes de unidade com JUnit 5 e Mockito, sem subir contexto Spring nem tocar a rede. Cobrem o que é fácil de quebrar sem perceber: o cache do token e o descarte de itens que voltam com código diferente de 200.',
    code: `@ExtendWith(MockitoExtension.class)
class MercadoLivreServiceTest {

    @Mock
    private RestTemplate restTemplate;

    private MercadoLivreService service;

    @BeforeEach
    void setUp() {
        service = new MercadoLivreService(restTemplate);
        ReflectionTestUtils.setField(service, "appId", "app-id-de-teste");
        ReflectionTestUtils.setField(service, "clientSecret", "segredo-de-teste");
    }

    @Test
    @DisplayName("reaproveita o token enquanto válido, sem repetir a chamada OAuth")
    void reaproveitaTokenValido() {
        stubTokenResponse("token-valido", 3600);
        stubItemsResponse(List.of(item(200, "MLB1", 10.0)));

        service.getProductsPrices(List.of("MLB1"));
        service.getProductsPrices(List.of("MLB1"));

        // duas buscas de preço, mas o token só é pedido uma vez
        verify(restTemplate, times(1))
                .postForEntity(eq(TOKEN_URL), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    @DisplayName("renova o token quando a validade já foi consumida pela margem")
    void renovaTokenExpirado() {
        // expires_in menor que a margem de 60s => nasce vencido e é renovado
        stubTokenResponse("token-curto", 30);
        stubItemsResponse(List.of(item(200, "MLB1", 10.0)));

        service.getProductsPrices(List.of("MLB1"));
        service.getProductsPrices(List.of("MLB1"));

        verify(restTemplate, times(2))
                .postForEntity(eq(TOKEN_URL), any(HttpEntity.class), eq(Map.class));
    }

    @Test
    @DisplayName("ignora itens cujo código não é 200 e mantém os demais")
    void ignoraItensComCodigoDiferenteDe200() {
        stubTokenResponse("token-valido", 3600);
        stubItemsResponse(List.of(
                item(200, "MLB1", 10.0),
                item(404, "MLB2", 20.0),
                item(200, "MLB3", 30.5)));

        Map<String, Double> precos = service.getProductsPrices(List.of("MLB1", "MLB2", "MLB3"));

        assertThat(precos).containsOnlyKeys("MLB1", "MLB3");
    }

    @Test
    @DisplayName("não chama a API quando a lista de ids vem vazia ou nula")
    void naoChamaApiComListaVazia() {
        assertThat(service.getProductsPrices(List.of())).isEmpty();
        assertThat(service.getProductsPrices(null)).isEmpty();

        verifyNoInteractions(restTemplate);
    }
}`,
  },
  {
    label: 'WEBHOOK n8n',
    file: 'controllers/WebhookController.java',
    lang: 'java',
    note: 'Porta de entrada das ofertas coletadas pelo n8n. Valida o token do cabeçalho antes de qualquer processamento e recusa payload incompleto com 400, separando erro do cliente de erro do servidor.',
    code: `@RestController
@RequestMapping("/api/webhook/produtos")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookService webhookService;

    @PostMapping
    public ResponseEntity<Object> receiveProduct(
            @RequestHeader("X-N8N-Token") String token,
            @RequestBody ProductRequestDTO dto) {

        // autentica antes de tocar no corpo da requisição
        if (!webhookService.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid Token"));
        }

        if (dto.getMlId() == null || dto.getMlId().isBlank()
                || dto.getTitle() == null || dto.getTitle().isBlank()
                || dto.getCleanedPrice() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "mlId, title e price são obrigatórios"));
        }

        Product product = new Product();
        product.setMlId(dto.getMlId());
        product.setTitle(dto.getTitle());
        product.setPrice(dto.getCleanedPrice());
        product.setOriginalPrice(dto.getCleanedOriginalPrice());
        product.setDiscount(dto.getDiscount());
        product.setAffiliateUrl(dto.getAffiliateUrl());

        webhookService.saveProductFromN8n(product);
        return ResponseEntity.ok(Map.of("message", "Product saved successfully"));
    }
}`,
  },
  {
    label: 'HISTÓRICO DE PREÇO',
    file: 'migrations/price_history_and_filters.sql',
    lang: 'sql',
    note: 'O histórico é registrado pelo próprio banco, por trigger: qualquer caminho que altere o preço fica auditado, sem depender de a aplicação lembrar de gravar. É o que sustenta o cálculo de desconto real sobre o preço cheio.',
    code: `CREATE TABLE IF NOT EXISTS public.product_price_history (
    id         BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    price      DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

ALTER TABLE public.product_price_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to price history"
ON public.product_price_history FOR SELECT USING (true);

CREATE OR REPLACE FUNCTION public.log_product_price_change()
RETURNS TRIGGER AS $$
BEGIN
    -- registra na inserção e sempre que o preço mudar de valor
    IF (TG_OP = 'INSERT')
       OR (TG_OP = 'UPDATE' AND NEW.price IS DISTINCT FROM OLD.price) THEN
        INSERT INTO public.product_price_history (product_id, price, created_at)
        VALUES (NEW.id, NEW.price, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_log_price_change
AFTER INSERT OR UPDATE OF price ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.log_product_price_change();`,
  },
]
