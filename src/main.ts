import { createApp } from "vue"
import { createPinia } from "pinia"
import "@assets/scss/index.scss"
import "ol/ol.css"

import App from "./App.vue"
import router from "./router"
import directives from "./directives/index"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(directives)

app.mount("#app")
