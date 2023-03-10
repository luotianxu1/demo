import { createApp } from "vue"
import { createPinia } from "pinia"
import "@assets/scss/main.scss"

import App from "./App.vue"
import router from "./router"
import directives from "./directives/index"

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(directives)

app.mount("#app")
