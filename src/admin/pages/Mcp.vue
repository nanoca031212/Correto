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
          da página, aos dados da campanha e ao tracking - tudo em tempo real, sem
          precisar copiar e colar nada manualmente.
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
              <li>Abra as configurações de MCP/ferramentas do seu app de IA.</li>
              <li>Adicione um novo servidor MCP usando o endpoint acima.</li>
              <li>Cole a chave de acesso quando solicitado.</li>
              <li>Pergunte algo como "resuma os leads da campanha desta semana".</li>
            </ol>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
const ICON_DOC = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></svg>'
const ICON_CAMPAIGN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l18-7-7 18-2.5-7.5L3 11z"/></svg>'
const ICON_TRACK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 19V10M11 19V5M18 19v-7"/></svg>'

export default {
  name: 'AdminMcp',
  data() {
    return {
      connected: false,
      endpoint: 'https://mcp.jardinsresidence.com.br/sse',
      apiKey: 'jr_mcp_8f2c1a9d4e6b7f30',
      scope: [
        { icon: ICON_DOC, title: 'Conteúdo da página', description: 'Textos, seções, plantas, fotos e vídeos publicados no site.' },
        { icon: ICON_CAMPAIGN, title: 'Campanha', description: 'Quais campanhas estão conectadas, orçamento e criativos em uso.' },
        { icon: ICON_TRACK, title: 'Tracking', description: 'Eventos do Pixel, conversões e desempenho por seção do site.' }
      ]
    }
  },
  methods: {
    toggleConnection() {
      this.connected = !this.connected
    },
    copy(text) {
      navigator.clipboard?.writeText(text).catch(() => {})
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

.mcp-intro .admin-btn {
  flex-shrink: 0;
}

.mcp-grid {
  margin-bottom: 8px;
}

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

.mcp-scope-list strong {
  font-size: 13.5px;
  color: #18181b;
}

.mcp-scope-list p {
  font-size: 12.5px;
  color: #71717a;
  margin-top: 2px;
}

.mcp-steps {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 13.5px;
  color: #3f3f46;
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

.h-100 {
  height: 100%;
  box-sizing: border-box;
}

@media (max-width: 900px) {
  .mcp-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .mcp-intro {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
