import { ref } from 'vue'

// Estado compartilhado (singleton): Header e SectionNav observam o mesmo scroll
const scrollY = ref(typeof window !== 'undefined' ? window.scrollY : 0)
const showHeader = ref(true)
const isScrolled = ref(false)

const scrollThreshold = 100
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0
let listenerAttached = false

const handleScroll = () => {
  const currentScrollY = window.scrollY
  const isNearTop = currentScrollY <= scrollThreshold
  const scrollingDown = currentScrollY > lastScrollY

  // Perto do topo (Hero) sempre mostra o header; depois disso, alterna
  // conforme a direção do scroll (desce = esconde header, sobe = mostra)
  showHeader.value = isNearTop || !scrollingDown
  isScrolled.value = currentScrollY > 50

  scrollY.value = currentScrollY
  lastScrollY = currentScrollY
}

export function useScrollHeaderState() {
  if (!listenerAttached && typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    listenerAttached = true
  }

  return { scrollY, showHeader, isScrolled }
}
