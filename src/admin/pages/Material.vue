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
      <button class="admin-btn admin-btn-outline">+ Adicionar material</button>
    </div>

    <div class="material-grid" v-if="activeTab === 'imagens'">
      <div class="material-item" v-for="item in images" :key="item.src">
        <div class="material-thumb">
          <img :src="item.src" :alt="item.label" loading="lazy" />
        </div>
        <div class="material-item-info">
          <span>{{ item.label }}</span>
          <button class="admin-btn admin-btn-outline material-copy" @click="copy(item.src)">Copiar link</button>
        </div>
      </div>
    </div>

    <div class="material-grid" v-else>
      <div class="material-item" v-for="item in videos" :key="item.src">
        <div class="material-thumb material-thumb-video">
          <video :src="item.src" muted playsinline preload="metadata"></video>
        </div>
        <div class="material-item-info">
          <span>{{ item.label }}</span>
          <button class="admin-btn admin-btn-outline material-copy" @click="copy(item.src)">Copiar link</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminMaterial',
  data() {
    return {
      activeTab: 'imagens',
      tabs: [
        { id: 'imagens', label: 'Imagens' },
        { id: 'videos', label: 'Vídeos' }
      ],
      images: [
        { src: '/Imagens/4-Entrada-da-Torre_2024_12_10-1-1024x768.jpg', label: 'Entrada da Torre' },
        { src: '/Imagens/1-Guarita-Predio-Diurna_2025_01_14-1-1024x768.jpg', label: 'Guarita - Diurna' },
        { src: '/Imagens/2-Guarita-Predio-Noturno_2025_01_14-1-1024x1024.jpg', label: 'Guarita - Noturna' },
        { src: '/Imagens/3-Salao-de-Festas-Externo_2025_01_24-1024x576.jpg', label: 'Salão de Festas Externo' },
        { src: '/Imagens/5-Salao-de-Festas-Interno_2024_12_10-1-1024x576.jpg', label: 'Salão de Festas Interno' },
        { src: '/Imagens/10-Fruicao-Praca-Jabuticabeira_2024_12_10-1-1024x768.jpg', label: 'Praça Jabuticabeira' },
        { src: '/Imagens/11-Redario_2024_12_10-1-1024x576.jpg', label: 'Redário' },
        { src: '/bgcard/sala.jpg', label: 'Sala de Estar' },
        { src: '/bgcard/cozinha.jpg', label: 'Cozinha' },
        { src: '/bgcard/quarto.jpg', label: 'Quarto' },
        { src: '/bgcard/banheiro.jpg', label: 'Banheiro' }
      ],
      videos: [
        { src: '/animacao/animacao1.mp4', label: 'Implantação - Vista 1' },
        { src: '/animacao/animacao2.mp4', label: 'Implantação - Vista 2' }
      ]
    }
  },
  methods: {
    copy(text) {
      const url = window.location.origin + text
      navigator.clipboard?.writeText(url).catch(() => {})
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

.material-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
}

.material-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.material-thumb {
  height: 150px;
  background: #f0f1f3;
}

.material-thumb img,
.material-thumb video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.material-item-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px;
}

.material-item-info span {
  font-size: 13px;
  font-weight: 500;
  color: #1a1d23;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.material-copy {
  padding: 6px 10px;
  font-size: 12px;
  flex-shrink: 0;
}
</style>
