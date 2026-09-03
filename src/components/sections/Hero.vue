<template>
  <section id="home" class="hero section bg-black text-white" ref="heroSection">
    <!-- Background completamente fixo -->
    <div 
      class="hero-bg-fixed"
      style="background-image: linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,1)), url('/Imagens/JARDINS-RESIDENCE_PE_FACHADA_2025_01_16-1-1024x1024.jpg')"
    ></div>
    
    <div class="container">
      <div class="hero-content">
        <!-- Badge minimalista -->
        <div class="hero-badge">
          <span class="badge">Lançamento Exclusivo</span>
        </div>
        
        <!-- Título principal elegante -->
        <SplitText tag="h1" class="hero-title" trigger="mount" :delay="22" :start-delay="200">
          Seu Novo Lar no<br>
          <span class="text-accent">Jardins Residence</span>
        </SplitText>
        
        <!-- Subtítulo refinado -->
        <div class="hero-subtitle">
          <SplitText tag="p" trigger="mount" :delay="14" :start-delay="900">Apartamentos modernos com entrada facilitada</SplitText>
          <SplitText tag="p" class="hero-subtitle-highlights" trigger="mount" :delay="8" :start-delay="1700">Parcelas a partir de R$ 2.500,00 · 80% Aprovação no financiamento · 100% Entrega garantida</SplitText>
        </div>

        <!-- CTAs minimalistas -->
        <div class="hero-ctas">
          <button @click="openWhatsApp" class="btn-primary-hero">
            Solicitar Informações
          </button>
          <button @click="scrollToPlants" class="btn-secondary-hero">
            Ver Plantas
          </button>
        </div>
      </div>
      
      <!-- Indicador de scroll minimalista -->
      <div class="scroll-indicator">
        <div class="scroll-text">Role para descobrir mais</div>
        <div class="scroll-arrow">↓</div>
      </div>
    </div>
  </section>
</template>

<script>
import { onMounted } from 'vue'
import { useFacebookTracking } from '../../composables/useFacebookTracking'
import SplitText from '../animations/SplitText.vue'

export default {
  name: 'Hero',
  components: {
    SplitText
  },
  setup() {
    const { 
      trackViewContent, 
      trackEvent, 
      trackContact,
      trackPropertyView
    } = useFacebookTracking()
    
    const openWhatsApp = () => {
      // Track CTA click
      trackEvent('CTAClick', {
        content_category: 'real_estate',
        cta_type: 'solicitar_informacoes',
        cta_location: 'hero',
        content_name: 'Jardins Residence'
      })
      
      trackContact('hero_cta')
      
      const contactSection = document.getElementById('contato')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    const scrollToPlants = () => {
      // Track CTA click
      trackEvent('CTAClick', {
        content_category: 'real_estate',
        cta_type: 'ver_plantas',
        cta_location: 'hero',
        content_name: 'Jardins Residence'
      })
      
      trackEvent('NavigationClick', {
        content_category: 'real_estate',
        navigation_target: 'plantas',
        source: 'hero'
      })
      
      const plantsSection = document.getElementById('plantas')
      if (plantsSection) {
        plantsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    onMounted(() => {
      // Track hero view
      trackViewContent('property', 'jardins_residence_hero', 240000)
      trackPropertyView('jardins_residence', 240000)
      
      // Track hero engagement
      trackEvent('HeroView', {
        content_category: 'real_estate',
        content_name: 'Jardins Residence',
        hero_version: 'v1',
        value: 240000,
        currency: 'BRL'
      })
    })
    
    return {
      openWhatsApp,
      scrollToPlants
    }
  }
}
</script>

<style scoped>
.hero {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding-top: 80px;
}

/* Background completamente fixo */
.hero-bg-fixed {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  z-index: 1;
}

.container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

/* Badge minimalista (apenas mobile/tablet) */
.hero-badge {
  margin-bottom: 32px;
  display: none;
}

@media (max-width: 768px) {
  .hero-badge {
    display: block;
  }
}

.badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 1);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  text-transform: uppercase;
}

/* Título elegante */
.hero-title {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 200;
  line-height: 1.1;
  margin-bottom: 24px;
  color: white;
  letter-spacing: -2px;
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
}

.text-accent {
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
}

/* Subtítulo refinado */
.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 48px;
  line-height: 1.6;
  font-weight: 300;
  letter-spacing: -0.2px;
}

.hero-subtitle-highlights {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  margin-top: 6px;
}

/* CTAs minimalistas */
.hero-ctas {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 64px;
  align-items: center;
}

.btn-primary-hero {
  background: white;
  color: #1a1a1a;
  border: none;
  padding: 16px 32px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: -0.1px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.btn-primary-hero:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-2px);
}

.btn-secondary-hero {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 16px 32px;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: -0.1px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  min-width: 200px;
}

.btn-secondary-hero:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

/* Indicador de scroll */
.scroll-indicator {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  animation: bounce 2s infinite;
}

.scroll-text {
  font-size: 12px;
  margin-top: 18px;
  color: rgba(255, 255, 255, 1);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.scroll-arrow {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.6);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .hero {
    padding-top: 60px;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .hero-ctas {
    flex-direction: column;
    gap: 12px;
  }
  
  .btn-primary-hero,
  .btn-secondary-hero {
    width: 100%;
    max-width: 280px;
    padding: 14px 24px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .hero-badge {
    margin-bottom: 24px;
  }

  .hero-subtitle {
    font-size: 16px;
    margin-bottom: 32px;
  }
}

/* Otimização para dispositivos com motion reduzido */
@media (prefers-reduced-motion: reduce) {
  .scroll-indicator {
    animation: none;
  }
  
  .btn-primary-hero:hover,
  .btn-secondary-hero:hover {
    transform: none;
  }
}
</style> 