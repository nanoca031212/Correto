<template>
  <section id="lazer" class="leisure section">
    <div class="container">
      <!-- Cabeçalho minimalista -->
      <div class="section-header">
        <BlurText tag="h2" class="section-title">
          Área de <span class="text-accent">Lazer</span>
        </BlurText>
        <BlurText tag="p" class="section-subtitle">
          Espaços exclusivos pensados para seu conforto e momentos especiais
        </BlurText>
      </div>
      
      <!-- Grid de amenidades -->
      <div class="leisure-grid" ref="leisureGridEl">
        <!-- Guarita -->
        <div class="amenity-card">
          <div class="amenity-image">
            <img 
              src="/Imagens/1-Guarita-Predio-Diurna_2025_01_14-1-1024x768.jpg" 
              alt="Guarita do Prédio"
              loading="lazy"
            >
          </div>
          <div class="amenity-content">
            <h3 class="amenity-title">Guarita 24h</h3>
            <p class="amenity-description">
              Segurança e controle de acesso 24 horas por dia
            </p>
          </div>
        </div>

        <!-- Salão de Festas Externo -->
        <div class="amenity-card">
          <div class="amenity-image">
            <img 
              src="/Imagens/3-Salao-de-Festas-Externo_2025_01_24-1024x576.jpg" 
              alt="Salão de Festas Externo"
              loading="lazy"
            >
          </div>
          <div class="amenity-content">
            <h3 class="amenity-title">Salão de Festas Externo</h3>
            <p class="amenity-description">
              Ambiente amplo e moderno para suas celebrações ao ar livre
            </p>
          </div>
        </div>

        <!-- Salão de Festas Interno -->
        <div class="amenity-card">
          <div class="amenity-image">
            <img 
              src="/Imagens/5-Salao-de-Festas-Interno_2024_12_10-1-1024x576.jpg" 
              alt="Salão de Festas Interno"
              loading="lazy"
            >
          </div>
          <div class="amenity-content">
            <h3 class="amenity-title">Salão de Festas Interno</h3>
            <p class="amenity-description">
              Espaço climatizado para eventos e comemorações
            </p>
          </div>
        </div>

        <!-- Fitness -->
        <div class="amenity-card">
          <div class="amenity-image">
            <img 
              src="/Imagens/6-Fitness_2024_12_10-1-1024x576.jpg" 
              alt="Academia"
              loading="lazy"
            >
          </div>
          <div class="amenity-content">
            <h3 class="amenity-title">Academia</h3>
            <p class="amenity-description">
              Academia equipada para seus treinos diários
            </p>
          </div>
        </div>

        <!-- Espaço Gourmet -->
        <div class="amenity-card">
          <div class="amenity-image">
            <img 
              src="/Imagens/7-Gourmet_2024_12_10-1-1024x576.jpg" 
              alt="Espaço Gourmet"
              loading="lazy"
            >
          </div>
          <div class="amenity-content">
            <h3 class="amenity-title">Espaço Gourmet</h3>
            <p class="amenity-description">
              Área gourmet completa para momentos gastronômicos especiais
            </p>
          </div>
        </div>

        <!-- Playground -->
        <div class="amenity-card">
          <div class="amenity-image">
            <img 
              src="/Imagens/8-Playground-com-vista-Gourmet-praca-encontro_2025_01_14-1-1024x576.jpg" 
              alt="Playground"
              loading="lazy"
            >
          </div>
          <div class="amenity-content">
            <h3 class="amenity-title">Playground</h3>
            <p class="amenity-description">
              Área recreativa segura para a diversão das crianças
            </p>
          </div>
        </div>

        <!-- Praça Jabuticabeira -->
        <div class="amenity-card">
          <div class="amenity-image">
            <img 
              src="/Imagens/10-Fruicao-Praca-Jabuticabeira_2024_12_10-1-1024x768.jpg" 
              alt="Praça Jabuticabeira"
              loading="lazy"
            >
          </div>
          <div class="amenity-content">
            <h3 class="amenity-title">Praça Jabuticabeira</h3>
            <p class="amenity-description">
              Área verde com jabuticabeiras para momentos de relaxamento
            </p>
          </div>
        </div>

        <!-- Banheiro Social -->
        <div class="amenity-card">
          <div class="amenity-image">
            <img 
              src="/Imagens/11-Banheiro-Social_04-12-24-1-683x1024.jpg" 
              alt="Banheiro Social"
              loading="lazy"
            >
          </div>
          <div class="amenity-content">
            <h3 class="amenity-title">Banheiro Social</h3>
            <p class="amenity-description">
              Banheiros sociais modernos e bem equipados
            </p>
          </div>
        </div>
      </div>
      
      <!-- Destaque especial -->
      <div class="leisure-highlight-container">
        <div class="leisure-highlight">
          <!-- Carrossel de fundo (fade entre imagens) -->
          <div class="highlight-bg">
            <div
              v-for="(img, index) in bgImages"
              :key="img"
              class="highlight-bg-slide"
              :class="{ 'is-active': index === bgIndex }"
              :style="{ backgroundImage: `url(${img})` }"
            ></div>
            <div class="highlight-bg-overlay"></div>
          </div>

          <div class="highlight-content">
            <h3 class="highlight-title">Viva momentos únicos</h3>
            <div class="highlight-main-copy">
              <p class="highlight-primary">
                <strong>Áreas de lazer completas</strong> para toda a família aproveitar momentos especiais sem sair do condomínio.
              </p>
              <p class="highlight-secondary">
                Do fitness ao playground, do salão de festas ao espaço gourmet, tudo pensado para seu conforto e bem-estar.
              </p>
              <div class="highlight-buttons">
                <button type="button" @click="openTour" class="btn-tour">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 12l4 4 4-4m-4-4v8"></path>
                  </svg>
                  Tour Virtual 360°
                </button>
                <button @click="openWhatsApp" class="btn-primary">
                  Fale Conosco
                </button>
              </div>
            </div>

            <!-- Indicadores do carrossel de fundo -->
            <div class="highlight-carousel-dots">
              <button
                v-for="(img, index) in bgImages"
                :key="'dot-' + img"
                type="button"
                class="highlight-dot"
                :class="{ active: index === bgIndex }"
                @click="setBgIndex(index)"
                :aria-label="'Ver imagem ' + (index + 1)"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal do Tour Virtual 360° (embutido via iframe) -->
    <Teleport to="body">
      <div v-if="showTourModal" class="tour-modal-overlay" @click.self="closeTour">
        <div class="tour-modal">
          <button type="button" class="tour-modal-close" @click="closeTour" aria-label="Fechar tour virtual">
            ×
          </button>
          <iframe
            class="tour-modal-iframe"
            src="https://tour360.meupasseiovirtual.com/074307/303294/tourvirtual/index.html"
            title="Tour Virtual 360° - Jardins Residence"
            allow="accelerometer; gyroscope; fullscreen"
            allowfullscreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useFacebookTracking } from '../../composables/useFacebookTracking'
import BlurText from '../animations/BlurText.vue'

export default {
  name: 'LeisureSection',
  components: {
    BlurText
  },
  setup() {
    const { trackEvent, trackContact } = useFacebookTracking()

    const leisureGridEl = ref(null)
    let leisureObserver = null

    const bgImages = [
      '/bgcard/sala.jpg',
      '/bgcard/cozinha.jpg',
      '/bgcard/quarto.jpg',
      '/bgcard/banheiro.jpg'
    ]
    const bgIndex = ref(0)
    let bgInterval = null

    const startBgCarousel = () => {
      if (bgInterval) clearInterval(bgInterval)
      const reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) return
      bgInterval = setInterval(() => {
        bgIndex.value = (bgIndex.value + 1) % bgImages.length
      }, 4000)
    }

    const setBgIndex = (index) => {
      bgIndex.value = index
      startBgCarousel()
    }

    const showTourModal = ref(false)

    const openTour = () => {
      trackEvent('CTAClick', {
        content_category: 'real_estate',
        cta_type: 'tour_360',
        cta_location: 'leisure',
        content_name: 'Jardins Residence'
      })

      showTourModal.value = true
      document.body.style.overflow = 'hidden'
    }

    const closeTour = () => {
      showTourModal.value = false
      document.body.style.overflow = ''
    }

    const handleKeydown = (event) => {
      if (event.key === 'Escape' && showTourModal.value) {
        closeTour()
      }
    }

    const openWhatsApp = () => {
      trackEvent('CTAClick', {
        content_category: 'real_estate',
        cta_type: 'fale_conosco',
        cta_location: 'leisure',
        content_name: 'Jardins Residence'
      })

      trackContact()

      const contactSection = document.getElementById('contato')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
    }

    onMounted(() => {
      startBgCarousel()

      // Track leisure section view
      trackEvent('ViewContent', {
        content_category: 'real_estate',
        content_type: 'leisure_amenities',
        content_name: 'Jardins Residence - Área de Lazer',
        value: 0,
        currency: 'BRL'
      })

      document.addEventListener('keydown', handleKeydown)

      const reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (leisureGridEl.value) {
        const cards = Array.from(leisureGridEl.value.querySelectorAll('.amenity-card'))

        if (reduceMotion) {
          cards.forEach((card) => card.classList.add('is-visible'))
        } else {
          // Cada card é observado individualmente (não o grid inteiro), pra
          // animar um por vez conforme entra na tela - não todos de uma vez
          // com um delay pequeno que já teria terminado antes do usuário
          // rolar até os cards de baixo. Sem "once": sai de tela, reseta.
          leisureObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              entry.target.classList.toggle('is-visible', entry.isIntersecting)
            })
          }, { threshold: 0.2 })
          cards.forEach((card) => leisureObserver.observe(card))
        }
      }
    })

    onUnmounted(() => {
      if (leisureObserver) leisureObserver.disconnect()
      if (bgInterval) clearInterval(bgInterval)
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = ''
    })

    return {
      leisureGridEl,
      openWhatsApp,
      showTourModal,
      openTour,
      closeTour,
      bgImages,
      bgIndex,
      setBgIndex
    }
  }
}
</script>

<style scoped>
.leisure {
  padding: 50px 0;
  background: white;
  position: relative;
  z-index: 1;
  min-height: 100vh;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 3;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: #1a1a1a;
  margin-bottom: 16px;
  letter-spacing: -1px;
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
}

.text-accent {
  font-weight: 400;
  color: #2d3748;
}

.section-subtitle {
  font-size: 18px;
  color: #6b7280;
  font-weight: 300;
  line-height: 1.6;
  letter-spacing: -0.2px;
}

.leisure-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  margin-bottom: 40px;
  position: relative;
  z-index: 3;
}

.amenity-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
              transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 0.4s ease;
}

.amenity-card.is-visible {
  opacity: 1;
  transform: scale(1);
}

.amenity-card.is-visible:hover {
  transform: scale(1) translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.amenity-image {
  height: 200px;
  overflow: hidden;
}

.amenity-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.amenity-card:hover .amenity-image img {
  transform: scale(1.05);
}

.amenity-content {
  padding: 24px;
}

.amenity-title {
  font-size: 18px;
  font-weight: 400;
  color: #1a1a1a;
  margin-bottom: 8px;
  letter-spacing: -0.3px;
}

.amenity-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
}

.leisure-highlight-container {
  position: relative;
  border-radius: 20px;
  z-index: 1;
}

.leisure-highlight {
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 64px 40px;
  text-align: center;
  color: #1a1a1a;
  margin: 80px 0;
  position: relative;
  background: #F8F8F8;
  overflow: hidden;
}

/* Carrossel de fundo (crossfade entre imagens) */
.highlight-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.highlight-bg-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.2s ease;
}

.highlight-bg-slide.is-active {
  opacity: 1;
}

.highlight-bg-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(15, 15, 15, 0.6), rgba(15, 15, 15, 0.72));
}

.highlight-content {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.highlight-carousel-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 2.5rem;
}

.highlight-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.35);
  padding: 0;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.3s ease;
}

.highlight-dot:hover {
  background: rgba(255, 255, 255, 0.6);
}

.highlight-dot.active {
  background: #44b319;
  transform: scale(1.3);
}

.highlight-title {
  font-size: clamp(1.8rem, 4vw, 2.5rem);
  font-weight: 300;
  margin-bottom: 2rem;
  letter-spacing: -0.5px;
  color: #ffffff;
}

.highlight-main-copy {
  margin-bottom: 3rem;
}

.highlight-primary {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #ffffff;
}

.highlight-secondary {
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
  opacity: 0.9;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
}

.highlight-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 2rem;
}

.btn-tour {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  background: #44b319;
  color: white;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(68, 179, 25, 0.25);
  position: relative;
  overflow: hidden;
}

.btn-tour::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.btn-tour:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(68, 179, 25, 0.35);
  background: #3a9916;
}

.btn-tour:hover::before {
  transform: translateX(100%);
}

.btn-tour svg {
  width: 24px;
  height: 24px;
  transition: transform 0.4s ease;
}

.btn-tour:hover svg {
  transform: rotate(180deg);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: white;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover {
  background: #1a1a1a;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .leisure {
    padding: 20px 0;
  }
  
  .section-header {
    margin-bottom: 30px;
  }
  
  .leisure-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    margin-bottom: 60px;
  }
  
  .highlight-content {
    padding: 30px 20px;
  }
}

@media (max-width: 480px) {
  .leisure-highlight {
    border-radius: 16px;
    padding: 0px 0px;
  }
  
  .highlight-buttons {
    flex-direction: column;
    gap: 20px;
    padding: 0 16px;
  }
  
  .btn-tour {
    padding: 18px 32px;
    font-size: 1.2rem;
  }
  
  .btn-primary {
    padding: 16px 28px;
  }
  
  .btn-tour,
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 375px) {
  .leisure-highlight {
    padding: 30px 30px;
    margin: 0px 0px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .amenity-card {
    transition: none;
  }

  .highlight-bg-slide {
    transition: none;
  }
}

/* Modal do Tour Virtual 360° */
.tour-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.tour-modal {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  max-height: 900px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
}

.tour-modal-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.tour-modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.tour-modal-close:hover {
  background: rgba(0, 0, 0, 0.85);
}

@media (max-width: 640px) {
  .tour-modal-overlay {
    padding: 0;
  }

  .tour-modal {
    border-radius: 0;
    max-width: none;
    max-height: none;
  }
}
</style> 