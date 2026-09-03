<template>
  <component :is="tag" ref="rootEl" class="split-text"><slot /></component>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

export default {
  name: 'SplitText',
  props: {
    tag: { type: String, default: 'span' },
    trigger: { type: String, default: 'scroll' }, // 'scroll' | 'mount'
    delay: { type: Number, default: 28 }, // ms stagger per character
    duration: { type: Number, default: 600 }, // ms
    startDelay: { type: Number, default: 0 }, // ms before the first character starts
    threshold: { type: Number, default: 0.2 },
    distance: { type: Number, default: 32 }, // px, initial translateY
    once: { type: Boolean, default: true }
  },
  setup(props) {
    const rootEl = ref(null)
    const chars = []
    let observer = null
    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const splitNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment()
        // Split on whitespace first so each word's characters share a
        // non-breaking wrapper - keeps line wraps at spaces, not mid-word.
        const parts = node.textContent.split(/(\s+)/)
        parts.forEach((part) => {
          if (part === '') return
          if (/^\s+$/.test(part)) {
            frag.appendChild(document.createTextNode(part))
            return
          }
          const wordSpan = document.createElement('span')
          wordSpan.style.display = 'inline-block'
          for (const ch of part) {
            const charSpan = document.createElement('span')
            charSpan.textContent = ch
            charSpan.style.display = 'inline-block'
            charSpan.style.opacity = '0'
            charSpan.style.transform = `translateY(${props.distance}px)`
            charSpan.style.transition = `opacity ${props.duration}ms cubic-bezier(0.22,1,0.36,1), transform ${props.duration}ms cubic-bezier(0.22,1,0.36,1)`
            chars.push(charSpan)
            wordSpan.appendChild(charSpan)
          }
          frag.appendChild(wordSpan)
        })
        node.replaceWith(frag)
      } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
        Array.from(node.childNodes).forEach(splitNode)
      }
    }

    const play = () => {
      chars.forEach((span, i) => {
        span.style.transitionDelay = `${props.startDelay + i * props.delay}ms`
        span.style.opacity = '1'
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
