<template>
  <div class="globe-wrap">
    <div class="globe-canvas" ref="canvasHost"></div>

    <div class="globe-legend">
      <div class="globe-legend-title">De onde vêm os clientes</div>
      <div class="globe-legend-row" v-for="city in cities" :key="city.name">
        <span class="globe-legend-dot" :style="{ background: city.color }"></span>
        <span class="globe-legend-name">{{ city.name }}</span>
        <div class="globe-legend-track">
          <div class="globe-legend-fill" :style="{ width: city.percent + '%' }"></div>
        </div>
        <span class="globe-legend-value">{{ city.percent }}%</span>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { feature } from 'topojson-client'
import landTopology from 'world-atlas/land-110m.json'

// Contagem - MG (localizacao do empreendimento)
const DESTINATION = { lat: -19.9317, lng: -44.0536 }

const CITIES = [
  { name: 'São Paulo, SP', lat: -23.5505, lng: -46.6333, percent: 34, color: '#2d9c14' },
  { name: 'Belo Horizonte, MG', lat: -19.9167, lng: -43.9345, percent: 24, color: '#6fd93f' },
  { name: 'Rio de Janeiro, RJ', lat: -22.9068, lng: -43.1729, percent: 18, color: '#0ea5e9' },
  { name: 'Brasília, DF', lat: -15.7939, lng: -47.8828, percent: 14, color: '#f59e0b' },
  { name: 'Curitiba, PR', lat: -25.4284, lng: -49.2733, percent: 10, color: '#a855f7' }
]

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function dotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.55)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  return new THREE.CanvasTexture(canvas)
}

// Poligonos reais dos continentes (world-atlas, resolucao 110m) para
// desenhar os pontos so em terra firme, no formato certo dos continentes.
const landFeature = feature(landTopology, landTopology.objects.land)
const landPolygons = (
  landFeature.type === 'FeatureCollection' ? landFeature.features : [landFeature]
).flatMap((f) => {
  const geom = f.geometry
  if (!geom) return []
  if (geom.type === 'Polygon') return [geom.coordinates]
  if (geom.type === 'MultiPolygon') return geom.coordinates
  return []
})

function pointInPolygon(lng, lat, rings) {
  let inside = false
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i]
      const [xj, yj] = ring[j]
      const intersect = yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
      if (intersect) inside = !inside
    }
  }
  return inside
}

function isOnLand(lat, lng) {
  for (const polygon of landPolygons) {
    if (pointInPolygon(lng, lat, polygon)) return true
  }
  return false
}

// Distribuicao Fibonacci (area igual) sobre lat/lng, filtrando so os
// pontos que caem em terra - assim os dots desenham os continentes de
// verdade em vez de uma esfera uniforme.
function landDotPositions(samples, radius) {
  const pts = []
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < samples; i++) {
    const y = 1 - (i / (samples - 1)) * 2
    const lat = (Math.asin(y) * 180) / Math.PI
    let lngDeg = ((i * goldenAngle * 180) / Math.PI) % 360
    if (lngDeg > 180) lngDeg -= 360
    if (lngDeg < -180) lngDeg += 360
    if (isOnLand(lat, lngDeg)) {
      pts.push(latLngToVector3(lat, lngDeg, radius))
    }
  }
  return pts
}

export default {
  name: 'OriginsGlobe',
  data() {
    return {
      cities: CITIES
    }
  },
  mounted() {
    this.initScene()
  },
  beforeUnmount() {
    this.teardown()
  },
  methods: {
    initScene() {
      const host = this.$refs.canvasHost
      const width = host.clientWidth
      const height = host.clientHeight

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)

      const radius = 1
      const destVec = latLngToVector3(DESTINATION.lat, DESTINATION.lng, radius)
      // Camera comeca olhando para a regiao do Brasil, em vez de um ponto
      // arbitrario do globo que poderia cair no lado escondido da esfera.
      const camDir = destVec.clone().normalize()
      camera.position.copy(camDir.multiplyScalar(4.2))

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(width, height)
      host.appendChild(renderer.domElement)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.08
      controls.enablePan = false
      controls.enableZoom = true
      controls.minDistance = 1.8
      controls.maxDistance = 6
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.6

      const globeGroup = new THREE.Group()
      scene.add(globeGroup)

      // Luz: sem isso uma esfera com material solido fica parecendo um
      // circulo achatado, sem volume.
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.6)
      keyLight.position.copy(camera.position).multiplyScalar(1.5)
      scene.add(keyLight)
      scene.add(new THREE.AmbientLight(0x2d4a20, 1.1))

      // Esfera-base (da volume/sombreado ao globo)
      const coreGeo = new THREE.SphereGeometry(radius * 0.99, 64, 64)
      const coreMat = new THREE.MeshStandardMaterial({
        color: 0x11331a,
        roughness: 0.85,
        metalness: 0.1,
        emissive: 0x06130a,
        emissiveIntensity: 0.6
      })
      globeGroup.add(new THREE.Mesh(coreGeo, coreMat))

      // Pontos distribuidos uniformemente (visual "globo digital")
      const dotPositions = landDotPositions(9000, radius * 1.002)
      const dotGeo = new THREE.BufferGeometry().setFromPoints(dotPositions)
      const dotMat = new THREE.PointsMaterial({
        size: 0.028,
        map: dotTexture(),
        color: 0x9be97a,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
      })
      globeGroup.add(new THREE.Points(dotGeo, dotMat))

      // Atmosfera (glow)
      const atmoGeo = new THREE.SphereGeometry(radius * 1.18, 48, 48)
      const atmoMat = new THREE.ShaderMaterial({
        uniforms: { glowColor: { value: new THREE.Color(0x6fd93f) } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 glowColor;
          void main() {
            float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
            gl_FragColor = vec4(glowColor, intensity);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false
      })
      globeGroup.add(new THREE.Mesh(atmoGeo, atmoMat))

      // Destino (Contagem - MG)
      globeGroup.add(this.makeMarker(destVec, 0xffffff, 0.028))

      // Marcadores de origem (so pontos, sem arcos/linhas)
      CITIES.forEach((city) => {
        const originVec = latLngToVector3(city.lat, city.lng, radius)
        globeGroup.add(this.makeMarker(originVec, city.color, 0.02))
      })

      this.three = { scene, camera, renderer, controls, globeGroup }

      this.resizeObserver = new ResizeObserver(() => this.onResize())
      this.resizeObserver.observe(host)

      const animate = () => {
        this.frameId = requestAnimationFrame(animate)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()
    },
    makeMarker(position, color, size) {
      const geo = new THREE.SphereGeometry(size, 16, 16)
      const mat = new THREE.MeshBasicMaterial({ color })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.copy(position)
      return mesh
    },
    onResize() {
      const host = this.$refs.canvasHost
      if (!host || !this.three) return
      const { camera, renderer } = this.three
      const width = host.clientWidth
      const height = host.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    },
    teardown() {
      cancelAnimationFrame(this.frameId)
      this.resizeObserver?.disconnect()
      if (!this.three) return
      const { renderer, scene } = this.three
      scene.traverse((obj) => {
        obj.geometry?.dispose?.()
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
          materials.forEach((m) => {
            m.map?.dispose?.()
            m.dispose?.()
          })
        }
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }
}
</script>

<style scoped>
.globe-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(220px, 1fr);
  gap: 24px;
  align-items: center;
}

.globe-canvas {
  width: 100%;
  aspect-ratio: 1 / 1;
  max-height: 360px;
  cursor: grab;
}

.globe-canvas:active {
  cursor: grabbing;
}

.globe-legend-title {
  font-size: 12px;
  font-weight: 600;
  color: #8a8a92;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 14px;
}

.globe-legend-row {
  display: grid;
  grid-template-columns: 8px auto 1fr 32px;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.globe-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.globe-legend-name {
  font-size: 12.5px;
  color: #3f3f46;
  font-weight: 500;
  white-space: nowrap;
}

.globe-legend-track {
  height: 5px;
  border-radius: 999px;
  background: #f0f1f0;
  overflow: hidden;
}

.globe-legend-fill {
  height: 100%;
  border-radius: 999px;
  background: #18181b;
}

.globe-legend-value {
  font-size: 12px;
  font-weight: 600;
  color: #71717a;
  text-align: right;
}

@media (max-width: 720px) {
  .globe-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
