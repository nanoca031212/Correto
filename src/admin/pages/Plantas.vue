<template>
  <div>
    <h2 class="admin-section-title" style="margin-top:0">Desempenho de Plantas</h2>
    <div class="plantas-list">
      <div class="plantas-row" v-for="planta in plantas" :key="planta.nome">
        
        <div class="plantas-row-left">
          <div class="plantas-thumb">
            <img :src="planta.src" :alt="planta.nome" loading="lazy" />
          </div>
          <div class="plantas-info-col">
            <strong>{{ planta.nome }}</strong>
            <div class="plantas-tags">
              <span class="ptag ptag-tipo">{{ planta.tipo }}</span>
              <span class="ptag ptag-area">{{ planta.area }}</span>
            </div>
          </div>
        </div>

        <div class="plantas-metrics">
          <div class="metric-item">
            <span>Acessos</span>
            <strong>{{ planta.fotosVistas }}</strong>
          </div>
          <div class="metric-item">
            <span>Fotos Visualizadas</span>
            <strong>{{ planta.interacoes3d }}</strong>
          </div>
          <div class="metric-item">
            <span>Leads</span>
            <strong>{{ planta.leads }}</strong>
          </div>
        </div>

        <div class="plantas-row-right">
          <span class="conversion-badge" :class="planta.badgeClass">
            {{ planta.taxa }} cv
          </span>
        </div>
        
      </div>
    </div>

    <!-- Nova Sub-sessão de Visualizações 3D -->
    <h3 class="admin-section-subtitle" style="margin-top:40px; margin-bottom: 15px; font-size: 16px; font-weight: 600; color: #374151;">Métricas Detalhadas de Modelos 3D</h3>
    <div class="plantas-list">
      <div class="plantas-row" v-for="modelo in modelos3d" :key="modelo.nome">
        <div class="plantas-row-left">
          <div class="plantas-thumb" style="border-radius: 50%; border: 2px solid #e5e7eb;">
            <img :src="modelo.src" :alt="modelo.nome" loading="lazy" style="border-radius: 50%;" />
          </div>
          <div class="plantas-info-col">
            <strong>{{ modelo.nome }}</strong>
            <div class="plantas-tags">
              <span class="ptag" style="background:#fdf4ff; color:#c026d3;">Tour 3D</span>
            </div>
          </div>
        </div>

        <div class="plantas-metrics">
          <div class="metric-item">
            <span>Visualizações</span>
            <strong>{{ modelo.visualizacoes }}</strong>
          </div>
          <div class="metric-item">
            <span>Tempo Médio</span>
            <strong>{{ modelo.tempoMedio }}</strong>
          </div>
          <div class="metric-item">
            <span>Engajamento</span>
            <strong>{{ modelo.engajamento }}</strong>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'AdminPlantas',
  data() {
    return {
      plantas: [
        { 
          nome: '3 Suítes - 120m²', 
          tipo: 'Apartamento',
          area: '120m²',
          src: '/bgcard/sala.jpg',
          fotosVistas: '4.250',
          interacoes3d: '1.830',
          leads: 85, 
          taxa: '3.4%', 
          badgeClass: 'badge-high' 
        },
        { 
          nome: '2 Quartos (1 Suíte) - 85m²', 
          tipo: 'Apartamento',
          area: '85m²',
          src: '/bgcard/quarto.jpg',
          fotosVistas: '3.180',
          interacoes3d: '1.240',
          leads: 60, 
          taxa: '3.0%', 
          badgeClass: 'badge-med' 
        },
        { 
          nome: 'Cobertura Duplex - 240m²', 
          tipo: 'Cobertura',
          area: '240m²',
          src: '/Imagens/3-Salao-de-Festas-Externo_2025_01_24-1024x576.jpg',
          fotosVistas: '1.920',
          interacoes3d: '650',
          leads: 15, 
          taxa: '1.7%', 
          badgeClass: 'badge-low' 
        },
        { 
          nome: 'Studio - 45m²', 
          tipo: 'Studio',
          area: '45m²',
          src: '/bgcard/cozinha.jpg',
          fotosVistas: '5.120',
          interacoes3d: '2.100',
          leads: 40, 
          taxa: '1.2%', 
          badgeClass: 'badge-low' 
        }
      ],
      modelos3d: [
        {
          nome: 'Tour Virtual - 3 Suítes (120m²)',
          src: '/bgcard/sala.jpg',
          visualizacoes: '1.830',
          tempoMedio: '02:45',
          engajamento: 'Alto'
        },
        {
          nome: 'Tour Virtual - 2 Quartos (85m²)',
          src: '/bgcard/quarto.jpg',
          visualizacoes: '1.240',
          tempoMedio: '01:30',
          engajamento: 'Médio'
        },
        {
          nome: 'Tour Virtual - Studio (45m²)',
          src: '/bgcard/cozinha.jpg',
          visualizacoes: '2.100',
          tempoMedio: '03:10',
          engajamento: 'Muito Alto'
        }
      ]
    }
  }
}
</script>

<style scoped>
.plantas-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.plantas-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #f0f1f3;
  border-radius: 12px;
  padding: 12px 20px 12px 12px;
  gap: 20px;
  transition: box-shadow 0.15s, transform 0.15s;
}

.plantas-row:hover {
  box-shadow: 0 4px 18px rgba(0,0,0,0.04);
  transform: translateY(-1px);
}

.plantas-row-left {
  display: flex;
  align-items: center;
  gap: 18px;
  flex: 1;
}

.plantas-thumb {
  width: 72px;
  height: 72px;
  border-radius: 10px;
  overflow: hidden;
  background: #f4f4f6;
  flex-shrink: 0;
}

.plantas-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plantas-info-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.plantas-info-col strong {
  font-size: 14.5px;
  font-weight: 600;
  color: #111827;
}

.plantas-tags {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ptag {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 99px;
  white-space: nowrap;
}

.ptag-tipo {
  background: #f3f4f6;
  color: #4b5563;
}

.ptag-area {
  background: #eff6ff;
  color: #2563eb;
}

.plantas-metrics {
  display: flex;
  gap: 40px;
  margin-right: auto;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.metric-item span {
  font-size: 11px;
  text-transform: uppercase;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.metric-item strong {
  font-size: 15px;
  color: #111827;
}

.plantas-row-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 80px;
}

.conversion-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
}

.badge-high {
  background: #ecfdf5;
  color: #059669;
}

.badge-med {
  background: #fefce8;
  color: #ca8a04;
}

.badge-low {
  background: #fef2f2;
  color: #dc2626;
}
</style>
