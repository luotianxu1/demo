import type { RouteRecordRaw } from "vue-router"

export const leafletRouter: RouteRecordRaw[] = [
	{
		path: "/leaflet",
		name: "leaflet",
		redirect: "/leaflet/layer/gaode",
		children: [
			{
				path: "/leaflet/layer/gaode",
				name: "高德地图",
				component: () => import("@/views/leaflet/layer/GaoDe.vue")
			},
			{
				path: "/leaflet/layer/tianditu",
				name: "天地图",
				component: () => import("@/views/leaflet/layer/TianDiTu.vue")
			},
			{
				path: "/leaflet/layer/baidu",
				name: "百度地图",
				component: () => import("@/views/leaflet/layer/Baidu.vue")
			},
			{
				path: "/leaflet/layer/tencent",
				name: "腾讯地图",
				component: () => import("@/views/leaflet/layer/Tencent.vue")
			}
		]
	}
]
