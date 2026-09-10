<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Reset e configurações globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: #333;
  overflow-x: hidden;
}

#app {
  position: relative;
  min-height: 100vh;
}

/* Hero Container - Fixo */
.hero-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
}

/* Main Content - Sobrepõe o Hero */
.main-content {
  position: relative;
  z-index: 10;
  margin-top: 100vh;
  background: transparent;
  min-height: 100vh;
}

/* Efeito de sobreposição das seções */
.main-content > section {
  position: relative;
  z-index: 10;
  background: white;
  padding-top: 50px;
}

/* Primeira seção (vista panorâmica) */
.main-content > section:first-child {
  margin-top: 0;
  z-index: 10;
  background: #F8F8F8;
}

.main-content > section:nth-child(2) {
  z-index: 10;
  background: white;
  margin-top: 0;
  padding-top: 50px;
}

/* Seção de localização - sem sobreposição */
.main-content > section:nth-child(3) {
  z-index: 15;
  margin-top: 0;
  padding-top: 50px;
  background: white;
}

/* Seção de financiamento - sem sobreposição */
.main-content > section:nth-child(4) {
  z-index: 16;
  margin-top: 0;
  padding-top: 50px;
  background: white;
}

/* Seção de contato - sem sobreposição */
.main-content > section:nth-child(5) {
  z-index: 17;
  margin-top: 0;
  padding-top: 50px;
  background: white;
}

/* Classes utilitárias existentes */
.hover-lift {
  @apply transition-transform duration-300 hover:-translate-y-2;
}

.contact-method {
  @apply flex items-center gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-300 text-white no-underline;
}

.contact-method-icon {
  @apply w-12 h-12 rounded-full flex items-center justify-center text-white text-xl flex-shrink-0;
}

/* Responsividade */
@media (max-width: 768px) {
  .section-header h2 {
    font-size: 2rem;
  }

  .contact-method {
    flex-direction: column;
    text-align: center;
  }

  /* Ajustes para mobile */
  .main-content {
    margin-top: 100vh;
  }

  .main-content::before {
    top: -50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .main-content::before {
    top: -30px;
    height: 30px;
  }
}

/* Animação suave para o scroll */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
</style>
