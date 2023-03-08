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
				path: "/threejs/move",
				name: "物体移动",
				component: () => import("@/views/threejs/base/Move.vue")
			},
			{
				path: "/threejs/clock",
				name: "跟踪时间",
				component: () => import("@/views/threejs/base/Clock.vue")
			},
			{
				path: "/threejs/gsap",
				name: "Gsap",
				component: () => import("@/views/threejs/base/Gsap.vue")
			},
			{
				path: "/threejs/resize",
				name: "监听页面尺寸变化",
				component: () => import("@/views/threejs/base/Resize.vue")
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
