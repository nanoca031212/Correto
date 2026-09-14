// Fonte unica dos dados de "Atividades" que nao vem da lista de leads
// (src/admin/data/leads.js) - visualizacoes de plantas ao longo do tempo
// e o resumo agregado. Tanto a pagina Atividades quanto o MCP importam
// daqui, pra nunca ficarem dessincronizados.

export const summary = [
  { label: 'Total de leads',      value: '20', sub: 'contatos únicos' },
  { label: 'Contatados',          value: '6',  sub: 'aguardando retorno' },
  { label: 'Qualificados',        value: '3',  sub: 'alto interesse' },
  { label: 'Reunião qualificada', value: '4',  sub: 'formulário + WhatsApp' },
]

export const plantViews7d = [
  { label: 'Seg', value: 8 },
  { label: 'Ter', value: 12 },
  { label: 'Qua', value: 7 },
  { label: 'Qui', value: 15 },
  { label: 'Sex', value: 10 },
  { label: 'Sáb', value: 18 },
  { label: 'Dom', value: 14 },
]

export const segments = [
  { id: 'todos',       label: 'Todos',              count: 20 },
  { id: 'Novo',        label: 'Novo lead',          count: 8 },
  { id: 'Contatado',   label: 'Contatado',          count: 6 },
  { id: 'Qualificado', label: 'Qualificado',        count: 3 },
  { id: 'Perdido',     label: 'Perdido',            count: 3 },
  { id: 'reuniao',     label: 'Reunião qualificada', count: 4 },
  { id: 'form',        label: 'Formulário',         count: 9 },
  { id: 'whatsapp',    label: 'WhatsApp',           count: 7 },
  { id: 'planta',      label: 'Viu planta',         count: 6 },
]
