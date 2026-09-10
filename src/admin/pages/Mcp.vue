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

      <h2 class="admin-section-title">O que a IA vai enxergar</h2>
      <div class="admin-card">
        <ul class="mcp-scope-list">
          <li v-for="item in scope" :key="item.title">
            <span class="mcp-scope-icon">{{ item.icon }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.description }}</p>
            </div>
          </li>
        </ul>
      </div>

      <h2 class="admin-section-title">Como configurar</h2>
      <div class="admin-card">
        <ol class="mcp-steps">
          <li>Abra as configurações de MCP/ferramentas do seu app de IA.</li>
          <li>Adicione um novo servidor MCP usando o endpoint acima.</li>
          <li>Cole a chave de acesso quando solicitado.</li>
          <li>Pergunte algo como "resuma os leads da campanha desta semana".</li>
        </ol>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AdminMcp',
  data() {
    return {
      connected: false,
      endpoint: 'https://mcp.jardinsresidence.com.br/sse',
      apiKey: 'jr_mcp_8f2c1a9d4e6b7f30',
      scope: [
        { icon: '📄', title: 'Conteúdo da página', description: 'Textos, seções, plantas, fotos e vídeos publicados no site.' },
        { icon: '📣', title: 'Campanha', description: 'Quais campanhas estão conectadas, orçamento e criativos em uso.' },
        { icon: '📈', title: 'Tracking', description: 'Eventos do Pixel, conversões e desempenho por seção do site.' }
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
  font-size: 20px;
  font-weight: 600;
  margin: 10px 0 8px;
  color: #14171f;
}

.mcp-intro p {
  color: #6b7280;
  font-size: 14px;
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
  background: #f4f5f7;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #14171f;
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
  font-size: 20px;
}

.mcp-scope-list strong {
  font-size: 14px;
  color: #14171f;
}

.mcp-scope-list p {
  font-size: 13px;
  color: #6b7280;
  margin-top: 2px;
}

.mcp-steps {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 14px;
  color: #374151;
}

@media (max-width: 640px) {
  .mcp-intro {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
