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
              @loadeddata="onFrameReady"
              @playing="onPlaying"
              @seeked="onSeeked"
              @error="onVideoError"
            ></video>
            <button v-if="needsInteraction" class="video-start" @click="startVideo">
              Ativar animação
            </button>
            <p v-if="videoFailed" class="video-message" role="status">
              Animação indisponível. Veja a imagem do empreendimento.
            </p>
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
    const needsInteraction = ref(false);
    const videoFailed = ref(false);
    let ticking = false;
    let frameId = 0;
    let disposed = false;
    let starting = false;
    let targetTime = 0;
    let observer;
    let retryTimer;
    let seekPending = false;
    let seekWatchdog;

    const clearSeekWatchdog = () => {
      clearTimeout(seekWatchdog);
      seekPending = false;
    };

    const seekToTarget = () => {
      const video = videoEl.value;
      // Do not cancel an in-flight decode with another seek on every touchmove.
      // Note: don't gate on video.readyState here - alguns navegadores deixam
      // o readyState travado em HAVE_METADATA depois de um seek que nunca
      // dispara "seeked" (visto no Chrome desktop com este video), e so uma
      // nova atribuicao de currentTime (mesmo com readyState baixo) destrava
      // a decodificacao.
      if (!video || seekPending || starting) return;
      if (Math.abs(video.currentTime - targetTime) > 1 / 30) {
        video.currentTime = targetTime;
        seekPending = true;
        // Alguns navegadores as vezes nunca disparam "seeked" - sem esse
        // watchdog o scrub trava pra sempre, pois seekPending nunca voltaria
        // a false.
        clearTimeout(seekWatchdog);
        seekWatchdog = setTimeout(() => {
          seekPending = false;
          seekToTarget();
        }, 200);
      }
    };

    const onSeeked = () => {
      clearSeekWatchdog();
      seekToTarget();
    };
    const onFrameReady = () => {
      clearTimeout(retryTimer);
      if (!starting) needsInteraction.value = false;
      updateVideoFrame();
    };
    const onPlaying = () => {
      starting = false;
      videoEl.value?.pause();
      needsInteraction.value = false;
      onFrameReady();
    };
    const onVideoError = () => {
      clearTimeout(retryTimer);
      starting = false;
      videoFailed.value = true;
      needsInteraction.value = false;
    };
    const startVideo = () => {
      const video = videoEl.value;
      if (!video || starting || videoFailed.value) return;
      starting = true;
      video.muted = true;
      video.playsInline = true;
      // Keep the poster visible and provide a real user-gesture retry if
      // autoplay/preload is restricted (e.g. mobile power-saving modes).
      retryTimer = setTimeout(() => {
        if (!disposed && !videoFailed.value) {
          starting = false;
          needsInteraction.value = true;
        }
      }, 5000);
      video.play().catch(() => {
        if (disposed) return;
        clearTimeout(retryTimer);
        starting = false;
        if (!videoFailed.value) needsInteraction.value = true;
      });
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

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        frameId = window.requestAnimationFrame(updateVideoFrame);
      }
    };

    onMounted(() => {
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            startVideo();
            observer.disconnect();
          }
        });
        observer.observe(stickyEl.value);
      } else {
        startVideo();
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    });

    onUnmounted(() => {
      disposed = true;
      observer?.disconnect();
      clearTimeout(retryTimer);
      clearTimeout(seekWatchdog);
      window.cancelAnimationFrame(frameId);
      videoEl.value?.pause();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });

    return {
      scrollWrapper,
      stickyEl,
      videoEl,
      needsInteraction,
      videoFailed,
      startVideo,
      onFrameReady,
      onPlaying,
      onSeeked,
      onVideoError,
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

.video-start, .video-message {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 90%;
  padding: 14px 20px;
  border: 0;
  border-radius: 8px;
  background: #fff;
  color: #1a1a1a;
  text-align: center;
}

.video-start { cursor: pointer; font: inherit; }
.video-start:focus-visible { outline: 3px solid #245838; outline-offset: 4px; }

/* Responsividade */
@media (max-width: 768px) {
  .panoramic {
    padding: 30px 0 0;
  }

  .panoramic-video-wrapper {
    height: 175vh;
    height: 175svh;
  }

  .panoramic-video-sticky { height: 100svh; }
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
