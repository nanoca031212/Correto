<template>
  <div class="ativ-root">

    <!-- ── STAT CARDS ── -->
    <div class="ativ-stats">
      <div class="ativ-stat-card" v-for="stat in summary" :key="stat.label">
        <span class="ativ-stat-label">{{ stat.label }}</span>
        <span class="ativ-stat-value">{{ stat.value }}</span>
        <span class="ativ-stat-sub">{{ stat.sub }}</span>
      </div>
    </div>

    <!-- ── MAIN CONTENT ── -->
    <div class="ativ-body">

      <!-- Coluna principal: tabela de leads -->
      <div class="ativ-main">
        <div class="ativ-main-header">
          <h2 class="ativ-title">Base de leads</h2>
          <div class="ativ-search-wrap">
            <svg class="ativ-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15">
              <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              class="ativ-search"
              v-model="search"
              placeholder="Buscar por nome, origem ou interesse…"
            />
          </div>
        </div>

        <div class="ativ-table-wrap">
          <table class="ativ-table">
            <thead>
              <tr>
                <th>LEAD</th>
                <th>ETIQUETAS</th>
                <th>ORIGEM</th>
                <th>DATA</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="lead in filteredLeads" :key="lead.id">
                <td class="ativ-td-lead">
                  <span class="ativ-lead-name">{{ lead.name }}</span>
                  <span class="ativ-lead-meta">{{ lead.interest }}</span>
                </td>
                <td>
                  <div class="ativ-tags">
                    <span
                      v-for="tag in lead.tags"
                      :key="tag"
                      class="ativ-tag"
                      :class="tagClass(tag)"
                    >{{ tag }}</span>
                  </div>
                </td>
                <td class="ativ-td-source">{{ lead.source }}</td>
                <td class="ativ-td-date">{{ lead.date }}</td>
                <td>
                  <span class="ativ-badge" :class="statusClass(lead.status)">{{ lead.status }}</span>
                </td>
              </tr>
              <tr v-if="filteredLeads.length === 0">
                <td colspan="5" class="ativ-empty">Nenhum lead encontrado.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Sidebar: filtros por segmento -->
      <aside class="ativ-sidebar">
        <span class="ativ-sidebar-title">SEGMENTO</span>
        <ul class="ativ-filter-list">
          <li
            v-for="seg in segments"
            :key="seg.id"
            class="ativ-filter-item"
            :class="{ active: activeSegment === seg.id }"
            @click="activeSegment = seg.id"
          >
            <span class="ativ-filter-label">{{ seg.label }}</span>
            <span class="ativ-filter-count">{{ seg.count }}</span>
          </li>
        </ul>
      </aside>
    </div>

    <!-- ── GRÁFICO ── -->
    <h2 class="ativ-section-title">Atividades nos últimos 7 dias</h2>
    <SimpleGraph :data="plantViews7d" unit="atividades" />

  </div>
</template>

<script>
import SimpleGraph from '../components/SimpleGraph.vue'

export default {
  name: 'AdminAtividades',
  components: { SimpleGraph },
  data() {
    return {
      search: '',
      activeSegment: 'todos',
      segments: [
        { id: 'todos',       label: 'Todos',               count: 10 },
        { id: 'Novo',        label: 'Novo lead',            count: 4  },
        { id: 'Contatado',   label: 'Contatado',            count: 3  },
        { id: 'Qualificado', label: 'Qualificado',          count: 2  },
        { id: 'Perdido',     label: 'Perdido',              count: 1  },
        { id: 'reuniao',     label: 'Reunião qualificada',  count: 2  },
        { id: 'form',        label: 'Formulário',           count: 4  },
        { id: 'whatsapp',    label: 'WhatsApp',             count: 3  },
        { id: 'planta',      label: 'Viu planta',           count: 3  },
      ],
      summary: [
        { label: 'Total de leads',        value: '10', sub: 'contatos únicos'              },
        { label: 'Contatados',            value: '3',  sub: 'aguardando retorno'           },
        { label: 'Qualificados',          value: '2',  sub: 'alto interesse'               },
        { label: 'Reunião qualificada',   value: '2',  sub: 'formulário + WhatsApp'        },
      ],
      leads: [
        { id: 1,  name: 'Ana Paula Souza',  interest: '2 quartos',     source: 'Facebook Ads', date: 'Hoje, 09:41',  status: 'Novo',        reuniao: true,  tags: ['Novo', 'Formulário', 'WhatsApp'],      type: 'form'     },
        { id: 2,  name: 'Marcos Vinícius',  interest: '3 quartos',     source: 'Instagram',    date: 'Hoje, 08:15',  status: 'Contatado',   reuniao: false, tags: ['Contatado'],                            type: 'whatsapp' },
        { id: 3,  name: 'Fernanda Lima',    interest: 'Cobertura',     source: 'Google Ads',   date: 'Ontem, 19:02', status: 'Contatado',   reuniao: true,  tags: ['Contatado', 'Qualificado', 'Formulário', 'WhatsApp'], type: 'form' },
        { id: 4,  name: 'Ricardo Alves',    interest: '2 quartos',     source: 'Facebook Ads', date: 'Ontem, 14:37', status: 'Novo',        reuniao: false, tags: ['Novo'],                                 type: 'form'     },
        { id: 5,  name: 'Juliana Prado',    interest: 'Área de lazer', source: 'Site direto',  date: '2 dias atrás', status: 'Perdido',     reuniao: false, tags: ['Perdido'],                              type: 'whatsapp' },
        { id: 6,  name: 'Carlos Henrique',  interest: '3 quartos',     source: 'Instagram',    date: '2 dias atrás', status: 'Qualificado', reuniao: false, tags: ['Qualificado'],                          type: 'planta'   },
        { id: 7,  name: 'Patrícia Mendes',  interest: 'Cobertura',     source: 'Google Ads',   date: '3 dias atrás', status: 'Contatado',   reuniao: false, tags: ['Contatado'],                            type: 'planta'   },
        { id: 8,  name: 'Bruno Ferreira',   interest: '2 quartos',     source: 'Facebook Ads', date: '3 dias atrás', status: 'Novo',        reuniao: false, tags: ['Novo', 'WhatsApp'],                    type: 'whatsapp' },
        { id: 9,  name: 'Larissa Costa',    interest: '1 quarto',      source: 'Site direto',  date: '4 dias atrás', status: 'Qualificado', reuniao: false, tags: ['Qualificado', 'Formulário'],           type: 'form'     },
        { id: 10, name: 'Diego Santos',     interest: '3 quartos',     source: 'Instagram',    date: '5 dias atrás', status: 'Novo',        reuniao: false, tags: ['Novo'],                                 type: 'planta'   },
      ],
      plantViews7d: [
        { label: 'Seg', value: 8  },
        { label: 'Ter', value: 12 },
        { label: 'Qua', value: 7  },
        { label: 'Qui', value: 15 },
        { label: 'Sex', value: 10 },
        { label: 'Sáb', value: 18 },
        { label: 'Dom', value: 14 },
      ],
    }
  },
  computed: {
    filteredLeads() {
      let list = this.leads
      if (this.activeSegment === 'reuniao') {
        list = list.filter(l => l.reuniao)
      } else if (this.activeSegment !== 'todos') {
        const seg = this.activeSegment
        list = list.filter(l => l.status === seg || l.type === seg || l.tags.includes(seg))
      }
      const q = this.search.trim().toLowerCase()
      if (q) {
        list = list.filter(l =>
          l.name.toLowerCase().includes(q) ||
          l.source.toLowerCase().includes(q) ||
          l.interest.toLowerCase().includes(q)
        )
      }
      return list
    }
  },
  methods: {
    tagClass(tag) {
      const map = {
        'Novo': 'tag-novo', 'Contatado': 'tag-contatado',
        'Qualificado': 'tag-qualificado', 'Perdido': 'tag-perdido',
        'Formulário': 'tag-form', 'WhatsApp': 'tag-whatsapp',
        'Reunião qualificada': 'tag-reuniao',
      }
      return map[tag] || ''
    },
    statusClass(status) {
      const map = {
        'Novo': 'badge-novo', 'Contatado': 'badge-contatado',
        'Qualificado': 'badge-qualificado', 'Perdido': 'badge-perdido',
      }
      return map[status] || ''
    }
  }
}
</script>

<style scoped>
/* ── ROOT ── */
.ativ-root {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── STAT CARDS ── */
.ativ-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.ativ-stat-card {
  background: #fff;
  border: 1px solid #e8e9eb;
  border-radius: 12px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ativ-stat-label {
  font-size: 11.5px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.ativ-stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  line-height: 1.1;
  margin-top: 2px;
}

.ativ-stat-sub {
  font-size: 12px;
  color: #9ca3af;
}

/* ── BODY: main + sidebar ── */
.ativ-body {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 14px;
  align-items: start;
}

/* ── MAIN TABLE PANEL ── */
.ativ-main {
  background: #fff;
  border: 1px solid #e8e9eb;
  border-radius: 12px;
  overflow: hidden;
}

.ativ-main-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px 14px;
  border-bottom: 1px solid #f0f1f3;
}

.ativ-title {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.ativ-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 7px 12px;
  min-width: 260px;
}

.ativ-search-icon { color: #9ca3af; flex-shrink: 0; }

.ativ-search {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #111827;
  width: 100%;
  font-family: inherit;
}

.ativ-search::placeholder { color: #9ca3af; }

/* ── TABLE ── */
.ativ-table-wrap { overflow-x: auto; }

.ativ-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

.ativ-table th {
  text-align: left;
  padding: 10px 20px;
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-bottom: 1px solid #f0f1f3;
  white-space: nowrap;
}

.ativ-table td {
  padding: 13px 20px;
  border-bottom: 1px solid #f5f6f7;
  vertical-align: middle;
}

.ativ-table tbody tr:last-child td { border-bottom: none; }
.ativ-table tbody tr:hover td { background: #fafafa; }

.ativ-td-lead {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ativ-lead-name { font-weight: 600; color: #111827; white-space: nowrap; }
.ativ-lead-meta { font-size: 12px; color: #9ca3af; }
.ativ-td-source { color: #6b7280; white-space: nowrap; }
.ativ-td-date   { color: #9ca3af; font-size: 12.5px; white-space: nowrap; }

/* ── TAGS ── */
.ativ-tags { display: flex; flex-wrap: wrap; gap: 5px; }

.ativ-tag {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.tag-novo        { background: #eff6ff; color: #2563eb; }
.tag-contatado   { background: #f0fdf4; color: #16a34a; }
.tag-qualificado { background: #fefce8; color: #ca8a04; }
.tag-perdido     { background: #fef2f2; color: #dc2626; }
.tag-form        { background: #f5f3ff; color: #7c3aed; }
.tag-whatsapp    { background: #ecfdf5; color: #059669; }
.tag-reuniao     { background: #fff7ed; color: #ea580c; }

/* ── STATUS BADGE ── */
.ativ-badge {
  display: inline-block;
  font-size: 11.5px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.badge-novo        { background: #eff6ff; color: #2563eb; }
.badge-contatado   { background: #f0fdf4; color: #16a34a; }
.badge-qualificado { background: #fefce8; color: #ca8a04; }
.badge-perdido     { background: #fef2f2; color: #dc2626; }

.ativ-empty {
  text-align: center;
  color: #9ca3af;
  padding: 32px !important;
  font-size: 13px;
}

/* ── SIDEBAR FILTROS ── */
.ativ-sidebar {
  background: #fff;
  border: 1px solid #e8e9eb;
  border-radius: 12px;
  padding: 18px 0 8px;
}

.ativ-sidebar-title {
  display: block;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.8px;
  color: #9ca3af;
  padding: 0 18px 10px;
  border-bottom: 1px solid #f0f1f3;
  text-transform: uppercase;
}

.ativ-filter-list { list-style: none; margin: 0; padding: 6px 0; }

.ativ-filter-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px;
  cursor: pointer;
  transition: background 0.15s;
  gap: 8px;
}

.ativ-filter-item:hover { background: #f9fafb; }

.ativ-filter-item.active { background: #fef2f2; }
.ativ-filter-item.active .ativ-filter-label { color: #dc2626; font-weight: 600; }

.ativ-filter-label { font-size: 13px; color: #374151; }

.ativ-filter-count {
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  background: #f3f4f6;
  border-radius: 999px;
  padding: 1px 7px;
  min-width: 22px;
  text-align: center;
}

.ativ-filter-item.active .ativ-filter-count { background: #fee2e2; color: #dc2626; }

/* ── SECTION TITLE ── */
.ativ-section-title {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .ativ-stats   { grid-template-columns: repeat(2, 1fr); }
  .ativ-body    { grid-template-columns: 1fr; }
  .ativ-sidebar { order: -1; }
}

@media (max-width: 520px) {
  .ativ-stats { grid-template-columns: 1fr 1fr; }
  .ativ-main-header { flex-direction: column; align-items: flex-start; }
  .ativ-search-wrap { width: 100%; min-width: unset; }
}
</style>
