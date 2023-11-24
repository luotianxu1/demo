import type { RouteRecordRaw } from "vue-router"

export const baiduRouter: RouteRecordRaw[] = [
	{
		path: "/baidu",
		name: "baidu",
		redirect: "/baidu/map/index",
		children: [
			{
				path: "/baidu/map/index",
				name: "形状-canvas",
				component: () => import("@/views/baidu/map/index.vue")
			}
		]
	}
]
