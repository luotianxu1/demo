import { createRouter, createWebHashHistory } from "vue-router"
import NProgress from "@/config/nprogress"
import { threejsRouter } from "./modules/threejs"
import { threejsDemoRouter } from "./modules/threejsDemo"
import { canvasRouter } from "./modules/canvas"
import { leafletRouter } from "./modules/leaflet"
import { openlayersRouter } from "./modules/openlayers"
import { gaoDeRouter } from "./modules/geoDe"

NProgress.configure({ showSpinner: false })

const routes = [
	{
		path: "/",
		redirect: "/home"
	},
	{
		path: "/home",
		component: () => import("@/views/home/index.vue")
	},
	...threejsRouter,
	...threejsDemoRouter,
	...canvasRouter,
	...leafletRouter,
	...openlayersRouter,
	...gaoDeRouter,
	{
		path: "/404",
		name: "404",
		component: () => import("@/views/error/404.vue")
	},
	{
		path: "/:pathMatch(.*)*",
		name: "notFound",
		redirect: { name: "404" }
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes: routes,
	scrollBehavior: () => {
		// 始终滚动到顶部
		return { top: 0, left: 0 }
	}
})

router.beforeEach(async (to, from, next) => {
	NProgress.start()
	document.title = to.name ? String(to.name) : "demo"
	next()
})

router.afterEach(() => {
	NProgress.done()
})

router.onError(() => {
	NProgress.done()
})

export default router
