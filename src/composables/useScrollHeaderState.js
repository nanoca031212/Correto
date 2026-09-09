import { ref, computed } from 'vue'

// Estado compartilhado (singleton): Header e SectionNav observam o mesmo scroll
const scrollY = ref(typeof window !== 'undefined' ? window.scrollY : 0)
const showHeaderFromScroll = ref(true)
const isScrolled = ref(false)
// Permite que outros componentes (ex.: um overlay/modal) forcem o header a
// ficar escondido, independente do scroll - usado quando o header atrapalha
const forceHiddenCount = ref(0)
const navBarsForceHidden = computed(() => forceHiddenCount.value > 0)
const showHeader = computed(() => !navBarsForceHidden.value && showHeaderFromScroll.value)

const scrollThreshold = 100
let lastScrollY = typeof window !== 'undefined' ? window.scrollY : 0
let listenerAttached = false

const handleScroll = () => {
  const currentScrollY = window.scrollY
  const isNearTop = currentScrollY <= scrollThreshold
  const scrollingDown = currentScrollY > lastScrollY

  // Perto do topo (Hero) sempre mostra o header; depois disso, alterna
  // conforme a direção do scroll (desce = esconde header, sobe = mostra)
  showHeaderFromScroll.value = isNearTop || !scrollingDown
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

  return { scrollY, showHeader, isScrolled, navBarsForceHidden }
}

// Chame com true ao abrir algo que deve esconder o header (ex.: overlay),
// e com false ao fechar. Usa contador para suportar chamadas concorrentes.
export function setHeaderForceHidden(hidden) {
  forceHiddenCount.value = Math.max(0, forceHiddenCount.value + (hidden ? 1 : -1))
}
