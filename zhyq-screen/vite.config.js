import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import qiankun from 'vite-plugin-qiankun'
// https://vite.dev/config/
export default defineConfig({
  //子应用线上服务器的绝对地址 目的是为了能够正确的加载子应用自己的静态资源(js css img...)
  base: 'http://localhost:8089/',
  plugins: [
    vue(),
    vueDevTools(),
    // 这里的名称要和主应用改造是配置项中的name保持一致
    qiankun('big-screen', {
      useDevMode: true
    })
  ],
    server: {
    // 防止开发阶段的assets 静态资源加载问题
    origin: '//localhost:5173'
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
