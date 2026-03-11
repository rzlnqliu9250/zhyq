//createRouter:创建路由实例对象
//createWebhHistory:创建history模式的路由
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BigScreen from '@/views/BigScreen/big-index.vue'

const router = createRouter({
  //指定当前的路由模式为history模式的路由
  history: createWebHistory(),
//定义路由对象
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      redirect:'/big-screen'
    },
    //将来微前端接入的时候需要匹配一个和主应用中所有路由不一样的路由路径
    {
      path: '/big-screen',
      name: 'bigScreen',
      component: BigScreen,
    },
  ],
})

export default router
