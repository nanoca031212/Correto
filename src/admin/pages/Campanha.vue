<template>
  <div>
    <h2 class="admin-section-title" style="margin-top:0">Conectar campanha</h2>
    <div class="admin-grid">
      <div class="admin-card platform-card" v-for="platform in platforms" :key="platform.name">
        <div class="platform-header">
          <span class="platform-icon" v-html="platform.icon"></span>
          <div class="platform-meta">
            <strong>{{ platform.name }}</strong>
            <span class="admin-badge" :class="platform.connected ? 'admin-badge-success' : 'admin-badge-off'">
              {{ platform.connected ? 'Conectado' : 'Não conectado' }}
            </span>
          </div>
        </div>
        <button
          class="admin-btn"
          :class="platform.connected ? 'admin-btn-outline' : 'admin-btn-primary'"
          @click="platform.connected = !platform.connected"
        >
          {{ platform.connected ? 'Desconectar' : 'Conectar' }}
        </button>
      </div>
    </div>

    <h2 class="admin-section-title">Campanhas ativas</h2>
    <div class="admin-card admin-card-flush">
      <table class="admin-data-table">
        <thead>
          <tr>
            <th>Campanha</th>
            <th>Plataforma</th>
            <th>Orçamento diário</th>
            <th>Leads</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in campaigns" :key="c.name">
            <td class="cell-strong">{{ c.name }}</td>
            <td>{{ c.platform }}</td>
            <td>{{ c.budget }}</td>
            <td>{{ c.leads }}</td>
            <td><span class="admin-badge" :class="c.badgeClass">{{ c.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="admin-section-title">Tracking</h2>
    <div class="admin-grid">
      <div class="admin-card tracking-card" v-for="track in tracking" :key="track.name">
        <div class="tracking-top">
          <span class="tracking-icon" v-html="track.icon"></span>
          <span class="admin-badge" :class="track.connected ? 'admin-badge-success' : 'admin-badge-off'">
            {{ track.connected ? 'Ativo' : 'Inativo' }}
          </span>
        </div>
        <strong>{{ track.name }}</strong>
        <p>{{ track.description }}</p>
      </div>
    </div>
  </div>
</template>

<script>
const ICON_META = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 15c2-6 4-9 6-9s2 4 4 9M9 9c-2 0-4 2-4 6s1 4 2 4 2-2 4-6M15 9c2 0 4 2 4 6s-1 4-2 4-2-2-4-6"/></svg>'
const ICON_GOOGLE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="0.8" fill="currentColor"/></svg>'
const ICON_TIKTOK = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.5 2.3 2.1 4 4.5 4.3"/></svg>'
const ICON_PIXEL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg>'
const ICON_GTM = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l7 4v6c0 5-3 8-7 10-4-2-7-5-7-10V6l7-4z"/></svg>'
const ICON_CAPI = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h4l2-7 4 14 2-7h4"/></svg>'

export default {
  name: 'AdminCampanha',
  data() {
    return {
      platforms: [
        { name: 'Meta Ads', icon: ICON_META, connected: true },
        { name: 'Google Ads', icon: ICON_GOOGLE, connected: false },
        { name: 'TikTok Ads', icon: ICON_TIKTOK, connected: false }
      ],
      campaigns: [
        { name: 'Lançamento - Jardins Residence', platform: 'Meta Ads', budget: 'R$ 150,00', leads: 82, status: 'Ativa', badgeClass: 'admin-badge-success' },
        { name: 'Remarketing - Visitantes do site', platform: 'Meta Ads', budget: 'R$ 60,00', leads: 34, status: 'Ativa', badgeClass: 'admin-badge-success' },
        { name: 'Teste - Público frio', platform: 'Meta Ads', budget: 'R$ 40,00', leads: 12, status: 'Pausada', badgeClass: 'admin-badge-pending' }
      ],
      tracking: [
        { name: 'Meta Pixel', icon: ICON_PIXEL, description: 'Eventos de PageView, Lead e Contact configurados no site.', connected: true },
        { name: 'Google Tag Manager', icon: ICON_GTM, description: 'Ainda não configurado para esta campanha.', connected: false },
        { name: 'Conversions API', icon: ICON_CAPI, description: 'Envio de eventos server-side para o Meta.', connected: false }
      ]
    }
  }
}
</script>

<style scoped>
.platform-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.platform-icon {
  width: 38px;
  height: 38px;
  border-radius: 9px;
  border: 1px solid #ececec;
  background: #fafafa;
  color: #3f3f46;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.platform-meta {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.platform-meta strong {
  font-size: 13.5px;
  font-weight: 600;
  color: #18181b;
}

.admin-card-flush {
  padding: 0;
  overflow: hidden;
}

.admin-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.admin-data-table th {
  text-align: left;
  padding: 12px 20px;
  background: #fafafa;
  color: #8a8a92;
  font-weight: 600;
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #ececec;
}

.admin-data-table td {
  padding: 13px 20px;
  border-bottom: 1px solid #f2f2f3;
  color: #52525b;
}

.admin-data-table .cell-strong {
  color: #18181b;
  font-weight: 500;
}

.admin-data-table tr:last-child td {
  border-bottom: none;
}

.tracking-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tracking-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tracking-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #ececec;
  background: #fafafa;
  color: #52525b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tracking-card strong {
  font-size: 13.5px;
  color: #18181b;
}

.tracking-card p {
  font-size: 12.5px;
  color: #71717a;
  line-height: 1.5;
}
</style>
