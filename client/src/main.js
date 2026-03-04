import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('全局错误:', err, info)
  // 可以在这里添加错误上报逻辑
  // 例如: fetch('/api/error-report', { method: 'POST', body: JSON.stringify({ err, info }) })
}

// 监听未捕获的 Promise 错误
window.addEventListener('unhandledrejection', (event) => {
  console.error('未处理的 Promise 拒绝:', event.reason)
})

// 监听全局错误
window.addEventListener('error', (event) => {
  console.error('全局资源加载错误:', event.error)
})

app.use(createPinia())
app.use(router)

app.mount('#app')
