import type { RouteRecordRaw } from "vue-router"

export const threejsRouter: RouteRecordRaw[] = [
	{
		path: "/threejs",
		name: "threejs",
		redirect: "/threejs/base",
		children: [
			{
				path: "/threejs/base",
				name: "基本场景",
				component: () => import("@/views/threejs/base/Base.vue")
			},
			{
				path: "/threejs/orbitControls",
				name: "轨道控制器",
				component: () => import("@/views/threejs/controls/OrbitControls.vue")
			},
			{
				path: "/threejs/axesHelper",
				name: "坐标辅助器",
				component: () => import("@/views/threejs/helper/AxesHelper.vue")
			}
		]
	}
]
