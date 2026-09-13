<template>
  <div class="sg" ref="rootEl">
    <div class="sg-top" v-if="calculatePercentageDifference || $slots.title">
      <slot name="title" />
      <span
        v-if="calculatePercentageDifference && diffPercent !== null"
        class="sg-diff"
        :class="diffPercent >= 0 ? 'up' : 'down'"
      >
        <svg v-if="diffPercent >= 0" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 15l6-6 6 6"/></svg>
        <svg v-else viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 9l6 6 6-6"/></svg>
        {{ Math.abs(diffPercent).toFixed(0) }}%
      </span>
    </div>

    <div class="sg-chart-area" :style="{ height: height + 'px' }">
    <svg
      class="sg-svg"
      :viewBox="`0 0 ${vbWidth} ${vbHeight}`"
      preserveAspectRatio="none"
      :style="{ height: height + 'px' }"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" :stop-color="lineColor" stop-opacity="0.22" />
          <stop offset="100%" :stop-color="lineColor" stop-opacity="0" />
        </linearGradient>
      </defs>

      <g v-if="showGrid" class="sg-grid">
        <line
          v-for="(y, i) in gridYs"
          :key="'gy' + i"
          x1="0"
          :y1="y"
          :x2="vbWidth"
          :y2="y"
          :stroke-dasharray="gridStyle === 'dashed' ? '5 6' : gridStyle === 'dotted' ? '1.5 5' : 'none'"
        />
      </g>

      <path
        v-if="gradientFade"
        class="sg-area"
        :d="areaPath"
        :fill="`url(#${gradientId})`"
        :style="{ opacity: played ? 1 : 0 }"
      />

      <path
        ref="lineEl"
        class="sg-line"
        :d="linePath"
        fill="none"
        :stroke="lineColor"
        :stroke-width="graphLineThickness"
        stroke-linecap="round"
        stroke-linejoin="round"
        :style="lineStyle"
      />

      <g v-if="showDots">
        <g
          v-for="(p, i) in points"
          :key="'dot' + i"
          class="sg-dot-group"
          @mouseenter="hoveredIndex = i"
          @mouseleave="hoveredIndex = null"
        >
          <circle
            class="sg-dot-halo"
            :cx="p.x"
            :cy="p.y"
            :r="dotSize + 5"
            :fill="dotColor || lineColor"
            :style="{ opacity: played ? 0.22 : 0, transitionDelay: played ? (i * 35) + 'ms' : '0ms' }"
          />
          <circle
            class="sg-dot"
            :class="{ glow: dotHoverGlow }"
            :cx="p.x"
            :cy="p.y"
            :r="dotSize"
            :fill="dotColor || lineColor"
            :stroke="ringColor"
            :stroke-width="2"
            :style="{ opacity: played ? 1 : 0, transitionDelay: played ? (i * 35) + 'ms' : '0ms' }"
          />
          <!-- area de hover maior e invisivel, so pra facilitar acertar o dot -->
          <circle class="sg-dot-hit" :cx="p.x" :cy="p.y" :r="Math.max(dotSize + 10, 16)" fill="transparent" />
        </g>
      </g>
    </svg>

    <div
      v-if="hoveredPoint"
      class="sg-tooltip"
      :style="{
        left: (hoveredPoint.x / vbWidth) * 100 + '%',
        top: (hoveredPoint.y / vbHeight) * 100 + '%'
      }"
    >
      <strong>{{ hoveredPoint.label }}</strong>
      <span>{{ tooltipText(hoveredPoint) }}</span>
    </div>
    </div>

    <div class="sg-labels" v-if="showLabels">
      <span v-for="(p, i) in points" :key="'lbl' + i">{{ p.label }}</span>
    </div>
  </div>
</template>

<script>
let uid = 0

export default {
  name: 'SimpleGraph',
  props: {
    data: { type: Array, required: true }, // [{ label, value }]
    height: { type: Number, default: 220 },
    lineColor: { type: String, default: '#6fd93f' },
    dotColor: { type: String, default: '' },
    ringColor: { type: String, default: 'rgba(255,255,255,0.85)' },
    graphLineThickness: { type: Number, default: 2.5 },
    dotSize: { type: Number, default: 6 },
    curved: { type: Boolean, default: true },
    gradientFade: { type: Boolean, default: false },
    showDots: { type: Boolean, default: true },
    showGrid: { type: Boolean, default: true },
    showLabels: { type: Boolean, default: true },
    gridStyle: { type: String, default: 'dashed' }, // solid | dashed | dotted
    gridLines: { type: Number, default: 4 },
    animationDuration: { type: Number, default: 900 },
    animateOnScroll: { type: Boolean, default: true },
    animateOnce: { type: Boolean, default: true },
    dotHoverGlow: { type: Boolean, default: true },
    calculatePercentageDifference: { type: Boolean, default: true },
    // Unidade mostrada no tooltip ao passar o mouse num ponto, ex.: "visualizações"
    unit: { type: String, default: '' },
    // Formatador customizado do texto do tooltip: (point) => string
    tooltipFormatter: { type: Function, default: null }
  },
  data() {
    uid += 1
    return {
      gradientId: `sg-grad-${uid}`,
      played: !this.animateOnScroll,
      lineLength: 0,
      observer: null,
      hoveredIndex: null
    }
  },
  computed: {
    vbWidth() {
      return 600
    },
    vbHeight() {
      return 220
    },
    values() {
      return this.data.map((d) => Number(d.value) || 0)
    },
    minValue() {
      return Math.min(...this.values, 0)
    },
    maxValue() {
      const max = Math.max(...this.values)
      return max === this.minValue ? max + 1 : max
    },
    points() {
      const n = this.data.length
      const padX = 14
      const padY = 22
      const usableW = this.vbWidth - padX * 2
      const usableH = this.vbHeight - padY * 2
      return this.data.map((d, i) => {
        const x = n === 1 ? this.vbWidth / 2 : padX + (usableW * i) / (n - 1)
        const ratio = (Number(d.value) - this.minValue) / (this.maxValue - this.minValue)
        const y = padY + usableH * (1 - ratio)
        return { x, y, label: d.label, value: d.value }
      })
    },
    linePath() {
      if (!this.points.length) return ''
      if (!this.curved || this.points.length < 3) {
        return this.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
      }
      return this.buildSmoothPath(this.points)
    },
    areaPath() {
      if (!this.points.length) return ''
      const first = this.points[0]
      const last = this.points[this.points.length - 1]
      return `${this.linePath} L ${last.x} ${this.vbHeight} L ${first.x} ${this.vbHeight} Z`
    },
    gridYs() {
      const arr = []
      for (let i = 0; i <= this.gridLines; i++) {
        arr.push((this.vbHeight / this.gridLines) * i)
      }
      return arr
    },
    diffPercent() {
      if (this.values.length < 2) return null
      const first = this.values[0]
      const last = this.values[this.values.length - 1]
      if (!first) return null
      return ((last - first) / Math.abs(first)) * 100
    },
    lineStyle() {
      if (!this.animateOnScroll) return {}
      return {
        strokeDasharray: this.lineLength,
        strokeDashoffset: this.played ? 0 : this.lineLength,
        transition: `stroke-dashoffset ${this.animationDuration}ms ease`
      }
    },
    hoveredPoint() {
      return this.hoveredIndex === null ? null : this.points[this.hoveredIndex]
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.lineEl) {
        this.lineLength = this.$refs.lineEl.getTotalLength()
      }
      if (this.animateOnScroll && 'IntersectionObserver' in window) {
        this.observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              this.played = true
              if (this.animateOnce) this.observer.disconnect()
            } else if (!this.animateOnce) {
              this.played = false
            }
          },
          { threshold: 0.3 }
        )
        this.observer.observe(this.$refs.rootEl)
      } else {
        this.played = true
      }
    })
  },
  beforeUnmount() {
    this.observer?.disconnect()
  },
  methods: {
    buildSmoothPath(points) {
      let d = `M ${points[0].x} ${points[0].y}`
      for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i - 1] || points[i]
        const p1 = points[i]
        const p2 = points[i + 1]
        const p3 = points[i + 2] || p2
        const cp1x = p1.x + (p2.x - p0.x) / 6
        const cp1y = p1.y + (p2.y - p0.y) / 6
        const cp2x = p2.x - (p3.x - p1.x) / 6
        const cp2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
      }
      return d
    },
    tooltipText(point) {
      if (this.tooltipFormatter) return this.tooltipFormatter(point)
      const value = typeof point.value === 'number' ? point.value.toLocaleString('pt-BR') : point.value
      return this.unit ? `${value} ${this.unit}` : `${value}`
    }
  }
}
</script>

<style scoped>
.sg {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 22px 22px 18px;
}

.sg-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.sg-diff {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  font-weight: 600;
  padding: 3px 9px;
  border-radius: 999px;
}

.sg-diff.up {
  color: #6fd93f;
  background: rgba(111, 217, 63, 0.14);
}

.sg-diff.down {
  color: #f87171;
  background: rgba(248, 113, 113, 0.14);
}

.sg-chart-area {
  position: relative;
}

.sg-svg {
  width: 100%;
  display: block;
  overflow: visible;
}

.sg-grid line {
  stroke: rgba(60, 60, 60, 0.45);
  stroke-width: 1;
}

.sg-area {
  transition: opacity 0.6s ease;
}

.sg-dot-halo {
  transition: opacity 0.4s ease;
  filter: blur(2px);
}

.sg-dot {
  transition: opacity 0.35s ease, r 0.15s ease;
}

.sg-dot-group {
  cursor: pointer;
}

.sg-dot.glow:hover {
  r: 8;
  filter: drop-shadow(0 0 6px currentColor);
}

.sg-tooltip {
  position: absolute;
  transform: translate(-50%, calc(-100% - 14px));
  background: #1c1c1f;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  z-index: 2;
}

.sg-tooltip strong {
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.sg-tooltip span {
  font-size: 13px;
  color: #fff;
  font-weight: 600;
}

.sg-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  gap: 6px;
}

.sg-labels span {
  font-size: 11px;
  color: rgba(60, 60, 60, 0.65);
  flex: 1;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sg-labels span:first-child {
  text-align: left;
}

.sg-labels span:last-child {
  text-align: right;
}
</style>
