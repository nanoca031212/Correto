<template>
  <div>
    <div class="material-toolbar">
      <div class="material-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="material-tab"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- LISTA DE IMAGENS -->
    <div class="material-list" v-if="activeTab === 'imagens'">
      <div class="material-row" v-for="item in images" :key="item.src">
        <div class="material-row-left">
          <div class="material-thumb-sm" @click="openModal(item, 'image')">
            <img :src="item.src" :alt="item.label" loading="lazy" />
            <div class="material-overlay-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
            </div>
          </div>
          <div class="material-info-col">
            <strong>{{ item.label }}</strong>
            <div class="material-tags">
              <span class="mtag mtag-camp">{{ item.campaign }}</span>
              <span class="mtag mtag-ordem">Ordem {{ item.order }}</span>
            </div>
          </div>
        </div>

        <div class="material-metrics">
          <div class="metric-item">
            <span>Conversões</span>
            <strong>{{ item.conversoes }}</strong>
          </div>
          <div class="metric-item">
            <span>Custo / Lead</span>
            <strong>{{ item.cpl }}</strong>
          </div>
        </div>

        <div class="material-row-right">
          <span class="admin-badge" :class="item.status === 'Ativo' ? 'admin-badge-success' : 'admin-badge-off'">
            {{ item.status }}
          </span>
          <button class="admin-btn admin-btn-outline material-copy" @click="copy(item.src)">Copiar link</button>
        </div>
      </div>
    </div>

    <!-- LISTA DE VÍDEOS -->
    <div class="material-list" v-else>
      <div class="material-row" v-for="item in videos" :key="item.src">
        <div class="material-row-left">
          <div class="material-thumb-sm" @click="openModal(item, 'video')">
            <video :src="item.src" muted playsinline preload="metadata"></video>
            <div class="material-overlay-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            </div>
          </div>
          <div class="material-info-col">
            <strong>{{ item.label }}</strong>
            <div class="material-tags">
              <span class="mtag mtag-camp">{{ item.campaign }}</span>
              <span class="mtag mtag-ordem">Ordem {{ item.order }}</span>
            </div>
          </div>
        </div>

        <div class="material-metrics">
          <div class="metric-item">
            <span>Conversões</span>
            <strong>{{ item.conversoes }}</strong>
          </div>
          <div class="metric-item">
            <span>Custo / Lead</span>
            <strong>{{ item.cpl }}</strong>
          </div>
        </div>

        <div class="material-row-right">
          <span class="admin-badge" :class="item.status === 'Ativo' ? 'admin-badge-success' : 'admin-badge-off'">
            {{ item.status }}
          </span>
          <button class="admin-btn admin-btn-outline material-copy" @click="copy(item.src)">Copiar link</button>
        </div>
      </div>
    </div>

    <!-- MODAL DE VISUALIZAÇÃO -->
    <teleport to="body">
      <transition name="fade">
        <div class="mat-overlay" v-if="modal.open" @click.self="closeModal">
          <button class="mat-close" @click="closeModal">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          
          <div class="mat-modal-content">
            <img v-if="modal.type === 'image'" :src="modal.item?.src" :alt="modal.item?.label" />
            <video v-if="modal.type === 'video'" :src="modal.item?.src" controls autoplay playsinline></video>
            
            <div class="mat-modal-info">
              <h3>{{ modal.item?.label }}</h3>
              <p>Campanha: <strong>{{ modal.item?.campaign }}</strong></p>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'AdminMaterial',
  data() {
    return {
      activeTab: 'imagens',
      modal: { open: false, item: null, type: 'image' },
      tabs: [
        { id: 'imagens', label: 'Imagens' },
        { id: 'videos', label: 'Vídeos' }
      ],
      images: [
        { src: '/Imagens/4-Entrada-da-Torre_2024_12_10-1-1024x768.jpg', label: 'Entrada da Torre', campaign: 'Lançamento', conversoes: 42, cpl: 'R$ 14,50', status: 'Ativo', order: 1 },
        { src: '/Imagens/1-Guarita-Predio-Diurna_2025_01_14-1-1024x768.jpg', label: 'Guarita - Diurna', campaign: 'Lançamento', conversoes: 18, cpl: 'R$ 22,00', status: 'Ativo', order: 2 },
        { src: '/Imagens/2-Guarita-Predio-Noturno_2025_01_14-1-1024x1024.jpg', label: 'Guarita - Noturna', campaign: 'Remarketing', conversoes: 35, cpl: 'R$ 9,80', status: 'Ativo', order: 0 },
        { src: '/Imagens/3-Salao-de-Festas-Externo_2025_01_24-1024x576.jpg', label: 'Salão de Festas Externo', campaign: 'Lançamento', conversoes: 5, cpl: 'R$ 45,00', status: 'Pausado', order: 3 },
        { src: '/Imagens/5-Salao-de-Festas-Interno_2024_12_10-1-1024x576.jpg', label: 'Salão de Festas Interno', campaign: 'Remarketing', conversoes: 12, cpl: 'R$ 12,50', status: 'Ativo', order: 1 },
        { src: '/Imagens/10-Fruicao-Praca-Jabuticabeira_2024_12_10-1-1024x768.jpg', label: 'Praça Jabuticabeira', campaign: 'Teste - Público frio', conversoes: 2, cpl: 'R$ 55,00', status: 'Pausado', order: 0 },
        { src: '/Imagens/11-Redario_2024_12_10-1-1024x576.jpg', label: 'Redário', campaign: 'Lançamento', conversoes: 21, cpl: 'R$ 18,90', status: 'Ativo', order: 4 }
      ],
      videos: [
        { src: '/animacao/animacao1.mp4', label: 'Implantação - Vista 1', campaign: 'Lançamento', conversoes: 85, cpl: 'R$ 8,50', status: 'Ativo', order: 1 },
        { src: '/animacao/animacao2.mp4', label: 'Implantação - Vista 2', campaign: 'Remarketing', conversoes: 44, cpl: 'R$ 6,20', status: 'Ativo', order: 2 }
      ]
    }
  },
  methods: {
    copy(text) {
      const url = window.location.origin + text
      navigator.clipboard?.writeText(url).catch(() => {})
    },
    openModal(item, type) {
      this.modal = { open: true, item, type }
    },
    closeModal() {
      this.modal.open = false
      setTimeout(() => { this.modal.item = null }, 200)
    }
  }
}
</script>

<style scoped>
.material-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 16px;
  flex-wrap: wrap;
}

.material-tabs {
  display: flex;
  gap: 6px;
  background: #eef0f3;
  padding: 4px;
  border-radius: 10px;
}

.material-tab {
  border: none;
  background: transparent;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  font-family: inherit;
}

.material-tab.active {
  background: #fff;
  color: #14171f;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.material-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.material-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #f0f1f3;
  border-radius: 12px;
  padding: 12px 18px 12px 12px;
  gap: 20px;
  transition: box-shadow 0.15s, transform 0.15s;
}

.material-row:hover {
  box-shadow: 0 4px 18px rgba(0,0,0,0.04);
  transform: translateY(-1px);
}

.material-row-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.material-thumb-sm {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  overflow: hidden;
  background: #f4f4f6;
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.material-thumb-sm img,
.material-thumb-sm video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.material-overlay-icon {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s;
}

.material-thumb-sm:hover .material-overlay-icon {
  opacity: 1;
}

.material-info-col {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.material-info-col strong {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.material-tags {
  display: flex;
  gap: 6px;
  align-items: center;
}

.mtag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 99px;
  white-space: nowrap;
}

.mtag-camp {
  background: #fffbeb;
  color: #b45309;
}

.mtag-ordem {
  background: #f3f4f6;
  color: #4b5563;
}

.material-metrics {
  display: flex;
  gap: 32px;
  margin-right: auto;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metric-item span {
  font-size: 11px;
  text-transform: uppercase;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.metric-item strong {
  font-size: 14.5px;
  color: #111827;
}

.material-row-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.material-copy {
  padding: 6px 12px;
  font-size: 12px;
}

/* ── MODAL ── */
.mat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.mat-close {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: background 0.15s;
}

.mat-close:hover { background: rgba(255,255,255,0.2); }

.mat-modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  max-height: 85vh;
}

.mat-modal-content img,
.mat-modal-content video {
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5);
}

.mat-modal-info {
  margin-top: 16px;
  text-align: center;
  color: #fff;
}

.mat-modal-info h3 {
  font-size: 18px;
  margin: 0 0 4px;
}

.mat-modal-info p {
  font-size: 13.5px;
  color: #a1a1aa;
  margin: 0;
}

.mat-modal-info strong {
  color: #fff;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
