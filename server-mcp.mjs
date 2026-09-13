import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const server = new McpServer({
  name: "Correto MCP Server",
  version: "1.0.0"
});

// Banco de dados simulado da Landing Page e Campanhas
const DB = {
  campaigns: [
    { name: 'Lançamento - Jardins Residence', platform: 'Meta Ads', budget: 'R$ 150,00', leads: 82, status: 'Ativa' },
    { name: 'Remarketing - Visitantes do site', platform: 'Meta Ads', budget: 'R$ 60,00', leads: 34, status: 'Ativa' },
    { name: 'Teste - Público frio', platform: 'Meta Ads', budget: 'R$ 40,00', leads: 12, status: 'Pausada' }
  ],
  floorPlans: [
    { name: '3 Suítes - 120m²', views: 4250, interactions3d: 1830, leads: 85, conversion_rate: '3.4%' },
    { name: '2 Quartos (1 Suíte) - 85m²', views: 3180, interactions3d: 1240, leads: 60, conversion_rate: '3.0%' },
    { name: 'Cobertura Duplex - 240m²', views: 1920, interactions3d: 650, leads: 15, conversion_rate: '1.7%' },
    { name: 'Studio - 45m²', views: 5120, interactions3d: 2100, leads: 40, conversion_rate: '1.2%' }
  ],
  tracking: {
    meta_pixel: { active: true, events: ['PageView', 'Lead', 'Contact'] },
    google_tag_manager: { active: false, events: [] },
    conversions_api: { active: false, events: [] }
  }
};

// Tool: Obter status das campanhas
server.tool(
  "get_campaigns_status",
  "Retorna a lista de campanhas de marketing ativas, seus orçamentos e leads gerados.",
  {},
  async () => {
    return {
      content: [{ type: "text", text: JSON.stringify(DB.campaigns, null, 2) }]
    };
  }
);

// Tool: Obter métricas de plantas 3D
server.tool(
  "get_floor_plans_performance",
  "Retorna o desempenho das plantas e dos modelos 3D, incluindo acessos, fotos visualizadas e leads gerados.",
  {},
  async () => {
    return {
      content: [{ type: "text", text: JSON.stringify(DB.floorPlans, null, 2) }]
    };
  }
);

// Tool: Obter configuração de tracking
server.tool(
  "get_tracking_setup",
  "Retorna os pixels de rastreamento e APIs de conversão ativas no site.",
  {},
  async () => {
    return {
      content: [{ type: "text", text: JSON.stringify(DB.tracking, null, 2) }]
    };
  }
);

let transport;

app.get("/sse", async (req, res) => {
  console.log("Nova conexão MCP (SSE) recebida!");
  transport = new SSEServerTransport("/messages", res);
  await server.connect(transport);
  
  res.on("close", () => {
    console.log("Conexão MCP encerrada.");
  });
});

app.post("/messages", async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No active transport");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor MCP da Correto rodando na porta ${PORT}`);
  console.log(`🔌 Endpoint SSE: http://localhost:${PORT}/sse`);
});
