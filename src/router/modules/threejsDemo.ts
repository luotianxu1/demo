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
			}
		]
	}
]
