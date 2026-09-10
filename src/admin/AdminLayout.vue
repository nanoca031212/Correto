<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <div class="admin-brand">
        <span class="admin-brand-mark">JR</span>
        <div class="admin-brand-text">
          <strong>Jardins Residence</strong>
          <span>Painel do Corretor</span>
        </div>
      </div>

      <nav class="admin-nav">
        <router-link to="/admin/dashboard" class="admin-nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>
          <span>Dashboard</span>
        </router-link>

        <router-link to="/admin/campanha" class="admin-nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l18-7-7 18-2.5-7.5L3 11z"/></svg>
          <span>Campanha</span>
        </router-link>

        <router-link to="/admin/material" class="admin-nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="14" rx="2"/><path d="M3 15l4.5-4.5a2 2 0 0 1 2.8 0L15 15"/><circle cx="8.5" cy="8" r="1.5"/><path d="M3 21h18"/></svg>
          <span>Material</span>
        </router-link>

        <router-link to="/admin/mcp" class="admin-nav-item">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/><path d="M7.5 11v3a2 2 0 0 0 2 2H13M16.5 13v-3a2 2 0 0 0-2-2H11"/></svg>
          <span>MCP</span>
          <span class="admin-nav-badge">IA</span>
        </router-link>
      </nav>

      <div class="admin-sidebar-footer">
        <router-link to="/" class="admin-back-link">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Ver site
        </router-link>
      </div>
    </aside>

    <div class="admin-main">
      <header class="admin-topbar">
        <h1>{{ pageTitle }}</h1>
        <div class="admin-topbar-user">
          <span class="admin-user-dot"></span>
          Corretor
        </div>
      </header>

      <div class="admin-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const TITLES = {
  'admin-dashboard': 'Dashboard',
  'admin-campanha': 'Campanha',
  'admin-material': 'Material',
  'admin-mcp': 'MCP - Conectar IA'
}

export default {
  name: 'AdminLayout',
  setup() {
    const route = useRoute()
    const pageTitle = computed(() => TITLES[route.name] || 'Painel do Corretor')
    return { pageTitle }
  }
}
</script>

<style>
/* Escopo proposital sem "scoped": estilos base do admin usados pelas
   paginas filhas (cards, botoes, badges) ficam centralizados aqui. */
.admin-shell {
  display: flex;
  min-height: 100vh;
  background: #f4f5f7;
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #1a1d23;
}

.admin-sidebar {
  width: 250px;
  flex-shrink: 0;
  background: #14171f;
  color: #e5e7eb;
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
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-brand-mark {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #44b319, #2d7a10);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 13px;
  color: #fff;
  flex-shrink: 0;
}

.admin-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.admin-brand-text strong {
  font-size: 14px;
  color: #fff;
}

.admin-brand-text span {
  font-size: 12px;
  color: #9ca3af;
}

.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 12px;
  flex: 1;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 12px;
  border-radius: 8px;
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
}

.admin-nav-item svg {
  flex-shrink: 0;
}

.admin-nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.admin-nav-item.router-link-active {
  background: rgba(68, 179, 25, 0.15);
  color: #6fd93f;
}

.admin-nav-badge {
  margin-left: auto;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(111, 217, 63, 0.18);
  color: #6fd93f;
}

.admin-sidebar-footer {
  padding: 16px 20px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
  text-decoration: none;
  font-size: 13px;
}

.admin-back-link:hover {
  color: #fff;
}

.admin-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.admin-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.admin-topbar h1 {
  font-size: 20px;
  font-weight: 600;
  color: #14171f;
}

.admin-topbar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.admin-user-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #44b319;
}

.admin-content {
  flex: 1;
  padding: 32px;
  max-width: 1200px;
  width: 100%;
}

/* ---- Componentes reutilizados pelas paginas ---- */
.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.admin-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 22px;
}

.admin-card-title {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 10px;
}

.admin-stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #14171f;
  margin-bottom: 6px;
}

.admin-stat-trend {
  font-size: 13px;
  font-weight: 600;
}

.admin-stat-trend.up {
  color: #16a34a;
}

.admin-stat-trend.down {
  color: #dc2626;
}

.admin-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #14171f;
  margin: 32px 0 16px;
}

.admin-section-title:first-child {
  margin-top: 0;
}

.admin-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid transparent;
  transition: opacity 0.15s ease, background 0.15s ease;
  font-family: inherit;
}

.admin-btn-primary {
  background: #14171f;
  color: #fff;
}

.admin-btn-primary:hover {
  opacity: 0.85;
}

.admin-btn-outline {
  background: #fff;
  color: #14171f;
  border-color: #d1d5db;
}

.admin-btn-outline:hover {
  background: #f4f5f7;
}

.admin-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.admin-badge-success {
  background: #dcfce7;
  color: #16a34a;
}

.admin-badge-pending {
  background: #fef3c7;
  color: #b45309;
}

.admin-badge-off {
  background: #f3f4f6;
  color: #6b7280;
}

@media (max-width: 900px) {
  .admin-shell {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    height: auto;
    position: relative;
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }

  .admin-brand {
    border-bottom: none;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
  }

  .admin-nav {
    flex-direction: row;
    padding: 12px;
  }

  .admin-sidebar-footer {
    display: none;
  }

  .admin-content {
    padding: 20px;
  }
}
</style>
