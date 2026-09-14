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
              <tr
                v-for="lead in filteredLeads"
                :key="lead.id"
                class="ativ-row-clickable"
                :class="{ 'ativ-row-selected': selectedLead && selectedLead.id === lead.id }"
                @click="openLead(lead)"
              >
                <td class="ativ-td-lead">
                  <span class="ativ-lead-name">{{ lead.name }}</span>
                  <span class="ativ-lead-meta">{{ lead.interest }}</span>
                  <div class="ativ-lead-contacts">
                    <span class="ativ-lead-contact">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="11" height="11"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      {{ lead.email }}
                    </span>
                    <span class="ativ-lead-contact ativ-lead-contact--phone">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="11" height="11"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.59 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6.29 6.29l1.62-1.62a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      {{ lead.phone }}
                    </span>
                  </div>
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

    <!-- ── OVERLAY BACKDROP ── -->
    <transition name="fade">
      <div v-if="selectedLead" class="lead-backdrop" @click="closeLead" />
    </transition>

    <!-- ── LEAD DETAIL PANEL ── -->
    <transition name="slide">
      <div v-if="selectedLead" class="lead-panel">

        <!-- Header -->
        <div class="lead-panel-header">
          <div class="lead-panel-avatar">{{ initials(selectedLead.name) }}</div>
          <div class="lead-panel-header-info">
            <h3 class="lead-panel-name">{{ selectedLead.name }}</h3>
            <div class="lead-panel-tags">
              <span v-for="tag in selectedLead.tags" :key="tag" class="ativ-tag" :class="tagClass(tag)">{{ tag }}</span>
            </div>
          </div>
          <button class="lead-panel-close" @click="closeLead" title="Fechar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Status rápido -->
        <div class="lead-panel-status-row">
          <span class="ativ-badge lead-panel-badge" :class="statusClass(selectedLead.status)">{{ selectedLead.status }}</span>
          <span class="lead-panel-date">{{ selectedLead.date }}</span>
        </div>

        <!-- Dados do Formulário -->
        <div class="lead-panel-section">
          <span class="lead-panel-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><path d="M9 12h6M9 16h6M9 8h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/></svg>
            Dados do Formulário
          </span>
          <div class="lead-panel-fields">
            <div class="lead-field">
              <span class="lead-field-label">Nome completo</span>
              <span class="lead-field-value">{{ selectedLead.name }}</span>
            </div>
            <div class="lead-field">
              <span class="lead-field-label">E-mail</span>
              <a :href="'mailto:' + selectedLead.email" class="lead-field-value lead-field-link">{{ selectedLead.email }}</a>
            </div>
            <div class="lead-field">
              <span class="lead-field-label">Telefone / WhatsApp</span>
              <a :href="'https://wa.me/55' + selectedLead.phone.replace(/\D/g,'')" target="_blank" class="lead-field-value lead-field-link lead-field-whatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.105 1.523 5.827L.057 23.884l6.204-1.626A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.37l-.359-.213-3.722.976.993-3.63-.234-.373A9.818 9.818 0 0 1 2.18 12c0-5.42 4.4-9.818 9.818-9.818 5.42 0 9.818 4.399 9.818 9.818 0 5.42-4.398 9.818-9.817 9.818z"/></svg>
                {{ selectedLead.phone }}
              </a>
            </div>
            <div class="lead-field">
              <span class="lead-field-label">Interesse</span>
              <span class="lead-field-value">{{ selectedLead.interest }}</span>
            </div>
            <div class="lead-field" v-if="selectedLead.message">
              <span class="lead-field-label">Mensagem</span>
              <span class="lead-field-value lead-field-message">{{ selectedLead.message }}</span>
            </div>
          </div>
        </div>

        <!-- Origem e Rastreamento -->
        <div class="lead-panel-section">
          <span class="lead-panel-section-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="14" height="14"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Origem e Rastreamento
          </span>
          <div class="lead-panel-fields">
            <div class="lead-field">
              <span class="lead-field-label">Canal de origem</span>
              <span class="lead-field-value">{{ selectedLead.source }}</span>
            </div>
            <div class="lead-field" v-if="selectedLead.utm_campaign">
              <span class="lead-field-label">Campanha (UTM)</span>
              <span class="lead-field-value lead-field-code">{{ selectedLead.utm_campaign }}</span>
            </div>
            <div class="lead-field" v-if="selectedLead.utm_medium">
              <span class="lead-field-label">Mídia (UTM)</span>
              <span class="lead-field-value lead-field-code">{{ selectedLead.utm_medium }}</span>
            </div>
            <div class="lead-field">
              <span class="lead-field-label">Primeira interação</span>
              <span class="lead-field-value">{{ selectedLead.date }}</span>
            </div>
          </div>
        </div>

        <!-- Ações rápidas -->
        <div class="lead-panel-actions">
          <a :href="'https://wa.me/55' + selectedLead.phone.replace(/\D/g,'')" target="_blank" class="lead-action-btn lead-action-whatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.105 1.523 5.827L.057 23.884l6.204-1.626A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-5.007-1.37l-.359-.213-3.722.976.993-3.63-.234-.373A9.818 9.818 0 0 1 2.18 12c0-5.42 4.4-9.818 9.818-9.818 5.42 0 9.818 4.399 9.818 9.818 0 5.42-4.398 9.818-9.817 9.818z"/></svg>
            Abrir WhatsApp
          </a>
          <a :href="'mailto:' + selectedLead.email" class="lead-action-btn lead-action-email">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            Enviar e-mail
          </a>
        </div>

      </div>
    </transition>

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
      selectedLead: null,
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
        {
          id: 1, name: 'Ana Paula Souza', interest: '2 quartos',
          email: 'ana.paula@email.com', phone: '(45) 99801-2345',
          source: 'Facebook Ads', date: 'Hoje, 09:41', status: 'Novo',
          reuniao: true, tags: ['Novo', 'Formulário', 'WhatsApp'], type: 'form',
          message: 'Tenho interesse em um apartamento de 2 quartos, de preferência no andar alto.',
          utm_campaign: 'jardins-lancamento-2024', utm_medium: 'cpc',
        },
        {
          id: 2, name: 'Marcos Vinícius', interest: '3 quartos',
          email: 'marcos.v@gmail.com', phone: '(45) 98822-6789',
          source: 'Instagram', date: 'Hoje, 08:15', status: 'Contatado',
          reuniao: false, tags: ['Contatado'], type: 'whatsapp',
          message: 'Vi o anúncio no Instagram, quero saber mais sobre os 3 quartos.',
          utm_campaign: 'jardins-instagram-stories', utm_medium: 'social',
        },
        {
          id: 3, name: 'Fernanda Lima', interest: 'Cobertura',
          email: 'fernanda.lima@outlook.com', phone: '(45) 99733-4321',
          source: 'Google Ads', date: 'Ontem, 19:02', status: 'Contatado',
          reuniao: true, tags: ['Contatado', 'Qualificado', 'Formulário', 'WhatsApp'], type: 'form',
          message: 'Procuro uma cobertura duplex. Já visitei o estande. Aguardando proposta.',
          utm_campaign: 'jardins-google-brand', utm_medium: 'cpc',
        },
        {
          id: 4, name: 'Ricardo Alves', interest: '2 quartos',
          email: 'ricardoalves@yahoo.com.br', phone: '(45) 99644-8765',
          source: 'Facebook Ads', date: 'Ontem, 14:37', status: 'Novo',
          reuniao: false, tags: ['Novo'], type: 'form',
          message: null, utm_campaign: 'jardins-lancamento-2024', utm_medium: 'cpc',
        },
        {
          id: 5, name: 'Juliana Prado', interest: 'Área de lazer',
          email: 'ju.prado@gmail.com', phone: '(45) 99555-0011',
          source: 'Site direto', date: '2 dias atrás', status: 'Perdido',
          reuniao: false, tags: ['Perdido'], type: 'whatsapp',
          message: 'Tive interesse mas vou aguardar próximo lançamento.',
          utm_campaign: null, utm_medium: null,
        },
        {
          id: 6, name: 'Carlos Henrique', interest: '3 quartos',
          email: 'carlos.h@empresa.com.br', phone: '(44) 98811-2200',
          source: 'Instagram', date: '2 dias atrás', status: 'Qualificado',
          reuniao: false, tags: ['Qualificado'], type: 'planta',
          message: 'Quero um apartamento de 3 quartos para investimento.',
          utm_campaign: 'jardins-instagram-feed', utm_medium: 'social',
        },
        {
          id: 7, name: 'Patrícia Mendes', interest: 'Cobertura',
          email: 'patricia.mendes@gmail.com', phone: '(45) 99900-7788',
          source: 'Google Ads', date: '3 dias atrás', status: 'Contatado',
          reuniao: false, tags: ['Contatado'], type: 'planta',
          message: null, utm_campaign: 'jardins-google-display', utm_medium: 'display',
        },
        {
          id: 8, name: 'Bruno Ferreira', interest: '2 quartos',
          email: 'brunoferr@hotmail.com', phone: '(45) 98833-5544',
          source: 'Facebook Ads', date: '3 dias atrás', status: 'Novo',
          reuniao: false, tags: ['Novo', 'WhatsApp'], type: 'whatsapp',
          message: 'Me enviou mensagem pelo WhatsApp após ver o anúncio.',
          utm_campaign: 'jardins-lancamento-2024', utm_medium: 'cpc',
        },
        {
          id: 9, name: 'Larissa Costa', interest: '1 quarto',
          email: 'larissa.costa@icloud.com', phone: '(45) 99767-3322',
          source: 'Site direto', date: '4 dias atrás', status: 'Qualificado',
          reuniao: false, tags: ['Qualificado', 'Formulário'], type: 'form',
          message: 'Preciso de um apartamento studio ou 1 quarto, para uso próprio.',
          utm_campaign: null, utm_medium: null,
        },
        {
          id: 10, name: 'Diego Santos', interest: '3 quartos',
          email: 'diegosantos@gmail.com', phone: '(45) 98899-6655',
          source: 'Instagram', date: '5 dias atrás', status: 'Novo',
          reuniao: false, tags: ['Novo'], type: 'planta',
          message: null, utm_campaign: 'jardins-instagram-stories', utm_medium: 'social',
        },
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
    },
    openLead(lead) {
      this.selectedLead = lead
    },
    closeLead() {
      this.selectedLead = null
    },
    initials(name) {
      return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    },
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

/* Linha clicável */
.ativ-row-clickable { cursor: pointer; transition: background 0.15s; }
.ativ-row-clickable:hover td { background: #fafafa; }
.ativ-row-selected td { background: #fef2f2 !important; }

.ativ-td-lead {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ativ-lead-name { font-weight: 600; color: #111827; white-space: nowrap; }
.ativ-lead-meta { font-size: 12px; color: #9ca3af; }

.ativ-lead-contacts {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.ativ-lead-contact {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  color: #6b7280;
  white-space: nowrap;
}

.ativ-lead-contact--phone { color: #059669; }

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

/* ── BACKDROP ── */
.lead-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 900;
  backdrop-filter: blur(2px);
}

/* ── LEAD DETAIL PANEL ── */
.lead-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: #fff;
  border-left: 1px solid #e8e9eb;
  box-shadow: -8px 0 40px rgba(0,0,0,0.12);
  z-index: 1000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.lead-panel-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 24px 20px 16px;
  border-bottom: 1px solid #f0f1f3;
}

.lead-panel-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dc2626, #ef4444);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.5px;
}

.lead-panel-header-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lead-panel-name {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.lead-panel-tags { display: flex; flex-wrap: wrap; gap: 5px; }

.lead-panel-close {
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #6b7280;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.lead-panel-close:hover { background: #fee2e2; color: #dc2626; }

.lead-panel-status-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-bottom: 1px solid #f0f1f3;
  background: #fafafa;
}

.lead-panel-badge { font-size: 12px; }

.lead-panel-date {
  font-size: 12px;
  color: #9ca3af;
  margin-left: auto;
}

.lead-panel-section {
  padding: 18px 20px;
  border-bottom: 1px solid #f0f1f3;
}

.lead-panel-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #9ca3af;
  margin-bottom: 14px;
}

.lead-panel-fields { display: flex; flex-direction: column; gap: 12px; }

.lead-field { display: flex; flex-direction: column; gap: 3px; }

.lead-field-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.lead-field-value {
  font-size: 13.5px;
  color: #111827;
  font-weight: 500;
  word-break: break-all;
}

.lead-field-link { color: #2563eb; text-decoration: none; }
.lead-field-link:hover { text-decoration: underline; }

.lead-field-whatsapp {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #059669 !important;
}

.lead-field-message {
  color: #6b7280 !important;
  font-size: 13px !important;
  font-weight: 400 !important;
  line-height: 1.5;
  font-style: italic;
}

.lead-field-code {
  font-family: 'Courier New', monospace;
  font-size: 12px !important;
  color: #7c3aed !important;
  background: #f5f3ff;
  padding: 2px 7px;
  border-radius: 5px;
  display: inline-block;
}

.lead-panel-actions {
  display: flex;
  gap: 10px;
  padding: 18px 20px;
  margin-top: auto;
  border-top: 1px solid #f0f1f3;
  background: #fafafa;
  position: sticky;
  bottom: 0;
}

.lead-action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 14px;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.15s, transform 0.1s;
}
.lead-action-btn:hover { opacity: 0.88; transform: translateY(-1px); }
.lead-action-btn:active { transform: translateY(0); }

.lead-action-whatsapp { background: #059669; color: #fff; }
.lead-action-email    { background: #2563eb; color: #fff; }

/* ── TRANSITIONS ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to       { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to       { transform: translateX(100%); }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .ativ-stats   { grid-template-columns: repeat(2, 1fr); }
  .ativ-body    { grid-template-columns: 1fr; }
  .ativ-sidebar { order: -1; }
  .lead-panel   { width: 100vw; }
}

@media (max-width: 520px) {
  .ativ-stats { grid-template-columns: 1fr 1fr; }
  .ativ-main-header { flex-direction: column; align-items: flex-start; }
  .ativ-search-wrap { width: 100%; min-width: unset; }
}
</style>
