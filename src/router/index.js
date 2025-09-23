import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/index/index.vue'
import UserView from '@/views/user/index.vue'
import CultureView from '@/views/culture/index.vue'
import SpecialtiesView from '@/views/specialties/index.vue'
import LayoutView from '@/views/layout/index.vue'
import AttractiontView from '@/views/attraction/index.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: LayoutView,
      redirect: '/index',  /* 重定向首页 */
      children: [
        {
          path: '/index',
          name: 'index',
          component: HomeView
        },
        {
          path: '/user',
          name: 'user',
          component: UserView
        },
        {
          path: '/culture',
          name: 'culture',
          component: CultureView
        },
        {
          path: '/specialties',
          name: 'specialties',
          component: SpecialtiesView
        },
        {
          path: '/attraction',
          name: 'attraction',
          component: AttractiontView
        }
      ]
    }
  ]
})

export default router
