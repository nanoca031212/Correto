<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <span class="admin-brand-avatar">JR</span>
        <div class="admin-brand-text">
          <strong>Jardins Residence</strong>
          <router-link to="/" class="admin-brand-link">Ver site</router-link>
        </div>
      </div>

      <nav class="admin-nav">
        <div class="admin-nav-group">
          <span class="admin-nav-group-label">Visão geral</span>
          <router-link to="/admin/dashboard" class="admin-nav-item">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="7" height="9" rx="1.3"/><rect x="14" y="3" width="7" height="5" rx="1.3"/><rect x="14" y="12" width="7" height="9" rx="1.3"/><rect x="3" y="16" width="7" height="5" rx="1.3"/></svg>
            <span>Dashboard</span>
          </router-link>

          <router-link to="/admin/atividades" class="admin-nav-item">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 19V10M11 19V5M18 19v-7"/></svg>
            <span>Atividades</span>
          </router-link>
        </div>

        <div class="admin-nav-group">
          <span class="admin-nav-group-label">Marketing</span>
          <router-link to="/admin/campanha" class="admin-nav-item">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11l18-7-7 18-2.5-7.5L3 11z"/></svg>
            <span>Campanha</span>
          </router-link>

          <router-link to="/admin/material" class="admin-nav-item">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="14" rx="1.8"/><path d="M3 15l4.5-4.5a2 2 0 0 1 2.8 0L15 15"/><circle cx="8.5" cy="8" r="1.3"/><path d="M3 21h18"/></svg>
            <span>Material</span>
          </router-link>

          <router-link to="/admin/mcp" class="admin-nav-item">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="4" y="4" width="7" height="7" rx="1.3"/><rect x="13" y="13" width="7" height="7" rx="1.3"/><path d="M7.5 11v3a2 2 0 0 0 2 2H13M16.5 13v-3a2 2 0 0 0-2-2H11"/></svg>
            <span>MCP</span>
          </router-link>
        </div>
      </nav>
    </aside>

    <div class="admin-main">
      <div class="admin-content">
        <div class="admin-page-header">
          <span class="admin-eyebrow">{{ pageMeta.eyebrow }}</span>
          <h1>{{ pageMeta.title }}</h1>
          <p>{{ pageMeta.subtitle }}</p>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const PAGE_META = {
  'admin-dashboard': {
    eyebrow: 'Visão geral',
    title: 'Dashboard',
    subtitle: 'Métricas gerais, leads recentes e desempenho por seção do site.'
  },
  'admin-atividades': {
    eyebrow: 'Visão geral',
    title: 'Atividades',
    subtitle: 'Formulários enviados, cliques no WhatsApp e plantas visualizadas.'
  },
  'admin-campanha': {
    eyebrow: 'Marketing',
    title: 'Campanha',
    subtitle: 'Conecte plataformas de anúncio e acompanhe o tracking.'
  },
  'admin-material': {
    eyebrow: 'Marketing',
    title: 'Material',
    subtitle: 'Criativos e mídias usadas nas campanhas.'
  },
  'admin-mcp': {
    eyebrow: 'Marketing',
    title: 'MCP',
    subtitle: 'Conecte a IA que você usa aos dados deste empreendimento.'
  }
}

export default {
  name: 'AdminLayout',
  setup() {
    const route = useRoute()
    const pageMeta = computed(
      () => PAGE_META[route.name] || { eyebrow: 'Painel', title: 'Corretor', subtitle: '' }
    )
    return { pageMeta }
  }
}
</script>

<style>
/* Escopo proposital sem "scoped": estilos base do admin usados pelas
   paginas filhas (cards, botoes, badges) ficam centralizados aqui. */
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #f5f6f5;
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #18181b;
}

.admin-sidebar {
  width: 250px;
  flex-shrink: 0;
  background: #fff;
  border-right: 1px solid #ececec;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  height: 100vh;
}

.admin-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 22px;
}

.admin-brand-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #eafbe0;
  color: #2d7a10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.admin-brand-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  line-height: 1.2;
}

.admin-brand-text strong {
  font-size: 14.5px;
  font-weight: 600;
  color: #18181b;
}

.admin-brand-link {
  font-size: 12.5px;
  color: #2d9c14;
  text-decoration: none;
  font-weight: 600;
}

.admin-brand-link:hover {
  text-decoration: underline;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 10px 16px;
  flex: 1;
}

.admin-nav-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.admin-nav-group-label {
  font-size: 11px;
  font-weight: 700;
  color: #b0b0b6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0 10px;
  margin-bottom: 6px;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 9px 12px;
  border-radius: 999px;
  color: #52525b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
}

.admin-nav-item svg {
  flex-shrink: 0;
}

.admin-nav-item:hover {
  background: #f3f4f2;
}

.admin-nav-item.router-link-active {
  background: #eafbe0;
  color: #2d7a10;
  font-weight: 600;
}

.admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.admin-content {
  flex: 1;
  padding: 56px 40px 36px;
  max-width: 1180px;
  width: 100%;
}

.admin-page-header {
  margin-bottom: 28px;
}

.admin-eyebrow {
  display: block;
  font-size: 11.5px;
  font-weight: 700;
  color: #2d9c14;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  margin-bottom: 6px;
}

.admin-page-header h1 {
  font-size: 26px;
  font-weight: 700;
  color: #18181b;
  letter-spacing: -0.3px;
  margin-bottom: 6px;
}

.admin-page-header p {
  font-size: 14px;
  color: #71717a;
}

/* ---- Componentes reutilizados pelas paginas ---- */
.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.admin-card {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.03);
}

.admin-card-title {
  font-size: 12px;
  font-weight: 600;
  color: #8a8a92;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 10px;
}

.admin-stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #eafbe0;
  color: #2d7a10;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.admin-stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #18181b;
  margin-bottom: 6px;
  letter-spacing: -0.3px;
}

.admin-stat-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  font-weight: 500;
  color: #8a8a92;
}

.admin-stat-trend svg {
  flex-shrink: 0;
}

.admin-stat-trend.up svg {
  color: #16a34a;
}

.admin-stat-trend.down svg {
  color: #dc2626;
}

.admin-section-title {
  font-size: 16px;
  font-weight: 700;
  color: #18181b;
  margin: 32px 0 16px;
}

.admin-section-title:first-child {
  margin-top: 0;
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: opacity 0.15s ease, background 0.15s ease, border-color 0.15s ease;
  font-family: inherit;
}

.admin-btn-primary {
  background: #18181b;
  color: #fff;
}

.admin-btn-primary:hover {
  opacity: 0.85;
}

.admin-btn-outline {
  background: #fff;
  color: #18181b;
  border-color: #dcdce0;
}

.admin-btn-outline:hover {
  background: #f5f5f6;
}

.admin-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 500;
  color: #71717a;
}

.admin-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d4d4d8;
  flex-shrink: 0;
}

.admin-badge-success {
  color: #18181b;
}

.admin-badge-success::before {
  background: #16a34a;
}

.admin-badge-pending {
  color: #18181b;
}

.admin-badge-pending::before {
  background: #d97706;
}

.admin-badge-off {
  color: #a1a1aa;
}

@media (max-width: 900px) {
  .admin-shell {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .admin-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 14px;
  }

  .admin-content {
    padding: 22px;
  }
}
</style>
