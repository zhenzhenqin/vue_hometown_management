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
import ReportView from '@/views/report/index.vue'
import LogView from '@/views/log/index.vue'
import DevLogView from '@/views/devlog/index.vue'
import DocView from '@/views/doc/index.vue'
import MonitorView from '@/views/monitor/index.vue'
import MapView from '@/views/map/index.vue'
import ReportUserView from '@/views/reportUser/index.vue'

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
      name: 'layout',
      component: LayoutView, /* 父级路由 */
      redirect: '/index',  /* 重定向登录界面 */
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
        },
        {
          path: '/report/dashboard',
          name: 'report',
          component: ReportView
        },
        {
          path: '/log',
          path: '/log',
          name: 'log',
          component: LogView
        },
        { 
          path: '/devlog',
          name: 'devlog', 
          component: DevLogView, 
          meta: { title: '系统进化' } },
        { 
          path: '/:pathMatch(.*)*', 
          name: 'NotFound', 
          redirect: '/login' 
        },
        {
          path: '/doc',
          name: 'doc',
          component: DocView,
          meta: { title: '项目文档' }
        },
        {
         path: '/monitor',
         name: 'monitor',
         component: MonitorView,
         meta: { title: '服务监控' }
        },
        {
          path: '/map',
          name: 'map',
          component: MapView,
          meta: { title: '地图' }
        },
        {
          path: '/reportUser',
          name: 'reportUser',
          component: ReportUserView,
          meta: { title: '用户uv,pv报表' }
        }
      ]
    }
  ]
})

/* 路由守卫 */
router.beforeEach((to, from, next) => {
  // 1. 获取 token
  const token = localStorage.getItem('token')
  
  // 2. 定义白名单 (所有不需要登录就能访问的页面路径)
  const whiteList = ['/login', '/register', '/404']

  // 3. 判断逻辑
  if (token) {
    // --- 情况 A: 有 Token ---
    
    if (to.path === '/login') {
      // 有 Token 还去登录页？不给去，踢回首页
      next('/index')
    } else {
      // 去其他页面？放行c
      next()
    }
    
  } else {
    // --- 情况 B: 无 Token ---
    
    if (whiteList.includes(to.path)) {
      // 去的是白名单页面（如登录、注册）？放行
      next()
    } else {
      // 去的是受保护页面？强制踢回登录页
      next('/login')
    }
  }
})

export default router
