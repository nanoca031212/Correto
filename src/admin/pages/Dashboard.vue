<template>
  <div>
    <div class="admin-grid">
      <div class="admin-card stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-card-top">
          <div class="admin-card-title">{{ stat.label }}</div>
          <span class="admin-stat-icon" v-html="stat.icon"></span>
        </div>
        <div class="admin-stat-value">{{ stat.value }}</div>
        <div class="admin-stat-trend" :class="stat.trend > 0 ? 'up' : 'down'">
          <svg v-if="stat.trend > 0" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 15l6-6 6 6"/></svg>
          <svg v-else viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          {{ Math.abs(stat.trend) }}% vs. semana anterior
        </div>
      </div>
    </div>

    <h2 class="admin-section-title">Atividade recente</h2>
    <div class="admin-card" style="padding: 0; overflow: hidden;">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Lead</th>
            <th>Origem</th>
            <th>Interesse</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in leads" :key="lead.name">
            <td>{{ lead.name }}</td>
            <td>{{ lead.source }}</td>
            <td>{{ lead.interest }}</td>
            <td>{{ lead.date }}</td>
            <td><span class="admin-badge" :class="lead.badgeClass">{{ lead.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2 class="admin-section-title">Visão geral das seções mais vistas</h2>
    <SimpleGraph :data="sections" />
  </div>
</template>

<script>
import SimpleGraph from '../components/SimpleGraph.vue'

const ICON_EYE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>'
const ICON_USERS = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.3a3.2 3.2 0 0 1 0 6.2M22 20c0-3-1.9-5.2-4.5-5.8"/></svg>'
const ICON_FUNNEL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h18l-7 9v6l-4 2v-8L3 4z"/></svg>'
const ICON_COIN = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5c0-1.4 1.2-2 2.5-2s2.5.7 2.5 1.8-1 1.6-2.5 1.9-2.5.9-2.5 2 1.2 1.8 2.5 1.8 2.5-.6 2.5-2"/></svg>'

export default {
  name: 'AdminDashboard',
  components: { SimpleGraph },
  data() {
    return {
      stats: [
        { label: 'Visualizações (30d)', value: '8.412', trend: 12, icon: ICON_EYE },
        { label: 'Leads recebidos', value: '146', trend: 8, icon: ICON_USERS },
        { label: 'Taxa de conversão', value: '1,7%', trend: -3, icon: ICON_FUNNEL },
        { label: 'Custo por lead', value: 'R$ 24,90', trend: -6, icon: ICON_COIN }
      ],
      leads: [
        { name: 'Ana Paula Souza', source: 'Facebook Ads', interest: '2 quartos', date: 'Hoje, 09:41', status: 'Novo', badgeClass: 'admin-badge-pending' },
        { name: 'Marcos Vinícius', source: 'Instagram', interest: '3 quartos', date: 'Hoje, 08:15', status: 'Contatado', badgeClass: 'admin-badge-success' },
        { name: 'Fernanda Lima', source: 'Google Ads', interest: 'Cobertura', date: 'Ontem, 19:02', status: 'Contatado', badgeClass: 'admin-badge-success' },
        { name: 'Ricardo Alves', source: 'Facebook Ads', interest: '2 quartos', date: 'Ontem, 14:37', status: 'Novo', badgeClass: 'admin-badge-pending' },
        { name: 'Juliana Prado', source: 'Site direto', interest: 'Área de lazer', date: '2 dias atrás', status: 'Perdido', badgeClass: 'admin-badge-off' }
      ],
      sections: [
        { label: 'Plantas', value: 78 },
        { label: 'Área de Lazer', value: 64 },
        { label: 'Vista Panorâmica', value: 52 },
        { label: 'Localização', value: 41 },
        { label: 'Contato', value: 33 }
      ]
    }
  }
}
</script>

<style scoped>
.stat-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.stat-card-top .admin-card-title {
  margin-bottom: 0;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.admin-table th {
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

.admin-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #f0f1f3;
  color: #1a1d23;
}

.admin-table tr:last-child td {
  border-bottom: none;
}
</style>
