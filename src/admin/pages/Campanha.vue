<template>
  <div>
    <h2 class="admin-section-title" style="margin-top:0">Conectar campanha</h2>
    <div class="admin-grid">
      <div class="admin-card platform-card" v-for="platform in platforms" :key="platform.name">
        <div class="platform-header">
          <span class="platform-icon" :style="{ background: platform.color }">{{ platform.initial }}</span>
          <div>
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
    <div class="admin-card" style="padding: 0; overflow: hidden;">
      <table class="campanha-table">
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
            <td>{{ c.name }}</td>
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
        <div class="tracking-info">
          <strong>{{ track.name }}</strong>
          <p>{{ track.description }}</p>
        </div>
        <span class="admin-badge" :class="track.connected ? 'admin-badge-success' : 'admin-badge-off'">
          {{ track.connected ? 'Ativo' : 'Inativo' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminCampanha',
  data() {
    return {
      platforms: [
        { name: 'Meta Ads', initial: 'M', color: '#1877f2', connected: true },
        { name: 'Google Ads', initial: 'G', color: '#ea4335', connected: false },
        { name: 'TikTok Ads', initial: 'T', color: '#111827', connected: false }
      ],
      campaigns: [
        { name: 'Lançamento - Jardins Residence', platform: 'Meta Ads', budget: 'R$ 150,00', leads: 82, status: 'Ativa', badgeClass: 'admin-badge-success' },
        { name: 'Remarketing - Visitantes do site', platform: 'Meta Ads', budget: 'R$ 60,00', leads: 34, status: 'Ativa', badgeClass: 'admin-badge-success' },
        { name: 'Teste - Público frio', platform: 'Meta Ads', budget: 'R$ 40,00', leads: 12, status: 'Pausada', badgeClass: 'admin-badge-pending' }
      ],
      tracking: [
        { name: 'Meta Pixel', description: 'Eventos de PageView, Lead e Contact configurados no site.', connected: true },
        { name: 'Google Tag Manager', description: 'Ainda não configurado para esta campanha.', connected: false },
        { name: 'Conversions API', description: 'Envio de eventos server-side para o Meta.', connected: false }
      ]
    }
  }
}
</script>

<style scoped>
.platform-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.platform-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.platform-header strong {
  display: block;
  font-size: 14px;
  color: #14171f;
  margin-bottom: 4px;
}

.campanha-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.campanha-table th {
  text-align: left;
  padding: 14px 20px;
  background: #f9fafb;
  color: #6b7280;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  border-bottom: 1px solid #e5e7eb;
}

.campanha-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f1f3;
  color: #1a1d23;
}

.campanha-table tr:last-child td {
  border-bottom: none;
}

.tracking-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.tracking-info strong {
  font-size: 14px;
  color: #14171f;
  display: block;
  margin-bottom: 4px;
}

.tracking-info p {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}
</style>
