import type { RouteRecordRaw } from "vue-router"

export const echartsRouter: RouteRecordRaw[] = [
	{
		path: "/echarts",
		name: "echarts",
		redirect: "/echarts/map/geocoding",
		children: [
			{
				path: "/echarts/map/geocoding",
				name: "行政区-echarts",
				component: () => import("@/views/echarts/map/Geocoding.vue")
			}
		]
	}
]
