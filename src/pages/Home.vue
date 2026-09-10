<template>
  <div>
    <!-- Header -->
    <Header />
    <SectionNav />

    <!-- Hero Section - Fixo -->
    <div class="hero-container">
      <Hero />
    </div>

    <main class="main-content">
      <PanoramicSection />
      <LeisureSection />
      <PlantsSection />

      <!-- Localização Section -->
      <LocationSection />

      <!-- Contato Section -->
      <ContactSection />

      <!-- Footer -->
      <Footer />
    </main>
  </div>
</template>

<script>
import Header from '../components/sections/common/Header.vue'
import SectionNav from '../components/sections/common/SectionNav.vue'
import Footer from '../components/sections/common/Footer.vue'
import Hero from '../components/sections/Hero.vue'
import PanoramicSection from '../components/sections/PanoramicSection.vue'
import PlantsSection from '../components/sections/PlantsSection.vue'
import LeisureSection from '../components/sections/LeisureSection.vue'
import LocationSection from '../components/sections/LocationSection.vue'
import ContactSection from '../components/sections/ContactSection.vue'
import { onMounted } from 'vue'
import { useFacebookTracking } from '../composables/useFacebookTracking'
import { useIntersectionTracking } from '../composables/useIntersectionTracking'

export default {
  name: 'Home',
  components: {
    Header,
    SectionNav,
    Footer,
    Hero,
    PanoramicSection,
    PlantsSection,
    LeisureSection,
    LocationSection,
    ContactSection
  },
  setup() {
    const { initializeTracking } = useFacebookTracking()
    const { trackedSections } = useIntersectionTracking()

    onMounted(() => {
      // Inicializar tracking de forma simples
      setTimeout(() => {
        try {
          initializeTracking()
        } catch (error) {
          console.warn('Erro ao inicializar tracking:', error)
        }
      }, 1000)
    })

    return {
      trackedSections
    }
  }
}
</script>

