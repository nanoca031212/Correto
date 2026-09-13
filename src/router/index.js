import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/admin',
    component: () => import('../admin/AdminLayout.vue'),
    children: [
      { path: '', redirect: { name: 'admin-dashboard' } },
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('../admin/pages/Dashboard.vue')
      },
      {
        path: 'atividades',
        name: 'admin-atividades',
        component: () => import('../admin/pages/Atividades.vue')
      },
      {
        path: 'plantas',
        name: 'admin-plantas',
        component: () => import('../admin/pages/Plantas.vue')
      },
      {
        path: 'mcp',
        name: 'admin-mcp',
        component: () => import('../admin/pages/Mcp.vue')
      },
      {
        path: 'material',
        name: 'admin-material',
        component: () => import('../admin/pages/Material.vue')
      },
      {
        path: 'campanha',
        name: 'admin-campanha',
        component: () => import('../admin/pages/Campanha.vue')
      }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
