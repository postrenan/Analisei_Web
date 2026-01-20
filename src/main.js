import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.scss'
import 'bootstrap' // Import bootstrap JS

const app = createApp(App)

app.use(createPinia())
app.mount('#app')
