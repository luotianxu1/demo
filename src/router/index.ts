import { createRouter, createWebHistory } from "vue-router"
import NProgress from "@/config/nprogress"
import { threejsRouter } from "./modules/threejs"

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
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
})

router.beforeEach(async (to, from, next) => {
	NProgress.start()
	next()
})

router.afterEach(() => {
	NProgress.done()
})

router.onError(() => {
	NProgress.done()
})

export default router
