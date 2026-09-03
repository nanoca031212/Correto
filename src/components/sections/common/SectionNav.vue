<template>
  <nav
    class="section-nav"
    :class="{ 'section-nav-visible': isVisible }"
    aria-label="Progresso da página"
  >
    <div class="section-nav-progress">
      <div
        class="section-nav-progress-fill"
        :style="{ width: progress + '%' }"
      ></div>
    </div>

    <div class="section-nav-bar">
      <Transition name="nav-fade" mode="out-in">
        <button
          v-if="prevSection"
          :key="'prev-' + prevSection.id"
          type="button"
          class="section-nav-label section-nav-side"
          @click="goTo(prevSection.id)"
        >
          {{ prevSection.label }}
        </button>
        <span
          v-else
          key="prev-empty"
          class="section-nav-label section-nav-side section-nav-empty"
        ></span>
      </Transition>

      <Transition name="nav-fade" mode="out-in">
        <span class="section-nav-current" :key="currentSection.id">
          {{ currentSection.label }}
        </span>
      </Transition>

      <Transition name="nav-fade" mode="out-in">
        <button
          v-if="nextSection"
          :key="'next-' + nextSection.id"
          type="button"
          class="section-nav-label section-nav-side"
          @click="goTo(nextSection.id)"
        >
          {{ nextSection.label }}
        </button>
        <span
          v-else
          key="next-empty"
          class="section-nav-label section-nav-side section-nav-empty"
        ></span>
      </Transition>
    </div>
  </nav>
</template>

<script>
import { computed, ref, watch, onMounted, onUnmounted } from "vue";
import { useScrollHeaderState } from "../../../composables/useScrollHeaderState";

const SECTIONS = [
  { id: "home", label: "Início" },
  { id: "panoramica", label: "Vista Panorâmica" },
  { id: "plantas", label: "Plantas" },
  { id: "lazer", label: "Lazer" },
  { id: "localizacao", label: "Localização" },
  { id: "contato", label: "Contato" },
];

export default {
  name: "SectionNav",
  setup() {
    const { scrollY, showHeader } = useScrollHeaderState();

    const isVisible = computed(() => !showHeader.value);
    const currentIndex = ref(0);

    const updateCurrentSection = () => {
      const referenceY = 110; // linha de referência: mais ou menos onde essa barra fica
      let activeIdx = 0;
      for (let i = 0; i < SECTIONS.length; i++) {
        const el = document.getElementById(SECTIONS[i].id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= referenceY) {
          activeIdx = i;
        }
      }
      currentIndex.value = activeIdx;
    };

    watch(scrollY, updateCurrentSection);

    const progress = computed(() => {
      // Lê scrollY.value incondicionalmente primeiro: se algum "return" abaixo
      // disparar antes disso, o Vue nunca rastreia a dependência reativa e o
      // computed fica travado no valor da 1ª execução (bug clássico de early-return).
      const y = scrollY.value;
      if (typeof document === "undefined") return 0;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(100, Math.max(0, (y / scrollable) * 100));
    });

    const currentSection = computed(() => SECTIONS[currentIndex.value]);
    const prevSection = computed(
      () => SECTIONS[currentIndex.value - 1] || null,
    );
    const nextSection = computed(
      () => SECTIONS[currentIndex.value + 1] || null,
    );

    const goTo = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerHeight = 56;
        window.scrollTo({
          top: element.offsetTop - headerHeight,
          behavior: "smooth",
        });
      }
    };

    const handleResize = () => updateCurrentSection();

    onMounted(() => {
      updateCurrentSection();
      window.addEventListener("resize", handleResize, { passive: true });
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });

    return {
      isVisible,
      progress,
      currentSection,
      prevSection,
      nextSection,
      goTo,
    };
  },
};
</script>

<style scoped>
.section-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 56px;
  z-index: 1000;
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(12px);
  opacity: 0;
  transform: translateY(-20px);
  transition:
    opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

.section-nav-visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.section-nav-progress {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
}

.section-nav-progress-fill {
  height: 100%;
  background: #44b319;
  transition: width 0.15s linear;
}

.section-nav-bar {
  height: calc(100% - 2px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 0 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-nav-label {
  background: none;
  border: none;
  padding: 0;
  color: rgba(255, 255, 255, 0.45);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: color 0.2s ease;
  white-space: nowrap;
}

/* Transição ao trocar de seção (anterior/atual/próxima trocam de texto) */
.nav-fade-enter-active,
.nav-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    color 0.2s ease;
}

.nav-fade-enter-from,
.nav-fade-leave-to {
  opacity: 0;
}

.nav-fade-enter-from {
  transform: translateY(8px);
}

.nav-fade-leave-to {
  transform: translateY(-8px);
}

.section-nav-label:hover {
  color: rgba(255, 255, 255, 0.8);
}

.section-nav-side {
  flex: 1 1 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.section-nav-side:first-child {
  text-align: right;
}

.section-nav-side:last-child {
  text-align: left;
}

.section-nav-empty {
  cursor: default;
}

.section-nav-current {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  flex: 0 0 auto;
}

.section-nav-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #44b319;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .section-nav-bar {
    gap: 12px;
    padding: 0 16px;
  }

  .section-nav-label {
    font-size: 10px;
  }

  .section-nav-current {
    font-size: 11px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-nav {
    transition: none;
  }

  .section-nav-progress-fill {
    transition: none;
  }

  .nav-fade-enter-active,
  .nav-fade-leave-active {
    transition: none;
  }
}
</style>
