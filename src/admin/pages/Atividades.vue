<template>
  <div>
    <div class="admin-grid">
      <div class="admin-card stat-card" v-for="stat in summary" :key="stat.label">
        <div class="stat-card-top">
          <div class="admin-card-title">{{ stat.label }}</div>
          <span class="admin-stat-icon" v-html="stat.icon"></span>
        </div>
        <div class="admin-stat-value">{{ stat.value }}</div>
        <div class="admin-stat-trend up">últimos 7 dias</div>
      </div>
    </div>

    <div class="atividades-header">
      <h2 class="admin-section-title">Linha do tempo</h2>
      <div class="atividades-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="atividades-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div class="admin-card admin-card-flush">
      <div class="atividade-row" v-for="item in filteredEvents" :key="item.id">
        <span class="atividade-icon" :class="'type-' + item.type" v-html="icons[item.type]"></span>
        <div class="atividade-body">
          <p><strong>{{ item.name }}</strong> {{ item.description }}</p>
          <span class="atividade-meta">{{ item.source }} · {{ item.date }}</span>
        </div>
        <span class="admin-badge" :class="badgeClass[item.type]">{{ typeLabel[item.type] }}</span>
      </div>
    </div>

    <h2 class="admin-section-title">Plantas mais visualizadas</h2>
    <div class="admin-card">
      <SimpleGraph :data="plants" />
    </div>
  </div>
</template>

<script>
import SimpleGraph from '../components/SimpleGraph.vue'

const ICON_FORM = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/></svg>'
const ICON_WHATS = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 20l1.1-5.4A8.5 8.5 0 1 1 21 11.5z"/><path d="M8.5 10.5c.5 2.5 2.5 4.5 5 5"/></svg>'
const ICON_PLANT = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 14h10M13 3v11M13 14v7M17 14v7"/></svg>'

export default {
  name: 'AdminAtividades',
  components: { SimpleGraph },
  data() {
    return {
      activeTab: 'todos',
      tabs: [
        { id: 'todos', label: 'Todos' },
        { id: 'form', label: 'Formulário' },
        { id: 'whatsapp', label: 'WhatsApp' },
        { id: 'planta', label: 'Plantas' }
      ],
      icons: { form: ICON_FORM, whatsapp: ICON_WHATS, planta: ICON_PLANT },
      typeLabel: { form: 'Formulário', whatsapp: 'WhatsApp', planta: 'Planta vista' },
      badgeClass: { form: 'admin-badge-pending', whatsapp: 'admin-badge-success', planta: 'admin-badge-off' },
      summary: [
        { label: 'Formulários enviados', value: '38', icon: ICON_FORM },
        { label: 'Cliques no WhatsApp', value: '72', icon: ICON_WHATS },
        { label: 'Visualizações de plantas', value: '214', icon: ICON_PLANT }
      ],
      events: [
        { id: 1, type: 'form', name: 'Ana Paula Souza', description: 'preencheu o formulário de contato', source: 'Facebook Ads', date: 'Hoje, 09:41' },
        { id: 2, type: 'whatsapp', name: 'Visitante', description: 'clicou em "Falar no WhatsApp"', source: 'Instagram', date: 'Hoje, 09:12' },
        { id: 3, type: 'planta', name: 'Visitante', description: 'visualizou a planta Apartamento Garden 74,10m²', source: 'Site direto', date: 'Hoje, 08:57' },
        { id: 4, type: 'form', name: 'Marcos Vinícius', description: 'preencheu o formulário de contato', source: 'Instagram', date: 'Hoje, 08:15' },
        { id: 5, type: 'planta', name: 'Visitante', description: 'visualizou a planta Apartamento 51,76m²', source: 'Google Ads', date: 'Ontem, 20:03' },
        { id: 6, type: 'whatsapp', name: 'Fernanda Lima', description: 'clicou em "Falar no WhatsApp"', source: 'Google Ads', date: 'Ontem, 19:04' },
        { id: 7, type: 'form', name: 'Fernanda Lima', description: 'preencheu o formulário de contato', source: 'Google Ads', date: 'Ontem, 19:02' },
        { id: 8, type: 'planta', name: 'Visitante', description: 'visualizou a planta Apartamento Garden 64,78m²', source: 'Facebook Ads', date: 'Ontem, 15:20' },
        { id: 9, type: 'whatsapp', name: 'Ricardo Alves', description: 'clicou em "Falar no WhatsApp"', source: 'Facebook Ads', date: 'Ontem, 14:40' },
        { id: 10, type: 'form', name: 'Ricardo Alves', description: 'preencheu o formulário de contato', source: 'Facebook Ads', date: 'Ontem, 14:37' }
      ],
      plants: [
        { label: 'Garden 74,10m²', value: 68 },
        { label: '51,76m²', value: 54 },
        { label: 'Garden 64,78m²', value: 41 },
        { label: 'Garden 58,75m²', value: 32 },
        { label: '49,5m²', value: 19 }
      ]
    }
  },
  computed: {
    filteredEvents() {
      if (this.activeTab === 'todos') return this.events
      return this.events.filter((e) => e.type === this.activeTab)
    }
  }
}
</script>

<style scoped>
.atividades-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding-top: 32px;
  margin-bottom: 16px;
}

.atividades-header .admin-section-title {
  margin: 0;
}

.atividades-tabs {
  display: flex;
  gap: 6px;
  background: #eef0ee;
  padding: 4px;
  border-radius: 999px;
}

.atividades-tab {
  border: none;
  background: transparent;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 600;
  color: #71717a;
  cursor: pointer;
  font-family: inherit;
}

.atividades-tab.active {
  background: #fff;
  color: #18181b;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.08);
}

.admin-card-flush {
  padding: 0;
  overflow: hidden;
}

.atividade-row {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 1px solid #f2f2f3;
}

.atividade-row:last-child {
  border-bottom: none;
}

.atividade-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.atividade-icon.type-form {
  background: #fef3e2;
  color: #b45309;
}

.atividade-icon.type-whatsapp {
  background: #eafbe0;
  color: #16a34a;
}

.atividade-icon.type-planta {
  background: #f0f0f2;
  color: #52525b;
}

.atividade-body {
  flex: 1;
  min-width: 0;
}

.atividade-body p {
  font-size: 13.5px;
  color: #27272a;
  line-height: 1.5;
}

.atividade-body strong {
  font-weight: 600;
  color: #18181b;
}

.atividade-meta {
  font-size: 12px;
  color: #a1a1aa;
}

</style>
