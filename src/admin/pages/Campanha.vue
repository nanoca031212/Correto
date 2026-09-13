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
      <div
        class="admin-card tracking-card"
        v-for="track in tracking"
        :key="track.name"
        @click="openModal(track)"
      >
        <div class="tracking-top">
          <strong>{{ track.name }}</strong>
          <span class="admin-badge" :class="track.connected ? 'admin-badge-success' : 'admin-badge-off'">
            {{ track.connected ? 'Ativo' : 'Inativo' }}
          </span>
        </div>
        <p>{{ track.description }}</p>
        <span class="tracking-hint">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          {{ track.connected ? 'Editar código' : 'Inserir código' }}
        </span>
      </div>
    </div>

    <!-- Modal de código de tracking -->
    <teleport to="body">
      <transition name="fade">
        <div class="tk-overlay" v-if="modal.open" @click.self="closeModal">
          <div class="tk-modal">
            <div class="tk-modal-header">
              <div class="tk-modal-title-row">
                <span class="tk-modal-icon" v-html="modal.track?.icon"></span>
                <div>
                  <h3 class="tk-modal-title">{{ modal.track?.name }}</h3>
                  <p class="tk-modal-sub">Insira o ID de rastreamento abaixo</p>
                </div>
              </div>
              <button class="tk-close" @click="closeModal">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div class="tk-modal-body">
              <label class="tk-label">ID de rastreamento</label>
              <input
                type="text"
                class="tk-textarea"
                v-model="modal.code"
                placeholder="Ex: GTM-XXXXXXX ou 1234567890..."
                spellcheck="false"
                autofocus
              />
              <p class="tk-hint">O ID será usado automaticamente para configurar o tracking.</p>
            </div>

            <div class="tk-modal-footer">
              <button
                v-if="modal.track?.connected"
                class="tk-btn-remove"
                @click="removeCode"
              >Remover</button>
              <div class="tk-footer-right">
                <button class="tk-btn-cancel" @click="closeModal">Cancelar</button>
                <button class="tk-btn-save" @click="saveCode" :disabled="!modal.code.trim()">Salvar código</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
const ICON_META = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="28" height="28"><path fill="#0668e1" d="M966.5 289.4c-47.5-73.4-129.5-115.1-224.2-115.1-95.2 0-184.2 46.1-230.3 120.7C465.9 220.4 376.9 174.3 281.7 174.3c-94.8 0-176.8 41.7-224.2 115.1-55.9 86.8-51.5 204.3 12.1 294.6l.3.2c56.8 82.5 146.4 135 244 153a339.7 339.7 0 0 0 198.1-34.7 340.2 340.2 0 0 0 198.1 34.7c97.7-18 187.2-70.5 244-153l.3-.2c63.6-90.3 68-207.8 12.1-294.6zM512 590.2c28.2 40.5 73.6 63.8 123.6 63.8 84.1 0 152.3-68.2 152.3-152.3 0-84.1-68.2-152.3-152.3-152.3-50 0-95.4 23.3-123.6 63.8-28.2-40.5-73.6-63.8-123.6-63.8-84.1 0-152.3 68.2-152.3 152.3 0 84.1 68.2 152.3 152.3 152.3 50 0 95.4-23.3 123.6-63.8z"/></svg>'
const ICON_GOOGLE = '<svg viewBox="0 0 48 48" width="28" height="28"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.14 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>'
const ICON_TIKTOK = '<svg viewBox="0 0 448 512" width="24" height="24" fill="#000000"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>'
const ICON_PIXEL = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg>'
const ICON_GTM = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l7 4v6c0 5-3 8-7 10-4-2-7-5-7-10V6l7-4z"/></svg>'
const ICON_CAPI = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h4l2-7 4 14 2-7h4"/></svg>'

export default {
  name: 'AdminCampanha',
  data() {
    return {
      modal: { open: false, track: null, code: '' },
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
        { name: 'Meta Pixel', icon: ICON_PIXEL, description: 'Eventos de PageView, Lead e Contact configurados no site.', connected: true, code: '<!-- Meta Pixel Code -->' },
        { name: 'Google Tag Manager', icon: ICON_GTM, description: 'Ainda não configurado para esta campanha.', connected: false, code: '' },
        { name: 'Conversions API', icon: ICON_CAPI, description: 'Envio de eventos server-side para o Meta.', connected: false, code: '' }
      ]
    }
  },
  methods: {
    openModal(track) {
      this.modal = { open: true, track, code: track.code || '' }
    },
    closeModal() {
      this.modal = { open: false, track: null, code: '' }
    },
    saveCode() {
      if (!this.modal.code.trim()) return
      this.modal.track.code = this.modal.code.trim()
      this.modal.track.connected = true
      this.modal.track.description = 'Código configurado e ativo no site.'
      this.closeModal()
    },
    removeCode() {
      this.modal.track.code = ''
      this.modal.track.connected = false
      this.modal.track.description = 'Ainda não configurado para esta campanha.'
      this.closeModal()
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
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
  cursor: pointer;
  transition: box-shadow 0.18s, transform 0.18s;
}

.tracking-card:hover {
  box-shadow: 0 4px 18px rgba(0,0,0,0.08);
  transform: translateY(-1px);
}

.tracking-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tracking-icon {
  width: 24px;
  height: 24px;
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

.tracking-hint {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #6366f1;
  font-weight: 500;
  margin-top: 2px;
}

/* ── MODAL ── */
.tk-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(2px);
}

.tk-modal {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tk-modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 22px 16px;
  border-bottom: 1px solid #f0f0f2;
}

.tk-modal-title-row {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tk-modal-icon {
  width: 38px;
  height: 38px;
  color: #52525b;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tk-modal-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 3px;
}

.tk-modal-sub {
  font-size: 12.5px;
  color: #9ca3af;
  margin: 0;
}

.tk-close {
  background: #f4f4f6;
  border: none;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #71717a;
  flex-shrink: 0;
  transition: background 0.15s;
}

.tk-close:hover { background: #e8e8ec; }

.tk-modal-body {
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tk-label {
  font-size: 12.5px;
  font-weight: 600;
  color: #374151;
}

.tk-textarea {
  width: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 12.5px;
  font-family: 'Fira Code', 'Courier New', monospace;
  color: #1f2937;
  background: #f9fafb;
  resize: vertical;
  outline: none;
  line-height: 1.6;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.tk-textarea:focus {
  border-color: #6366f1;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
}

.tk-hint {
  font-size: 11.5px;
  color: #9ca3af;
  margin: 0;
}

.tk-hint code {
  background: #f3f4f6;
  border-radius: 4px;
  padding: 1px 5px;
  font-family: monospace;
  font-size: 11px;
  color: #6366f1;
}

.tk-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 22px 18px;
  border-top: 1px solid #f0f0f2;
  gap: 10px;
}

.tk-footer-right {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.tk-btn-cancel {
  background: #f4f4f6;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #52525b;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.tk-btn-cancel:hover { background: #e8e8ec; }

.tk-btn-save {
  background: #6366f1;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, opacity 0.15s;
}

.tk-btn-save:hover:not(:disabled) { background: #4f46e5; }
.tk-btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

.tk-btn-remove {
  background: transparent;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #dc2626;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
}

.tk-btn-remove:hover { background: #fef2f2; }

/* Transição do modal */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
