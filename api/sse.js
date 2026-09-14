// api/sse.js - Vercel Serverless Function para MCP via SSE
// Nota: Vercel tem timeout de ~60s no plano Pro e ~10s no gratuito para funções serverless.
// Para uso real em producao, hospede o server-mcp.mjs num backend continuo (Render, Railway).

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
// Mesmos dados de src/admin/data/leads.js e src/admin/data/activity.js
// (usados nas telas /admin/atividades e /admin/mcp) - inline aqui em
// vez de importar de fora de api/, pra nao depender do tracing de
// arquivos cruzados pelo build serverless da Vercel (suspeita de ser
// a causa do FUNCTION_INVOCATION_FAILED em producao).
const leads = [
  {
    id: 1, name: 'Ana Paula Souza', interest: '2 quartos',
    email: 'ana.paula@email.com', phone: '(45) 99801-2345',
    source: 'Facebook Ads', date: 'Hoje, 09:41', status: 'Novo',
    reuniao: true, tags: ['Novo', 'Formulário', 'WhatsApp'], type: 'form',
    message: 'Tenho interesse em um apartamento de 2 quartos, de preferência no andar alto.',
    utm_campaign: 'jardins-lancamento-2024', utm_medium: 'cpc',
  },
  {
    id: 2, name: 'Marcos Vinícius', interest: '3 quartos',
    email: 'marcos.v@gmail.com', phone: '(45) 98822-6789',
    source: 'Instagram', date: 'Hoje, 08:15', status: 'Contatado',
    reuniao: false, tags: ['Contatado'], type: 'whatsapp',
    message: 'Vi o anúncio no Instagram, quero saber mais sobre os 3 quartos.',
    utm_campaign: 'jardins-instagram-stories', utm_medium: 'social',
  },
  {
    id: 3, name: 'Fernanda Lima', interest: 'Cobertura',
    email: 'fernanda.lima@outlook.com', phone: '(45) 99733-4321',
    source: 'Google Ads', date: 'Ontem, 19:02', status: 'Contatado',
    reuniao: true, tags: ['Contatado', 'Qualificado', 'Formulário', 'WhatsApp'], type: 'form',
    message: 'Procuro uma cobertura duplex. Já visitei o estande. Aguardando proposta.',
    utm_campaign: 'jardins-google-brand', utm_medium: 'cpc',
  },
  {
    id: 4, name: 'Ricardo Alves', interest: '2 quartos',
    email: 'ricardoalves@yahoo.com.br', phone: '(45) 99644-8765',
    source: 'Facebook Ads', date: 'Ontem, 14:37', status: 'Novo',
    reuniao: false, tags: ['Novo'], type: 'form',
    message: null, utm_campaign: 'jardins-lancamento-2024', utm_medium: 'cpc',
  },
  {
    id: 5, name: 'Juliana Prado', interest: 'Área de lazer',
    email: 'ju.prado@gmail.com', phone: '(45) 99555-0011',
    source: 'Site direto', date: '2 dias atrás', status: 'Perdido',
    reuniao: false, tags: ['Perdido'], type: 'whatsapp',
    message: 'Tive interesse mas vou aguardar próximo lançamento.',
    utm_campaign: null, utm_medium: null,
  },
  {
    id: 6, name: 'Carlos Henrique', interest: '3 quartos',
    email: 'carlos.h@empresa.com.br', phone: '(44) 98811-2200',
    source: 'Instagram', date: '2 dias atrás', status: 'Qualificado',
    reuniao: false, tags: ['Qualificado'], type: 'planta',
    message: 'Quero um apartamento de 3 quartos para investimento.',
    utm_campaign: 'jardins-instagram-feed', utm_medium: 'social',
  },
  {
    id: 7, name: 'Patrícia Mendes', interest: 'Cobertura',
    email: 'patricia.mendes@gmail.com', phone: '(45) 99900-7788',
    source: 'Google Ads', date: '3 dias atrás', status: 'Contatado',
    reuniao: false, tags: ['Contatado'], type: 'planta',
    message: null, utm_campaign: 'jardins-google-display', utm_medium: 'display',
  },
  {
    id: 8, name: 'Bruno Ferreira', interest: '2 quartos',
    email: 'brunoferr@hotmail.com', phone: '(45) 98833-5544',
    source: 'Facebook Ads', date: '3 dias atrás', status: 'Novo',
    reuniao: false, tags: ['Novo', 'WhatsApp'], type: 'whatsapp',
    message: 'Me enviou mensagem pelo WhatsApp após ver o anúncio.',
    utm_campaign: 'jardins-lancamento-2024', utm_medium: 'cpc',
  },
  {
    id: 9, name: 'Larissa Costa', interest: '1 quarto',
    email: 'larissa.costa@icloud.com', phone: '(45) 99767-3322',
    source: 'Site direto', date: '4 dias atrás', status: 'Qualificado',
    reuniao: false, tags: ['Qualificado', 'Formulário'], type: 'form',
    message: 'Preciso de um apartamento studio ou 1 quarto, para uso próprio.',
    utm_campaign: null, utm_medium: null,
  },
  {
    id: 10, name: 'Diego Santos', interest: '3 quartos',
    email: 'diegosantos@gmail.com', phone: '(45) 98899-6655',
    source: 'Instagram', date: '5 dias atrás', status: 'Novo',
    reuniao: false, tags: ['Novo'], type: 'planta',
    message: null, utm_campaign: 'jardins-instagram-stories', utm_medium: 'social',
  },
  {
    id: 11, name: 'Camila Rodrigues', interest: '2 quartos',
    email: 'camila.rod@gmail.com', phone: '(45) 99812-3344',
    source: 'Facebook Ads', date: '5 dias atrás', status: 'Contatado',
    reuniao: true, tags: ['Contatado', 'Formulário', 'WhatsApp'], type: 'form',
    message: 'Gostei muito do projeto, quero marcar uma visita ao estande.',
    utm_campaign: 'jardins-lancamento-2024', utm_medium: 'cpc',
  },
  {
    id: 12, name: 'Felipe Moraes', interest: '3 quartos',
    email: 'felipe.moraes@hotmail.com', phone: '(45) 98844-5566',
    source: 'Google Ads', date: '5 dias atrás', status: 'Novo',
    reuniao: false, tags: ['Novo', 'Formulário'], type: 'form',
    message: 'Quero informações sobre financiamento.',
    utm_campaign: 'jardins-google-brand', utm_medium: 'cpc',
  },
  {
    id: 13, name: 'Aline Teixeira', interest: 'Cobertura',
    email: 'aline.tx@email.com', phone: '(44) 99933-7788',
    source: 'Instagram', date: '6 dias atrás', status: 'Qualificado',
    reuniao: true, tags: ['Qualificado', 'WhatsApp'], type: 'whatsapp',
    message: 'Tenho interesse na cobertura, já tenho impedância aprovada no banco.',
    utm_campaign: 'jardins-instagram-feed', utm_medium: 'social',
  },
  {
    id: 14, name: 'Rafael Barbosa', interest: '2 quartos',
    email: 'rafael.b@yahoo.com.br', phone: '(45) 99711-2233',
    source: 'Facebook Ads', date: '6 dias atrás', status: 'Perdido',
    reuniao: false, tags: ['Perdido'], type: 'form',
    message: 'Não tenho mais interesse no momento.',
    utm_campaign: 'jardins-lancamento-2024', utm_medium: 'cpc',
  },
  {
    id: 15, name: 'Isabela Cunha', interest: '1 quarto',
    email: 'isa.cunha@gmail.com', phone: '(45) 98822-9900',
    source: 'Site direto', date: '6 dias atrás', status: 'Novo',
    reuniao: false, tags: ['Novo', 'Formulário'], type: 'form',
    message: 'Procuro investimento de baixo valor, 1 quarto seria ideal.',
    utm_campaign: null, utm_medium: null,
  },
  {
    id: 16, name: 'Thiago Carvalho', interest: '3 quartos',
    email: 'thiago.c@icloud.com', phone: '(45) 99600-4455',
    source: 'Google Ads', date: '7 dias atrás', status: 'Contatado',
    reuniao: true, tags: ['Contatado', 'Formulário'], type: 'form',
    message: 'Quero saber mais sobre o lazer e área gourmet.',
    utm_campaign: 'jardins-google-brand', utm_medium: 'cpc',
  },
  {
    id: 17, name: 'Vanessa Oliveira', interest: 'Cobertura',
    email: 'vanessa.oli@gmail.com', phone: '(45) 98800-6677',
    source: 'Instagram', date: '7 dias atrás', status: 'Contatado',
    reuniao: false, tags: ['Contatado', 'WhatsApp'], type: 'whatsapp',
    message: null, utm_campaign: 'jardins-instagram-stories', utm_medium: 'social',
  },
  {
    id: 18, name: 'Eduardo Lima', interest: '2 quartos',
    email: 'edu.lima@outlook.com', phone: '(44) 99922-8800',
    source: 'Facebook Ads', date: '7 dias atrás', status: 'Novo',
    reuniao: false, tags: ['Novo', 'WhatsApp'], type: 'whatsapp',
    message: 'Vi o post e achei muito interessante o projeto.',
    utm_campaign: 'jardins-lancamento-2024', utm_medium: 'cpc',
  },
  {
    id: 19, name: 'Mariana Freitas', interest: 'Área de lazer',
    email: 'mari.freitas@gmail.com', phone: '(45) 99544-3311',
    source: 'Site direto', date: '7 dias atrás', status: 'Perdido',
    reuniao: false, tags: ['Perdido'], type: 'planta',
    message: 'Já comprei outro imóvel, obrigada.',
    utm_campaign: null, utm_medium: null,
  },
  {
    id: 20, name: 'Lucas Pereira', interest: '3 quartos',
    email: 'lucas.per@gmail.com', phone: '(45) 98877-1122',
    source: 'Instagram', date: '7 dias atrás', status: 'Novo',
    reuniao: false, tags: ['Novo', 'Formulário'], type: 'form',
    message: 'Quero receber o book de apresentação do empreendimento.',
    utm_campaign: 'jardins-instagram-feed', utm_medium: 'social',
  },
];

const activitySummary = [
  { label: 'Total de leads', value: '20', sub: 'contatos únicos' },
  { label: 'Contatados', value: '6', sub: 'aguardando retorno' },
  { label: 'Qualificados', value: '3', sub: 'alto interesse' },
  { label: 'Reunião qualificada', value: '4', sub: 'formulário + WhatsApp' }
];
const plantViews7d = [
  { label: 'Seg', value: 8 },
  { label: 'Ter', value: 12 },
  { label: 'Qua', value: 7 },
  { label: 'Qui', value: 15 },
  { label: 'Sex', value: 10 },
  { label: 'Sáb', value: 18 },
  { label: 'Dom', value: 14 }
];
const segments = [
  { id: 'todos', label: 'Todos', count: 20 },
  { id: 'Novo', label: 'Novo lead', count: 8 },
  { id: 'Contatado', label: 'Contatado', count: 6 },
  { id: 'Qualificado', label: 'Qualificado', count: 3 },
  { id: 'Perdido', label: 'Perdido', count: 3 },
  { id: 'reuniao', label: 'Reunião qualificada', count: 4 },
  { id: 'form', label: 'Formulário', count: 9 },
  { id: 'whatsapp', label: 'WhatsApp', count: 7 },
  { id: 'planta', label: 'Viu planta', count: 6 }
];

// Banco de dados de contexto do empreendimento Correto / Jardins Residence
const DB = {
  site: {
    url: "https://correto-zeta.vercel.app/",
    name: "Jardins Residence",
    description: "Landing page de vendas do empreendimento Jardins Residence.",
    sections: ["Hero", "Sobre o empreendimento", "Plantas e modelos 3D", "Galeria", "Localização", "Formulário de contato"]
  },
  campaigns: [
    { name: 'Lançamento - Jardins Residence', platform: 'Meta Ads', budget: 'R$ 150,00/dia', leads: 82, cpl: 'R$ 8,54', status: 'Ativa' },
    { name: 'Remarketing - Visitantes do site', platform: 'Meta Ads', budget: 'R$ 60,00/dia', leads: 34, cpl: 'R$ 9,12', status: 'Ativa' },
    { name: 'Teste - Público frio', platform: 'Meta Ads', budget: 'R$ 40,00/dia', leads: 12, cpl: 'R$ 18,33', status: 'Pausada' }
  ],
  floorPlans: [
    { name: '3 Suítes - 120m²', type: 'Apartamento', views: 4250, photosViewed: 1830, leads: 85, conversion_rate: '3.4%', performance: 'Alto' },
    { name: '2 Quartos (1 Suíte) - 85m²', type: 'Apartamento', views: 3180, photosViewed: 1240, leads: 60, conversion_rate: '3.0%', performance: 'Médio' },
    { name: 'Cobertura Duplex - 240m²', type: 'Cobertura', views: 1920, photosViewed: 650, leads: 15, conversion_rate: '1.7%', performance: 'Baixo' },
    { name: 'Studio - 45m²', type: 'Studio', views: 5120, photosViewed: 2100, leads: 40, conversion_rate: '1.2%', performance: 'Baixo' }
  ],
  tourVirtual3d: [
    { name: 'Tour Virtual - 3 Suítes (120m²)', visualizations: 1830, avgTime: '02:45', engagement: 'Alto' },
    { name: 'Tour Virtual - 2 Quartos (85m²)', visualizations: 1240, avgTime: '01:30', engagement: 'Médio' },
    { name: 'Tour Virtual - Studio (45m²)', visualizations: 2100, avgTime: '03:10', engagement: 'Muito Alto' }
  ],
  tracking: {
    meta_pixel: { active: true, events: ['PageView', 'Lead', 'Contact'], pixel_id: '••••••7890' },
    google_tag_manager: { active: false, events: [] },
    conversions_api: { active: false, events: [] }
  },
  summary: {
    // Mesma contagem da lista real de leads (get_leads) - nao um numero
    // solto desencontrado, pra IA nunca reportar um total diferente da
    // lista de contatos que ela mesma pode listar.
    total_leads: leads.length,
    total_budget_daily: 'R$ 250,00',
    avg_cpl: 'R$ 10,47',
    most_viewed_plan: 'Studio - 45m²',
    highest_converting_plan: '3 Suítes - 120m²',
    active_campaigns: 2,
    paused_campaigns: 1
  }
};

// Mapa de transports ativas (para producao real, usaria Redis ou banco externo)
const transports = {};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  const server = new McpServer({
    name: "Correto MCP - Jardins Residence",
    version: "1.0.0",
    description: "Servidor MCP com todos os dados de campanha, desempenho de plantas e tracking do empreendimento Jardins Residence. URL: https://correto-zeta.vercel.app/"
  });

  // Tool 1: Resumo geral
  server.tool(
    "get_summary",
    "Retorna um resumo executivo do desempenho geral da landing page e campanhas. O campo total_leads conta apenas leads reais (mesma lista da tool get_leads) - nao inclui visitantes que so visualizaram a pagina sem preencher formulario, clicar no WhatsApp ou gerar alguma atividade registrada.",
    {},
    async () => ({ content: [{ type: "text", text: JSON.stringify(DB.summary, null, 2) }] })
  );

  // Tool 2: Campanhas
  server.tool(
    "get_campaigns_status",
    "Retorna a lista detalhada das campanhas de marketing (Meta Ads, Google Ads), com orçamento, CPL (custo por lead) e leads gerados.",
    {},
    async () => ({ content: [{ type: "text", text: JSON.stringify(DB.campaigns, null, 2) }] })
  );

  // Tool 3: Desempenho de plantas
  server.tool(
    "get_floor_plans_performance",
    "Retorna o desempenho de cada planta (apartamento, cobertura, studio): visualizações, fotos vistas, leads gerados e taxa de conversão.",
    {},
    async () => ({ content: [{ type: "text", text: JSON.stringify(DB.floorPlans, null, 2) }] })
  );

  // Tool 4: Tour 3D
  server.tool(
    "get_3d_tour_metrics",
    "Retorna as métricas dos tours virtuais 3D de cada planta: número de visualizações, tempo médio e nível de engajamento.",
    {},
    async () => ({ content: [{ type: "text", text: JSON.stringify(DB.tourVirtual3d, null, 2) }] })
  );

  // Tool 5: Tracking
  server.tool(
    "get_tracking_setup",
    "Retorna a configuração atual dos pixels e APIs de rastreamento (Meta Pixel, GTM, Conversions API).",
    {},
    async () => ({ content: [{ type: "text", text: JSON.stringify(DB.tracking, null, 2) }] })
  );

  // Tool 6: Informações do site
  server.tool(
    "get_site_info",
    "Retorna informações gerais sobre o site e o empreendimento, incluindo URL, nome e seções disponíveis.",
    {},
    async () => ({ content: [{ type: "text", text: JSON.stringify(DB.site, null, 2) }] })
  );

  // Tool 7: Leads/clientes (mesma base usada no admin, em /admin/atividades)
  server.tool(
    "get_leads",
    "Retorna a lista de leads reais (a mesma base exibida em /admin/atividades): contatos que preencheram o formulário, clicaram no WhatsApp ou tiveram alguma atividade registrada - nome, e-mail, telefone, interesse, origem, status, tags e mensagem. NAO inclui simples visitantes que apenas entraram/visualizaram a página sem essa atividade.",
    {},
    async () => ({ content: [{ type: "text", text: JSON.stringify(leads, null, 2) }] })
  );

  // Tool 8: Visao geral de Atividades (mesma tela /admin/atividades)
  server.tool(
    "get_activity_overview",
    "Retorna a visao geral completa da pagina /admin/atividades: resumo agregado de leads (total, contatados, qualificados, reuniao qualificada), segmentacao por status/origem/tipo de atividade, a serie diaria de visualizacoes de plantas dos ultimos 7 dias, e a lista completa de leads/clientes (nome, e-mail, telefone, interesse, origem, status, tags e mensagem de cada contato).",
    {},
    async () => ({
      content: [{
        type: "text",
        text: JSON.stringify({ summary: activitySummary, segments, plant_views_last_7_days: plantViews7d, leads }, null, 2)
      }]
    })
  );

  const transport = new SSEServerTransport('/api/messages', res);
  transports[transport.sessionId] = transport;
  
  res.on('close', () => {
    delete transports[transport.sessionId];
  });

  await server.connect(transport);
}
