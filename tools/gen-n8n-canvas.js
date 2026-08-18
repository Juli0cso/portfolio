/* Gera um canvas SVG fiel ao workflow, a partir das posições reais dos nós no
   export do n8n. Nenhum parâmetro é lido — só nome, tipo e coordenada. */
const fs = require('fs')

const SRC = 'C:/Users/Yuri/Downloads/Automação Mercado Livre -_ Telegram + VPS + Supabase (4).json'
const OUT = 'C:/Users/Yuri/portfolio/public/api/placeholder/project-n8n-canvas.svg'

const wf = JSON.parse(fs.readFileSync(SRC, 'utf8'))

/* Cor por família de nó. Sem semântica de marca: só diferenciação legível. */
const TONE = {
  scheduleTrigger: '#ff3333', manualTrigger: '#ff3333',
  supabase: '#3ecf8e', redis: '#e0554a', httpRequest: '#4d9fe8',
  telegram: '#37aee2', code: '#a78bfa', html: '#f0a04b',
  wait: '#d4a017', sort: '#5eb0a8', splitInBatches: '#5eb0a8',
  filter: '#5eb0a8', if: '#5eb0a8', itemLists: '#5eb0a8',
  aggregate: '#5eb0a8', set: '#8b96a3', noOp: '#5a636d',
  executeWorkflow: '#c084fc',
}
const short = (t) => t.replace('n8n-nodes-base.', '')

const nodes = wf.nodes.map((n) => ({
  name: n.name,
  kind: short(n.type),
  x: n.position[0],
  y: n.position[1],
  off: !!n.disabled,
}))

const byName = new Map(nodes.map((n) => [n.name, n]))

/* Arestas a partir do mapa de conexões. */
const edges = []
for (const [from, out] of Object.entries(wf.connections)) {
  const a = byName.get(from)
  if (!a) continue
  for (const branch of out.main || []) {
    for (const link of branch || []) {
      const b = byName.get(link.node)
      if (b) edges.push([a, b])
    }
  }
}

/* Normalização: origem no canto superior esquerdo do conteúdo. */
const NODE = 100
const minX = Math.min(...nodes.map((n) => n.x))
const minY = Math.min(...nodes.map((n) => n.y))
const spanX = Math.max(...nodes.map((n) => n.x)) - minX + NODE
const spanY = Math.max(...nodes.map((n) => n.y)) - minY + NODE

/* O card recorta em ~2.16:1, então a faixa de números ocupa o topo e o canvas
   fica com o resto — assim nada do fluxo é cortado. */
const W = 1200, H = 556, HEAD = 74, PAD = 26
const areaW = W - PAD * 2, areaH = H - HEAD - PAD
const k = Math.min(areaW / spanX, areaH / spanY)
const offX = PAD + (areaW - spanX * k) / 2
const offY = HEAD + (areaH - spanY * k) / 2
const px = (n) => offX + (n.x - minX) * k
const py = (n) => offY + (n.y - minY) * k
const box = NODE * k

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const parts = []
parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">`)
parts.push(`<rect width="${W}" height="${H}" fill="#0d0d0d"/>`)

/* Grade de fundo, como no canvas do n8n. */
parts.push(`<defs><pattern id="g" width="26" height="26" patternUnits="userSpaceOnUse">`)
parts.push(`<circle cx="1" cy="1" r="1" fill="#1e1e1e"/></pattern></defs>`)
parts.push(`<rect y="${HEAD}" width="${W}" height="${H - HEAD}" fill="url(#g)"/>`)

/* Cabeçalho com a escala real do workflow. */
const jsLines = wf.nodes
  .filter((n) => n.type.endsWith('.code'))
  .reduce((s, n) => s + (n.parameters.jsCode || '').split('\n').length, 0)

parts.push(`<text x="${PAD}" y="29" fill="#ff3333" font-family="monospace" font-size="19" font-weight="bold">PIPELINE n8n · CLUBE DA ECONOMIA</text>`)
const stats = [
  [nodes.length, 'NÓS'],
  [Object.keys(wf.connections).length, 'CONEXÕES'],
  /* Só os agendados: o gatilho manual existe para semear o cookie e não é uma
     rotina. Contar 6 aqui contradiria as "cinco rotinas" da aba de fluxo. */
  [nodes.filter((n) => n.kind === 'scheduleTrigger').length, 'AGENDADOS'],
  [jsLines, 'LINHAS DE JS'],
]
/* Os números são a parte que continua legível no tamanho do card, então
   levam mais peso que o desenho. */
let sx = PAD
stats.forEach(([v, label]) => {
  const vw = String(v).length * 12
  parts.push(`<text x="${sx}" y="60" fill="#f2f2f2" font-family="monospace" font-size="21" font-weight="bold">${v}</text>`)
  parts.push(`<text x="${sx + vw + 7}" y="60" fill="#7a7a7a" font-family="monospace" font-size="13">${label}</text>`)
  sx += vw + 7 + label.length * 7.9 + 30
})
parts.push(`<path d="M0 ${HEAD - 1}h${W}" stroke="#242424" stroke-width="2"/>`)

/* Arestas primeiro, para ficarem atrás dos nós. */
edges.forEach(([a, b]) => {
  const x1 = px(a) + box, y1 = py(a) + box / 2
  const x2 = px(b), y2 = py(b) + box / 2
  const dx = Math.max(14, Math.abs(x2 - x1) * 0.4)
  parts.push(`<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}C${(x1 + dx).toFixed(1)} ${y1.toFixed(1)} ${(x2 - dx).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="#3a3a3a" stroke-width="1.4"/>`)
})

/* Nós. */
nodes.forEach((n) => {
  const x = px(n), y = py(n)
  const tone = TONE[n.kind] || '#8b96a3'
  const dim = n.off ? 0.32 : 1
  const trigger = n.kind.includes('rigger')
  parts.push(`<g opacity="${dim}">`)
  parts.push(`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${box.toFixed(1)}" height="${box.toFixed(1)}" rx="${(box * (trigger ? 0.5 : 0.18)).toFixed(1)}" fill="#191919" stroke="${tone}" stroke-width="1.4"/>`)
  parts.push(`<rect x="${(x + box * 0.3).toFixed(1)}" y="${(y + box * 0.3).toFixed(1)}" width="${(box * 0.4).toFixed(1)}" height="${(box * 0.4).toFixed(1)}" rx="${(box * 0.08).toFixed(1)}" fill="${tone}"/>`)
  parts.push(`</g>`)
})

parts.push(`<text x="${PAD}" y="${H - 8}" fill="#4d4d4d" font-family="monospace" font-size="10">LAYOUT GERADO A PARTIR DAS COORDENADAS REAIS DO WORKFLOW</text>`)
parts.push(`</svg>`)

fs.writeFileSync(OUT, parts.join(''), 'utf8')
console.log('gerado:', OUT)
console.log('nos:', nodes.length, '| arestas:', edges.length, '| escala:', k.toFixed(3))
console.log('span original:', spanX, 'x', spanY)
