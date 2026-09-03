<template>
  <component :is="tag" ref="rootEl" class="blur-text"><slot /></component>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

export default {
  name: 'BlurText',
  props: {
    tag: { type: String, default: 'span' },
    trigger: { type: String, default: 'scroll' }, // 'scroll' | 'mount'
    delay: { type: Number, default: 90 }, // ms stagger per word
    duration: { type: Number, default: 550 }, // ms
    startDelay: { type: Number, default: 0 }, // ms before the first word starts
    threshold: { type: Number, default: 0.2 },
    distance: { type: Number, default: 16 }, // px, initial translateY
    blur: { type: Number, default: 10 }, // px, initial blur
    once: { type: Boolean, default: true }
  },
  setup(props) {
    const rootEl = ref(null)
    const words = []
    let observer = null
    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const splitNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        const parts = node.textContent.split(/(\s+)/)
        parts.forEach((part) => {
          if (part === '') return
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part))
            return
          }
          const span = document.createElement('span')
          span.textContent = part
          span.style.display = 'inline-block'
          span.style.opacity = '0'
          span.style.filter = `blur(${props.blur}px)`
          span.style.transform = `translateY(${props.distance}px)`
          span.style.transition = `opacity ${props.duration}ms ease, filter ${props.duration}ms ease, transform ${props.duration}ms ease`
          words.push(span)
          frag.appendChild(span)
        })
        node.replaceWith(frag)
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        Array.from(node.childNodes).forEach(splitNode)
      }
    }

    const play = () => {
      words.forEach((span, i) => {
        span.style.transitionDelay = `${props.startDelay + i * props.delay}ms`
        span.style.opacity = '1'
        span.style.filter = 'blur(0px)'
        span.style.transform = 'translateY(0)'
      })
    }

    onMounted(async () => {
      await nextTick()
      const el = rootEl.value
      if (!el) return

      if (reduceMotion) return

      Array.from(el.childNodes).forEach(splitNode)

      if (props.trigger === 'mount') {
        requestAnimationFrame(play)
        return
      }

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            play()
            if (props.once && observer) observer.disconnect()
          }
        })
      }, { threshold: props.threshold })
      observer.observe(el)
    })

    onBeforeUnmount(() => {
      if (observer) observer.disconnect()
    })

    return { rootEl }
  }
}
</script>
