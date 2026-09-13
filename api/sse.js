// api/sse.js - Vercel Serverless Function para MCP via SSE
// Nota: Vercel tem timeout de ~60s no plano Pro e ~10s no gratuito para funções serverless.
// Para uso real em producao, hospede o server-mcp.mjs num backend continuo (Render, Railway).

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

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
    total_leads: 191,
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
    "Retorna um resumo executivo do desempenho geral da landing page e campanhas. Use para obter uma visão rápida.",
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

  const transport = new SSEServerTransport('/api/messages', res);
  transports[transport.sessionId] = transport;
  
  res.on('close', () => {
    delete transports[transport.sessionId];
  });

  await server.connect(transport);
}
