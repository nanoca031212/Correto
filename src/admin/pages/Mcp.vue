<template>
  <div>
    <div class="admin-card mcp-intro">
      <div>
        <span class="admin-badge" :class="connected ? 'admin-badge-success' : 'admin-badge-off'">
          {{ connected ? 'IA conectada' : 'Nenhuma IA conectada' }}
        </span>
        <h2>Conecte a sua IA a este empreendimento</h2>
        <p>
          Gere uma conexão MCP (Model Context Protocol) para que a IA que você já usa
          (Claude, ChatGPT, ou outra com suporte a MCP) tenha acesso direto ao conteúdo
          da página, aos dados da campanha, tracking e — agora — à <strong>base completa de leads</strong>
          com nome, e-mail, telefone e interesse de cada contato.
        </p>
      </div>
      <button class="admin-btn admin-btn-primary" @click="toggleConnection">
        {{ connected ? 'Desconectar' : 'Gerar conexão' }}
      </button>
    </div>

    <template v-if="connected">
      <h2 class="admin-section-title">Dados da conexão</h2>
      <div class="admin-grid mcp-grid">
        <div class="admin-card">
          <div class="admin-card-title">Endpoint MCP</div>
          <div class="mcp-field">
            <code>{{ endpoint }}</code>
            <button class="admin-btn admin-btn-outline" @click="copy(endpoint)">Copiar</button>
          </div>
        </div>
        <div class="admin-card">
          <div class="admin-card-title">Chave de acesso</div>
          <div class="mcp-field">
            <code>{{ apiKey }}</code>
            <button class="admin-btn admin-btn-outline" @click="copy(apiKey)">Copiar</button>
          </div>
        </div>
      </div>

      <!-- LEADS PREVIEW -->
      <h2 class="admin-section-title">
        Base de leads — dados enviados ao contexto da IA
        <span class="mcp-leads-count">{{ leads.length }} contatos</span>
      </h2>
      <div class="admin-card admin-card-flush mcp-leads-card">
        <table class="admin-data-table mcp-leads-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Telefone</th>
              <th>Interesse</th>
              <th>Origem</th>
              <th>Status</th>
              <th>Mensagem</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lead in leads" :key="lead.id">
              <td class="cell-strong">{{ lead.name }}</td>
              <td>
                <a :href="'mailto:' + lead.email" class="mcp-link">{{ lead.email }}</a>
              </td>
              <td>
                <a :href="'https://wa.me/55' + lead.phone.replace(/\D/g,'')" target="_blank" class="mcp-link mcp-link--wa">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.105 1.523 5.827L.057 23.884l6.204-1.626A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.37l-.359-.213-3.722.976.993-3.63-.234-.373A9.818 9.818 0 0 1 2.18 12c0-5.42 4.4-9.818 9.818-9.818 5.42 0 9.818 4.399 9.818 9.818 0 5.42-4.398 9.818-9.817 9.818z"/></svg>
                  {{ lead.phone }}
                </a>
              </td>
              <td>{{ lead.interest }}</td>
              <td>{{ lead.source }}</td>
              <td>
                <span class="admin-badge" :class="statusBadge(lead.status)">{{ lead.status }}</span>
              </td>
              <td class="mcp-msg-cell">{{ lead.message || '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- JSON PREVIEW -->
      <h2 class="admin-section-title">Payload MCP — prévia do contexto enviado</h2>
      <div class="admin-card mcp-json-card">
        <div class="mcp-json-toolbar">
          <span class="mcp-json-label">leads_context.json</span>
          <button class="admin-btn admin-btn-outline mcp-json-copy" @click="copy(jsonPayload)">Copiar JSON</button>
        </div>
        <pre class="mcp-code">{{ jsonPayload }}</pre>
      </div>

      <div class="admin-grid mcp-info-grid">
        <div class="mcp-info-col">
          <h2 class="admin-section-title">O que a IA vai enxergar</h2>
          <div class="admin-card h-100">
            <ul class="mcp-scope-list">
              <li v-for="item in scope" :key="item.title">
                <span class="mcp-scope-icon" v-html="item.icon"></span>
                <div>
                  <strong>{{ item.title }}</strong>
                  <p>{{ item.description }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="mcp-info-col">
          <h2 class="admin-section-title">Como configurar</h2>
          <div class="admin-card h-100">
            <ol class="mcp-steps">
              <li>Abra as configurações do <strong>Claude Desktop</strong> (ou outra IA com suporte a MCP).</li>
              <li>Localize o arquivo <code>claude_desktop_config.json</code> e adicione:
                <pre class="mcp-code" v-pre>{
  "mcpServers": {
    "CorretoLandingPage": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://correto-zeta.vercel.app/api/sse"
      ]
    }
  }
}</pre>
              </li>
              <li>Reinicie o Claude Desktop. O servidor MCP aparecerá conectado.</li>
              <li>Pergunte algo como: <em>"Qual lead tem mais interesse em cobertura?"</em> ou <em>"Liste os contatos que vieram do Facebook Ads."</em></li>
            </ol>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const ICON_DOC      = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></svg>'
const ICON_CAMPAIGN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l18-7-7 18-2.5-7.5L3 11z"/></svg>'
const ICON_TRACK    = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V10M11 19V5M18 19v-7"/></svg>'
const ICON_LEADS    = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'

export default {
  name: 'AdminMcp',
  data() {
    return {
      connected: false,
      endpoint: 'https://correto-zeta.vercel.app/api/sse',
      apiKey: 'jr_mcp_8f2c1a9d4e6b7f30',
      leads: [
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
      ],
      scope: [
        { icon: ICON_DOC,      title: 'Resumo executivo',          description: 'Total de leads, CPL médio, orçamento diário e melhores plantas.' },
        { icon: ICON_LEADS,    title: 'Base de Leads',             description: 'Nome, e-mail, telefone, interesse, origem e mensagem de cada lead.' },
        { icon: ICON_CAMPAIGN, title: 'Campanhas e Orçamento',     description: 'Status, custo por lead e leads gerados por campanha (Meta Ads, Google Ads).' },
        { icon: ICON_TRACK,    title: 'Desempenho das Plantas',    description: 'Acessos, fotos visualizadas e taxa de conversão por planta e tour 3D.' },
      ]
    }
  },
  computed: {
    jsonPayload() {
      const payload = {
        context: 'jardins_residence_leads',
        generated_at: new Date().toISOString(),
        total: this.leads.length,
        leads: this.leads.map(l => ({
          id: l.id,
          name: l.name,
          email: l.email,
          phone: l.phone,
          interest: l.interest,
          source: l.source,
          status: l.status,
          message: l.message || null,
        }))
      }
      return JSON.stringify(payload, null, 2)
    }
  },
  methods: {
    toggleConnection() {
      this.connected = !this.connected
    },
    copy(text) {
      navigator.clipboard?.writeText(text).catch(() => {})
    },
    statusBadge(status) {
      const map = {
        'Novo': 'admin-badge-info',
        'Contatado': 'admin-badge-success',
        'Qualificado': 'admin-badge-warning',
        'Perdido': 'admin-badge-off',
      }
      return map[status] || ''
    }
  }
}
</script>

<style scoped>
.mcp-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.mcp-intro h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 10px 0 8px;
  color: #18181b;
  letter-spacing: -0.1px;
}

.mcp-intro p {
  color: #71717a;
  font-size: 13.5px;
  max-width: 560px;
  line-height: 1.6;
}

.mcp-intro .admin-btn { flex-shrink: 0; }

.mcp-grid { margin-bottom: 8px; }

.mcp-field {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mcp-field code {
  flex: 1;
  background: #fafafa;
  border: 1px solid #ececec;
  padding: 9px 12px;
  border-radius: 6px;
  font-size: 12.5px;
  color: #18181b;
  overflow-x: auto;
  white-space: nowrap;
}

/* ── LEADS TABLE ── */
.admin-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mcp-leads-count {
  font-size: 11.5px;
  font-weight: 600;
  background: #eff6ff;
  color: #2563eb;
  padding: 2px 9px;
  border-radius: 999px;
}

.mcp-leads-card {
  overflow-x: auto;
}

.mcp-leads-table {
  min-width: 900px;
}

.mcp-link {
  color: #2563eb;
  text-decoration: none;
  font-size: 13px;
}
.mcp-link:hover { text-decoration: underline; }

.mcp-link--wa {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #059669 !important;
}

.mcp-msg-cell {
  max-width: 220px;
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ── JSON PREVIEW ── */
.mcp-json-card { padding: 0; overflow: hidden; }

.mcp-json-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid #ececec;
  background: #fafafa;
}

.mcp-json-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  font-family: 'Courier New', monospace;
}

.mcp-json-copy { font-size: 12px; padding: 5px 12px; }

.mcp-scope-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.mcp-scope-list li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
}

.mcp-scope-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #fafafa;
  border: 1px solid #ececec;
  color: #52525b;
  flex-shrink: 0;
}

.mcp-scope-list strong { font-size: 13.5px; color: #18181b; }
.mcp-scope-list p { font-size: 12.5px; color: #71717a; margin-top: 2px; }

.mcp-steps {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13.5px;
  color: #3f3f46;
}

.mcp-steps code {
  background: #f3f4f6;
  border-radius: 4px;
  padding: 1px 6px;
  font-family: 'Fira Code', monospace;
  font-size: 12px;
  color: #6366f1;
}

.mcp-steps em { color: #374151; font-style: italic; }

.mcp-code {
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 0 0 8px 8px;
  padding: 16px;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 11.5px;
  line-height: 1.7;
  margin: 0;
  overflow-x: auto;
  white-space: pre;
  max-height: 380px;
}

.mcp-steps .mcp-code {
  border-radius: 8px;
  margin: 8px 0 0;
}

.mcp-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.mcp-info-col {
  display: flex;
  flex-direction: column;
}

.h-100 { height: 100%; box-sizing: border-box; }

/* Status badges extras */
:deep(.admin-badge-info)    { background: #eff6ff; color: #2563eb; }
:deep(.admin-badge-warning) { background: #fefce8; color: #ca8a04; }

@media (max-width: 900px) {
  .mcp-info-grid { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .mcp-intro { flex-direction: column; align-items: flex-start; }
}
</style>

