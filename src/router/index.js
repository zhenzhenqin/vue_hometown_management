import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/index/index.vue'
import AdminView from '@/views/admin/index.vue'
import CultureView from '@/views/culture/index.vue'
import SpecialtiesView from '@/views/specialties/index.vue'
import LayoutView from '@/views/layout/index.vue'
import AttractiontView from '@/views/attraction/index.vue'
import loginView from '@/views/login/index.vue'
import AdminListView from '@/views/adminList/index.vue'
import SchoolView from '@/views/school/index.vue' 
import UserView from '@/views/user/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: loginView
    },
    {
      path: '/',
      name: '',
      component: LayoutView, /* 父级路由 */
      redirect: '/login',  /* 重定向登录界面 */
      children: [
        {
          path: '/index',
          name: 'index',
          component: HomeView
        },
        {
          path: '/school',
          name: 'school',
          component: SchoolView
        },
        {
          path: '/admin',
          name: 'admin',
          component: AdminView
        },
        {
          path: '/user',
          name: 'user',
          component: UserView
        },
        {
          path: '/adminList', 
          name: 'adminList',
          component: AdminListView
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

/* 路由守卫 */
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 1. 如果去的是登录页，且已经有token，直接跳首页
  if (to.path === '/login' && token) {
    next('/index')
  } 
  // 2. 如果去的不是登录页，且没有token，强制跳登录页
  // (注意：要排除一些白名单页面，如果你有的话)
  else if (to.path !== '/login' && !token) {
    next('/login')
  } 
  // 3. 其他情况放行
  else {
    next()
  }
})

export default router
