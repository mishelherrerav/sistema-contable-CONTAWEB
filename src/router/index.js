import { createRouter, createWebHistory } from 'vue-router'
import PlanCuentasView from '../views/PlanCuentasView.vue' // <--- Importamos el Plan de Cuentas
import LibroDiarioView from '../views/LibroDiarioView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: PlanCuentasView // <--- Ahora es la ventana principal por defecto
    },
    {
      path: '/plan-cuentas',
      name: 'plan-cuentas',
      component: PlanCuentasView
    },
    {
      path: '/libro-diario',
      name: 'libro-diario',
      component: LibroDiarioView
    },
    {
      path: '/ventas',
      name: 'ventas',
      component: () => import('../views/VentasView.vue')
    },
    {
      path: '/compras',
      name: 'compras',
      component: () => import('../views/ComprasView.vue')
    },
    {
      path: '/libro-mayor',
      name: 'libro-mayor',
      component: () => import('../views/LibroMayorView.vue')
    },
    {
      path: '/hoja-trabajo',
      name: 'hoja-trabajo',
      component: () => import('../views/HojaTrabajoView.vue')
    },
   // {
    //  path: '/estudiante',
   //   name: 'estudiante',
   //   component: () => import('../views/ModuloEstudianteView.vue')
   // }
  ]
})

export default router