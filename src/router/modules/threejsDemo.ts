import type { RouteRecordRaw } from "vue-router"

export const threejsDemoRouter: RouteRecordRaw[] = [
	{
		path: "/threejsDemo",
		name: "threejsDemo",
		redirect: "/threejs/base",
		children: [
			{
				path: "/threejsDemo/website",
				name: "3D官网",
				component: () => import("@/views/threejsDemo/website/index.vue")
			},
			{
				path: "/threejsDemo/houseViewing",
				name: "全景看房",
				component: () => import("@/views/threejsDemo/houseViewing/index.vue")
			},
			{
				path: "/threejsDemo/fireworks",
				name: "烟花",
				component: () => import("@/views/threejsDemo/firework/index.vue")
			}
		]
	}
]
