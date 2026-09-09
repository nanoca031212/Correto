<template>
  <section id="plantas" class="plants-section">
    <!-- Cabeçalho -->
    <div class="section-header">
      <SplitText tag="h2" class="section-title">
        Plantas dos <span class="text-accent">Apartamentos</span>
      </SplitText>
      <SplitText tag="p" class="section-subtitle" :delay="10">
        Layouts modernos e funcionais pensados para o seu conforto
      </SplitText>
    </div>
    
    <!-- Galeria em acordeão (visão padrão) -->
    <div v-if="viewMode === 'gallery'" class="accordion-gallery" role="list" aria-label="Plantas dos apartamentos">
      <div
        v-for="(plant, index) in plants"
        :key="plant.id"
        class="ag-panel"
        role="listitem"
        tabindex="0"
        :aria-label="plant.title"
        @click="selectPlant(index)"
        @keydown.enter="selectPlant(index)"
        @keydown.space.prevent="selectPlant(index)"
      >
        <span class="ag-panel__frame">
          <span class="ag-panel__media">
            <img :src="plant.image" :alt="plant.title" draggable="false">
          </span>
          <span class="ag-panel__overlay" aria-hidden="true"></span>
        </span>
        <span class="ag-panel__label">
          <span class="ag-panel__bar"></span>
          <span class="ag-panel__text">{{ plant.title }}</span>
        </span>
      </div>
    </div>

    <!-- Card único da planta selecionada (após clicar na galeria) -->
    <div v-else class="single-plant-container">
      <button type="button" class="back-to-gallery" @click="backToGallery">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
        Voltar para todas as plantas
      </button>

      <div class="plant-card active single">
        <!-- Imagem da Planta -->
        <div class="card-image">
          <img :src="selectedPlantData.image" :alt="selectedPlantData.title">
          <div class="card-overlay">
            <span class="apartment-type">{{ selectedPlantData.type }}</span>
          </div>
        </div>

        <!-- Conteúdo do Card -->
        <div class="card-content">
          <div class="card-header">
            <h3 class="apartment-title">{{ selectedPlantData.title }}</h3>
            <div class="apartment-area">{{ selectedPlantData.area }}</div>
          </div>

          <p class="apartment-description">
            {{ selectedPlantData.description }}
          </p>

          <!-- Features Grid -->
          <div class="features-grid">
            <div class="feature" v-for="feature in selectedPlantData.features" :key="feature.text">
              <span class="icon" v-html="feature.icon"></span>
              <span>{{ feature.text }}</span>
            </div>
          </div>

          <!-- Botões de Ação -->
          <div class="card-actions">
            <button
              @click="requestPlantInfo(selectedPlantData.id)"
              class="btn-primary"
            >
              Solicitar Informações
            </button>
            <button
              @click="viewDetails(selectedPlantData.id)"
              class="btn-secondary"
            >
              Ver Planta Detalhada
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert Dialog (padrão shadcn/ui): foto em cima, botões embaixo -->
    <Teleport to="body">
      <div v-if="showModal" class="ad-overlay" @click="closeModal">
        <div class="ad-content" @click.stop role="alertdialog" aria-modal="true">
          <div class="ad-image-wrap">
            <img
              :src="selectedPlant?.image"
              :alt="selectedPlant?.title"
              class="ad-image"
            >
          </div>

          <div class="ad-footer">
            <button type="button" class="ad-btn ad-btn-outline" @click="closeModal">
              Fechar
            </button>
            <button type="button" class="ad-btn ad-btn-solid" @click="handleRequestFromModal">
              Solicitar Informações
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useFacebookTracking } from '../../composables/useFacebookTracking'
import { setHeaderForceHidden } from '../../composables/useScrollHeaderState'
import SplitText from '../animations/SplitText.vue'

export default {
  name: 'PlantsSection',
  components: {
    SplitText
  },
  setup() {
    const { 
      trackFloorPlanView, 
      trackWhatsAppClick, 
      trackViewContent,
      trackFormStart,
      trackContact
    } = useFacebookTracking()
    
    const currentIndex = ref(0)
    const viewMode = ref('gallery') // 'gallery' | 'detail'
    const selectedPlantIndex = ref(0)
    const cardWidth = ref(400)
    const showModal = ref(false)
    const selectedPlant = ref(null)
    const dragOffset = ref(0)
    const isDragging = ref(false)
    const dragStartX = ref(0)
    const dragStartY = ref(0)
    const dragThreshold = 50 // Distância mínima para trocar slide

    const plants = ref([
      {
        id: 'planta-2q-49m',
        type: 'Apartamento Tipo',
        title: 'Apartamento 49,5m²',
        area: '2 Quartos com Suíte',
        description: 'Apartamento com 2 quartos sendo 1 suíte, sala de estar/jantar, cozinha, área de serviço e 2 banheiros. Paredes internas em Drywall.',
        image: '/plantas/planta_tipo_1.png',
        features: [
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>', 
            text: '1 suíte' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 
            text: '2 quartos' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path><path d="M2 12v7c0 .552.448 1 1 1h18c.552 0 1-.448 1-1v-7"></path></svg>', 
            text: '2 banheiros' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18m-9-9v18"></path><rect x="8" y="8" width="8" height="8" rx="1"></rect></svg>', 
            text: 'Cozinha' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>', 
            text: 'Área de serviço' 
          }
        ]
      },
      {
        id: 'planta-2q-51m',
        type: 'Apartamento Tipo',
        title: 'Apartamento 51,76m²',
        area: '2 Quartos com Suíte',
        description: 'Apartamento com 2 quartos sendo 1 suíte, sala de estar/jantar, cozinha, área de serviço e 2 banheiros. Layout linear otimizado. Paredes internas em Drywall.',
        image: '/plantas/planta_tipo_2.png',
        features: [
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>', 
            text: '1 suíte' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 
            text: '2 quartos' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path><path d="M2 12v7c0 .552.448 1 1 1h18c.552 0 1-.448 1-1v-7"></path></svg>', 
            text: '2 banheiros' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18m-9-9v18"></path><rect x="8" y="8" width="8" height="8" rx="1"></rect></svg>', 
            text: 'Cozinha' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>', 
            text: 'Área de serviço' 
          }
        ]
      },
      {
        id: 'planta-2q-garden-64m',
        type: 'Garden',
        title: 'Apartamento Garden 64,78m²',
        area: '2 Quartos com Suíte',
        description: 'Garden com 2 quartos sendo 1 suíte, sala de estar/jantar, cozinha, área de serviço, 2 banheiros e área privativa com jardim. Paredes internas em Drywall.',
        image: '/plantas/planta_tipo_3.png',
        features: [
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>', 
            text: '1 suíte' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 
            text: '2 quartos' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path><path d="M2 12v7c0 .552.448 1 1 1h18c.552 0 1-.448 1-1v-7"></path></svg>', 
            text: '2 banheiros' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18m-9-9v18"></path><rect x="8" y="8" width="8" height="8" rx="1"></rect></svg>', 
            text: 'Cozinha' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path><path d="M16 3v4M8 3v4"></path></svg>', 
            text: 'Jardim privativo' 
          }
        ]
      },
      {
        id: 'planta-2q-garden-74m',
        type: 'Garden',
        title: 'Apartamento Garden 74,10m²',
        area: '2 Quartos com Suíte',
        description: 'Garden com 2 quartos sendo 1 suíte, sala de estar/jantar, cozinha, área de serviço, 2 banheiros e área privativa com jardim e espaço gourmet. Paredes internas em Drywall.',
        image: '/plantas/planta_tipo_4.png',
        features: [
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>', 
            text: '1 suíte' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 
            text: '2 quartos' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path><path d="M2 12v7c0 .552.448 1 1 1h18c.552 0 1-.448 1-1v-7"></path></svg>', 
            text: '2 banheiros' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18m-9-9v18"></path><rect x="8" y="8" width="8" height="8" rx="1"></rect></svg>', 
            text: 'Cozinha' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path><path d="M16 3v4M8 3v4"></path></svg>', 
            text: 'Jardim + Gourmet' 
          }
        ]
      },
      {
        id: 'planta-1q-garden-58m',
        type: 'Garden',
        title: 'Apartamento Garden 58,75m²',
        area: '1 Quarto',
        description: 'Garden com 1 quarto, sala de estar/jantar, cozinha, área de serviço, banheiro, depósito e área privativa com jardim. Paredes internas em Drywall.',
        image: '/plantas/planta_tipo_5.png',
        features: [
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 
            text: '1 quarto' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path><path d="M2 12v7c0 .552.448 1 1 1h18c.552 0 1-.448 1-1v-7"></path></svg>', 
            text: '1 banheiro' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18m-9-9v18"></path><rect x="8" y="8" width="8" height="8" rx="1"></rect></svg>', 
            text: 'Cozinha' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"></path><path d="M16 3v4M8 3v4"></path></svg>', 
            text: 'Jardim privativo' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>', 
            text: 'Depósito' 
          }
        ]
      },
      {
        id: 'planta-1q-office-51m',
        type: 'Apartamento Tipo',
        title: 'Apartamento 51,76m²',
        area: '1 Quarto com Home Office',
        description: 'Apartamento com 1 quarto, sala de estar/jantar, cozinha, área de serviço, banheiro e espaço home office. Paredes internas em Drywall.',
        image: '/plantas/planta_tipo_6.png',
        features: [
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>', 
            text: '1 quarto' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"></path><path d="M21 12c.552 0 1-.448 1-1V5c0-.552-.448-1-1-1H3c-.552 0-1 .448-1 1v6c0 .552.448 1 1 1h18z"></path><path d="M2 12v7c0 .552.448 1 1 1h18c.552 0 1-.448 1-1v-7"></path></svg>', 
            text: '1 banheiro' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18m-9-9v18"></path><rect x="8" y="8" width="8" height="8" rx="1"></rect></svg>', 
            text: 'Cozinha' 
          },
          { 
            icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>', 
            text: 'Home Office' 
          }
        ]
      }
    ])
    
    const updateCardWidth = () => {
      const container = document.querySelector('.carousel-container')
      if (container) {
        const containerWidth = container.offsetWidth
        if (window.innerWidth <= 768) {
          cardWidth.value = containerWidth - 80 // Mobile: quase toda a largura
        } else {
          cardWidth.value = Math.min(400, containerWidth * 0.7) // Desktop: 70% ou 400px max
        }
      }
    }

    const nextSlide = () => {
      if (currentIndex.value < plants.value.length - 1) {
        // Adiciona classe de animação antes de mudar
        const currentCard = document.querySelector('.plant-card.active')
        if (currentCard) {
          currentCard.classList.add('slide-out-left')
        }
        
        setTimeout(() => {
          currentIndex.value++
          
          // Remove a classe após a transição
          setTimeout(() => {
            if (currentCard) {
              currentCard.classList.remove('slide-out-left')
            }
          }, 100)
        }, 150)
      }
    }
    
    const previousSlide = () => {
      if (currentIndex.value > 0) {
        // Adiciona classe de animação antes de mudar
        const currentCard = document.querySelector('.plant-card.active')
        if (currentCard) {
          currentCard.classList.add('slide-out-right')
        }
        
        setTimeout(() => {
          currentIndex.value--
          
          // Remove a classe após a transição
          setTimeout(() => {
            if (currentCard) {
              currentCard.classList.remove('slide-out-right')
            }
          }, 100)
        }, 150)
      }
    }
    
    const goToSlide = (index) => {
      if (index === currentIndex.value) return
      
      const direction = index > currentIndex.value ? 'left' : 'right'
      const currentCard = document.querySelector('.plant-card.active')
      
      if (currentCard) {
        currentCard.classList.add(`slide-out-${direction}`)
      }
      
      setTimeout(() => {
        currentIndex.value = index
        
        // Track plant view when slide changes
        const plant = plants.value[index]
        if (plant) {
          trackViewContent('property', plant.id, plant.price ? parseInt(plant.price.replace(/\D/g, '')) : 240000)
        }
        
        // Remove a classe após a transição
        setTimeout(() => {
          if (currentCard) {
            currentCard.classList.remove(`slide-out-${direction}`)
          }
        }, 100)
      }, 150)
    }
    
    const selectedPlantData = computed(() => plants.value[selectedPlantIndex.value])

    const selectPlant = (index) => {
      selectedPlantIndex.value = index
      viewMode.value = 'detail'

      const plant = plants.value[index]
      if (plant) {
        trackViewContent('property', plant.id, plant.price ? parseInt(plant.price.replace(/\D/g, '')) : 240000)
      }
    }

    const backToGallery = () => {
      viewMode.value = 'gallery'
    }

    const requestPlantInfo = (plantId) => {
      // Track form start
      trackFormStart()
      
      // Rolar até o formulário de contato
      const contactSection = document.getElementById('contato')
      if (contactSection) {
        contactSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        })
        
        // Focar no primeiro campo do formulário após um pequeno delay
        setTimeout(() => {
          const nameInput = contactSection.querySelector('input[type="text"]')
          if (nameInput) {
            nameInput.focus()
          }
        }, 800)
      }
    }
    
    const viewDetails = (plantId) => {
      const plant = plants.value.find(p => p.id === plantId)
      if (plant) {
        // Track floor plan view
        trackFloorPlanView(plantId)

        selectedPlant.value = plant
        showModal.value = true
        document.body.style.overflow = 'hidden'
        setHeaderForceHidden(true) // header atrapalha por cima do overlay
      }
    }

    const closeModal = () => {
      showModal.value = false
      selectedPlant.value = null
      document.body.style.overflow = 'auto'
      setHeaderForceHidden(false)
    }

    const handleKeydown = (event) => {
      if (event.key === 'Escape' && showModal.value) {
        closeModal()
      }
    }

    const handleRequestFromModal = () => {
      const plantId = selectedPlant.value?.id
      closeModal()
      requestPlantInfo(plantId)
    }
    
    
    const startDrag = (event) => {
      // Não inicia drag se clicou em um botão ou elemento interativo
      if (event.target.closest('button') || event.target.closest('.btn-primary') || event.target.closest('.btn-secondary')) {
        return
      }
      
      isDragging.value = true
      dragOffset.value = 0
      
      if (event instanceof MouseEvent) {
        dragStartX.value = event.clientX
        dragStartY.value = event.clientY
      } else if (event instanceof TouchEvent) {
        const touch = event.touches[0]
        dragStartX.value = touch.clientX
        dragStartY.value = touch.clientY
      }
    }
    
    const handleDrag = (event) => {
      if (!isDragging.value) return
      
      let currentX = 0
      let currentY = 0
      
      if (event instanceof MouseEvent) {
        currentX = event.clientX
        currentY = event.clientY
      } else if (event instanceof TouchEvent && event.touches.length > 0) {
        const touch = event.touches[0]
        currentX = touch.clientX
        currentY = touch.clientY
      }
      
      const deltaX = currentX - dragStartX.value
      const deltaY = currentY - dragStartY.value
      
      dragOffset.value = deltaX
      
      // Só previne o evento se o movimento for claramente horizontal
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 15) {
        event.preventDefault()
      }
    }
    
    const endDrag = () => {
      if (!isDragging.value) return

      const dragDistance = Math.abs(dragOffset.value)
      const dragDirection = dragOffset.value > 0 ? 'right' : 'left'

      // Muda o índice e zera o offset no mesmo tick: o track anima direto
      // da posição arrastada até o novo card, num único movimento (sem
      // "voltar" antes de avançar, como acontecia com o delay de 150ms).
      if (dragDistance > dragThreshold) {
        if (dragDirection === 'left' && currentIndex.value < plants.value.length - 1) {
          currentIndex.value++
        } else if (dragDirection === 'right' && currentIndex.value > 0) {
          currentIndex.value--
        }
      }

      isDragging.value = false
      dragOffset.value = 0
    }
    
    const handleTouchMove = (event) => {
      handleDrag(event)
    }
    
    const startCarouselTouch = (event) => {
      startDrag(event)
    }
    
    const handleCarouselTouchMove = (event) => {
      handleDrag(event)
    }
    
    const endCarouselTouch = () => {
      endDrag()
    }
    
    // Track initial plant view on mount
    onMounted(() => {
      updateCardWidth()
      window.addEventListener('resize', updateCardWidth)
      document.addEventListener('keydown', handleKeydown)

      // Track initial plant view
      if (plants.value.length > 0) {
        const firstPlant = plants.value[0]
        trackViewContent('property', firstPlant.id, firstPlant.price ? parseInt(firstPlant.price.replace(/\D/g, '')) : 240000)
      }
    })

    onUnmounted(() => {
      window.removeEventListener('resize', updateCardWidth)
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = 'auto'
      if (showModal.value) setHeaderForceHidden(false)
    })
    
    return {
      plants,
      currentIndex,
      viewMode,
      selectedPlantIndex,
      selectedPlantData,
      selectPlant,
      backToGallery,
      cardWidth,
      showModal,
      selectedPlant,
      nextSlide,
      previousSlide,
      goToSlide,
      requestPlantInfo,
      handleRequestFromModal,
      viewDetails,
      closeModal,
      dragOffset,
      isDragging,
      dragStartX,
      dragStartY,
      dragThreshold,
      startDrag,
      handleDrag,
      endDrag,
      handleTouchMove,
      startCarouselTouch,
      handleCarouselTouchMove,
      endCarouselTouch
    }
  }
}
</script>

<style scoped>
.plants-section {
  background: #ffffff;
  padding: 10px 0;
  padding-top: 40px;
  min-height: auto; 
}

/* Header */
.section-header {
  text-align: center;
  margin-bottom: 4rem;
  padding: 0 2rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 600;
  color: #161616;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.text-accent {
  color: #161616;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #1d1d1d;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Galeria em acordeão */
.accordion-gallery {
  display: flex;
  flex-direction: row;
  gap: 10px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4rem;
  height: 420px;
}

.ag-panel {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  border-radius: 16px;
  cursor: pointer;
  outline: none;
  background: #0a0713;
  transition: flex-grow 0.5s ease;
}

.ag-panel:hover,
.ag-panel:focus-visible {
  flex-grow: 4;
}

.ag-panel:focus-visible {
  box-shadow: 0 0 0 2px #44b319;
}

.ag-panel__frame {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.ag-panel__media {
  position: absolute;
  inset: 0;
}

.ag-panel__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(1);
  transition: filter 0.5s ease;
  user-select: none;
  -webkit-user-drag: none;
}

.ag-panel:hover .ag-panel__media img,
.ag-panel:focus-visible .ag-panel__media img {
  filter: grayscale(0);
}

.ag-panel__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 45%, rgba(6, 0, 16, 0.85) 100%);
}

.ag-panel__label {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.ag-panel:hover .ag-panel__label,
.ag-panel:focus-visible .ag-panel__label {
  opacity: 1;
}

.ag-panel__bar {
  flex: 0 0 auto;
  width: 3px;
  height: 26px;
  border-radius: 3px;
  background: #ffffff;
}

.ag-panel__text {
  color: #ffffff;
  font-weight: 600;
  font-size: clamp(0.9rem, 1.4vw, 1.2rem);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.55);
}

/* Card único da planta selecionada */
.single-plant-container {
  position: relative;
  max-width: 440px;
  margin: 0 auto;
  padding: 0 1rem;
}

.back-to-gallery {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #161616;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0 auto 1.5rem;
  padding: 8px 0;
  transition: gap 0.2s ease;
}

.back-to-gallery:hover {
  gap: 12px;
}

.plant-card.single {
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .accordion-gallery {
    flex-direction: column;
    height: auto;
    padding: 0 1.5rem;
    gap: 12px;
  }

  .ag-panel {
    flex: none;
    height: 90px;
  }

  .ag-panel:hover,
  .ag-panel:focus-visible {
    flex-grow: 0;
  }

  .ag-panel__media img {
    filter: grayscale(0);
  }

  .ag-panel__label {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ag-panel,
  .ag-panel__media img,
  .ag-panel__label {
    transition: none;
  }
}

/* Carousel Container */
.carousel-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 4rem;
  position: relative;
}

.carousel-wrapper {
  overflow: hidden;
  border-radius: 20px;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.carousel-wrapper:active {
  cursor: grabbing;
}

.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  gap: 3rem;
  padding: 0 2rem;
  will-change: transform;
}

/* Plant Card */
.plant-card {
  flex: 0 0 auto;
  width: 400px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid rgba(0, 0, 0, 0.04);
  opacity: 0.4;
  transform: scale(0.85);
  transform-origin: center center;
}

.plant-card.active {
  opacity: 1;
  transform: scale(1);
  animation: slideInCenter 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  z-index: 3;
}

/* Plantas adjacentes - preparação para entrada */
.plant-card.next,
.plant-card.prev {
  opacity: 0.7;
  transform: scale(0.92);
  z-index: 2;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.plant-card.next {
  transform: scale(0.92) translateX(-10px);
}

.plant-card.prev {
  transform: scale(0.92) translateX(10px);
}

/* Plantas distantes */
.plant-card.far {
  opacity: 0.3;
  transform: scale(0.8);
  z-index: 1;
}

/* Efeito de hover para plantas adjacentes */
.plant-card.next:hover,
.plant-card.prev:hover {
  opacity: 0.85;
  transform: scale(0.95);
  cursor: pointer;
}

/* Animações de entrada */
@keyframes slideInCenter {
  0% {
    opacity: 0.7;
    transform: scale(0.8) translateX(0px);
    z-index: 3;
  }
  50% {
    opacity: 0.85;
    transform: scale(0.9) translateX(0px);
    z-index: 3;
  }
  100% {
    opacity: 1;
    transform: scale(1) translateX(0px);
    z-index: 3;
  }
}

/* Animações de saída */
.plant-card.slide-out-left {
  animation: slideOutLeft 0.3s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}

.plant-card.slide-out-right {
  animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 0.6, 1) forwards;
}

@keyframes slideOutLeft {
  0% {
    opacity: 1;
    transform: scale(1) translateX(0px);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.85) translateX(-100px);
  }
  100% {
    opacity: 0.3;
    transform: scale(0.7) translateX(-200px);
  }
}

@keyframes slideOutRight {
  0% {
    opacity: 1;
    transform: scale(1) translateX(0px);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.85) translateX(100px);
  }
  100% {
    opacity: 0.3;
    transform: scale(0.7) translateX(200px);
  }
}

/* Animações para próximas plantas que entram */
.plant-card:not(.active) {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Efeito de preparação para plantas adjacentes */
.plant-card:nth-child(n+1) {
  transform-origin: center center;
}

/* Melhorias na transição do track */
.carousel-track:not(.dragging) {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Efeitos de hover melhorados */
.plant-card:hover:not(.active) {
  transform: scale(0.98);
  opacity: 0.85;
  transition: all 0.3s ease;
}

.plant-card.active:hover {
  transform: scale(1.02);
  transition: all 0.3s ease;
}

/* Card Image */
.card-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
}

.plant-card.active .card-image img {
  transform: scale(1.02);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.05) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 1rem;
}

.apartment-type {
  background: rgba(16, 185, 129, 0.9);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

/* Card Content */
.card-content {
  padding: 1.5rem;
}

.card-header {
  margin-bottom: 0.8rem;
}

.apartment-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #000000;
  margin-bottom: 0.3rem;
  line-height: 1.3;
}

.apartment-area {
  font-size: 1rem;
  color: #10b981;
  font-weight: 600;
}

.apartment-description {
  font-size: 0.85rem;
  line-height: 1.5;
  color: #4a5568;
  margin-bottom: 1rem;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.feature {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #f8fafc;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  color: #2d3748;
  border: 1px solid #e2e8f0;
}

.feature .icon {
  font-size: 0.9rem;
  color: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
}

.feature .icon svg {
  width: 16px;
  height: 16px;
  stroke: #000000;
  fill: none;
}

/* Card Actions */
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #1a1a1a;
  color: white;
}

.btn-primary:hover {
  background: #2d3748;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #f3f4f6;
  color: #1a1a1a;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

/* Efeito de clique */
.btn-primary:active,
.btn-secondary:active {
  transform: translateY(0);
}

/* Responsividade para os botões */
@media (max-width: 768px) {
  .card-actions {
    gap: 8px;
  }

  .btn-primary,
  .btn-secondary {
    padding: 12px 20px;
    font-size: 13px;
  }
}

/* Carousel Controls */
.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.nav-button {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #4a5568;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.nav-button:hover:not(:disabled) {
  background: #10b981;
  color: white;
  border-color: #10b981;
  transform: scale(1.05);
}

.nav-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.carousel-indicators {
  display: flex;
  gap: 0.5rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: #cbd5e0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #10b981;
  transform: scale(1.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .carousel-track {
    gap: 1rem;
    padding: 0 0.5rem;
  }
  
  .plant-card {
    width: calc(100vw - 120px);
    max-width: 350px;
  }
  
  /* Animações mobile - movimentos menores */
  @keyframes slideOutLeft {
    0% {
      opacity: 1;
      transform: scale(1) translateX(0px);
    }
    50% {
      opacity: 0.6;
      transform: scale(0.9) translateX(-60px);
    }
    100% {
      opacity: 0.3;
      transform: scale(0.8) translateX(-120px);
    }
  }
  
  @keyframes slideOutRight {
    0% {
      opacity: 1;
      transform: scale(1) translateX(0px);
    }
    50% {
      opacity: 0.6;
      transform: scale(0.9) translateX(60px);
    }
    100% {
      opacity: 0.3;
      transform: scale(0.8) translateX(120px);
    }
  }
  
  @keyframes slideInCenter {
    0% {
      opacity: 0.7;
      transform: scale(0.85) translateX(0px);
    }
    50% {
      opacity: 0.85;
      transform: scale(0.92) translateX(0px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateX(0px);
    }
  }
  
  .card-content {
    padding: 1.2rem;
  }
  
  .apartment-title {
    font-size: 1.1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 0.4rem;
  }
  
  .card-actions {
    flex-direction: row;
    gap: 0.4rem;
  }
  
  .btn-primary,
  .btn-secondary {
    flex: 1;
    padding: 0.6rem;
    font-size: 0.75rem;
  }
  
  .carousel-controls {
    gap: 1rem;
    margin-top: 1.5rem;
  }
  
  .nav-button {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .carousel-container {
    padding: 0 1rem;
  }
  
  .plant-card {
    width: calc(100vw - 80px);
  }
  
  .card-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    flex: none;
  }
}

/* Large screens optimization */
@media (min-width: 1200px) {
  .carousel-container {
    max-width: 1600px;
    padding: 0 6rem;
  }
  
  .carousel-track {
    gap: 4rem;
    padding: 0 3rem;
  }
  
  .plant-card {
    width: 450px;
  }
}

@media (min-width: 1400px) {
  .carousel-container {
    padding: 0 8rem;
  }
  
  .carousel-track {
    gap: 5rem;
    padding: 0 4rem;
  }
}

/* Alert Dialog (padrão shadcn/ui): overlay escuro + card central,
   foto em cima, botões (Fechar / Solicitar Informações) embaixo */
.ad-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: adFadeIn 0.2s ease-out;
}

@keyframes adFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ad-content {
  width: 100%;
  max-width: 560px;
  max-height: 85vh;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: adZoomIn 0.2s ease-out;
}

@keyframes adZoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.ad-image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
  background: #f8f8f8;
}

.ad-image {
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
}

.ad-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.ad-btn {
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.ad-btn-outline {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.15);
  color: #1a1a1a;
}

.ad-btn-outline:hover {
  background: #f3f4f6;
}

.ad-btn-solid {
  background: #1a1a1a;
  color: #ffffff;
}

.ad-btn-solid:hover {
  background: #2d2d2d;
}

@media (max-width: 480px) {
  .ad-overlay {
    padding: 12px;
  }

  .ad-content {
    padding: 16px;
  }

  .ad-footer {
    flex-direction: column-reverse;
  }

  .ad-btn {
    width: 100%;
  }
}
</style> 