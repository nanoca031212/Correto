<template>
  <section id="panoramica" class="panoramic section">
    <div class="container">
      <!-- Cabeçalho minimalista -->
      <div class="section-header">
        <BlurText tag="h2" class="section-title">
          <span class="text-accent">Vista Panorâmica</span> e Implantação
        </BlurText>
        <BlurText tag="p" class="section-subtitle">
          Conheça todos os detalhes do seu novo lar
        </BlurText>
      </div>

      <!-- Vídeo Panorâmico (scrub por scroll) -->
      <div class="panoramic-image-container">
        <div class="panoramic-video-wrapper" ref="scrollWrapper">
          <div class="panoramic-video-sticky" ref="stickyEl">
            <video
              ref="videoEl"
              class="panoramic-video"
              src="/animacao/animacao2.mp4"
              poster="/Imagens/12-Vista-Panoramica-Implantacao_2024_12_24-1024x1024.jpg"
              muted
              playsinline
              preload="auto"
              @seeked="onSeeked"
            ></video>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import BlurText from "../animations/BlurText.vue";

export default {
  name: "PanoramicSection",
  components: {
    BlurText,
  },
  setup() {
    const scrollWrapper = ref(null);
    const stickyEl = ref(null);
    const videoEl = ref(null);
    let ticking = false;
    let frameId = 0;
    let targetTime = 0;
    let seekPending = false;
    let seekWatchdog;

    const seekToTarget = () => {
      const video = videoEl.value;
      // Nao cancela um seek em andamento a cada frame de scroll.
      if (!video || seekPending) return;
      if (Math.abs(video.currentTime - targetTime) > 1 / 30) {
        video.currentTime = targetTime;
        seekPending = true;
        // Alguns navegadores as vezes nunca disparam "seeked" - sem esse
        // watchdog o scrub trava pra sempre, pois seekPending nunca
        // voltaria a false.
        clearTimeout(seekWatchdog);
        seekWatchdog = setTimeout(() => {
          seekPending = false;
          seekToTarget();
        }, 200);
      }
    };

    const onSeeked = () => {
      clearTimeout(seekWatchdog);
      seekPending = false;
      seekToTarget();
    };

    const updateVideoFrame = () => {
      ticking = false;
      const wrapper = scrollWrapper.value;
      const sticky = stickyEl.value;
      const video = videoEl.value;
      if (
        !wrapper ||
        !sticky ||
        !video ||
        !video.duration ||
        !isFinite(video.duration)
      )
        return;

      const rect = wrapper.getBoundingClientRect();
      // A faixa de scroll do "pin" é a altura do wrapper menos a altura real
      // do elemento sticky (não a viewport - o sticky pode ser menor que 100vh)
      const scrollableHeight = wrapper.offsetHeight - sticky.offsetHeight;

      let progress;
      if (window.innerWidth <= 768) {
        // Mobile: começa a avançar o vídeo nos últimos 150px de aproximação
        // ao travamento, pra não ficar parado no frame inicial (quase em
        // branco) por muito tempo - mas só depois do cabeçalho já ter saído
        // de tela, senão sobrepõe o texto. Desktop mantém o comportamento
        // original (só avança quando 100% travado).
        const leadIn = 150;
        const activeRange = leadIn + scrollableHeight;
        progress = activeRange > 0 ? (leadIn - rect.top) / activeRange : 0;
      } else {
        progress = scrollableHeight > 0 ? -rect.top / scrollableHeight : 0;
      }
      progress = Math.min(Math.max(progress, 0), 1);

      targetTime = progress * Math.max(0, video.duration - 0.05);
      seekToTarget();
    };

    let warmedUp = false;
    const warmUpVideo = () => {
      const video = videoEl.value;
      if (!video || warmedUp) return;
      warmedUp = true;
      // "Aquece" o vídeo no mobile: iOS/Safari muitas vezes só carrega os
      // dados do vídeo (mesmo com preload="auto") depois de uma tentativa
      // de play - play+pause imediato é permitido pra vídeo mudo e evita
      // o vídeo ficar em branco até o usuário interagir
      const playPromise = video.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(() => video.pause()).catch(() => {
          warmedUp = false;
        });
      }
    };

    const onScroll = () => {
      // Reforço: se o autoplay no mount tiver sido bloqueado, o primeiro
      // scroll tenta novamente ativar o vídeo.
      warmUpVideo();
      if (!ticking) {
        ticking = true;
        frameId = window.requestAnimationFrame(updateVideoFrame);
      }
    };

    // Toque/clique conta como gesto real do usuário pras políticas de
    // autoplay dos navegadores (diferente de scroll) - escuta na página
    // inteira (a partir do Hero) pra aquecer o vídeo o quanto antes,
    // mesmo antes da seção panorâmica entrar em tela.
    const onFirstInteraction = () => warmUpVideo();

    onMounted(() => {
      const video = videoEl.value;
      if (video) {
        let ready = false;
        const onReady = () => {
          if (ready) return;
          ready = true;
          video.pause();
          updateVideoFrame();
        };

        // Se os metadados já estiverem disponíveis (cache), dispara na hora;
        // senão espera o primeiro evento que indique que já dá pra seekar.
        // Alguns navegadores mobile não disparam "loadedmetadata" de forma
        // confiável, então também escuta "canplay" como reforço.
        if (video.readyState >= 1) {
          onReady();
        } else {
          video.addEventListener("loadedmetadata", onReady, { once: true });
          video.addEventListener("canplay", onReady, { once: true });
        }

        warmUpVideo();
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      document.addEventListener("touchstart", onFirstInteraction, {
        once: true,
        passive: true,
      });
      document.addEventListener("pointerdown", onFirstInteraction, {
        once: true,
      });
    });

    onUnmounted(() => {
      clearTimeout(seekWatchdog);
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("touchstart", onFirstInteraction);
      document.removeEventListener("pointerdown", onFirstInteraction);
    });

    return {
      scrollWrapper,
      stickyEl,
      videoEl,
      onSeeked,
    };
  },
};
</script>

<style scoped>
.panoramic {
  padding: 50px 0 0;
  background: #f8f8f8;
  position: relative;
  z-index: 10;
  /* .section (global) sets overflow:hidden + transform:translateZ(0), which
     breaks position:sticky's containing block for the video scrub below */
  overflow: visible;
  transform: none;
}

/* Cabeçalho minimalista */
.section-header {
  text-align: center;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 300;
  color: #1a1a1a;
  margin-bottom: 16px;
  letter-spacing: -1px;
  font-family:
    "Source Sans 3",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
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

/* Container da Imagem/Vídeo Panorâmico */
.panoramic-image-container {
  position: relative;
  margin-bottom: 0;
}

/* Área de scroll que controla o "scrub" do vídeo */
.panoramic-video-wrapper {
  position: relative;
  height: 160vh;
}

/* Vídeo fica travado (pinned) no topo enquanto a área acima é scrollada */
.panoramic-video-sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  border-radius: 16px;
  overflow: hidden;
}

.panoramic-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Responsividade */
@media (max-width: 768px) {
  .panoramic {
    padding: 30px 0 0;
  }

  .panoramic-video-wrapper {
    height: 175vh;
    height: 175svh;
  }

  .panoramic-video-sticky {
    height: 100svh;
  }
}

@media (max-width: 480px) {
  .panoramic-image-container {
    margin: 0 -16px;
  }

  .panoramic-video-sticky {
    border-radius: 0;
  }
}
</style>
