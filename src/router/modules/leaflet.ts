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
			},
			{
				path: "/leaflet/marker/markerCluster",
				name: "点聚合",
				component: () => import("@/views/leaflet/marker/MarkerCluster.vue")
			},
			{
				path: "/leaflet/marker/twinkle",
				name: "图标闪烁",
				component: () => import("@/views/leaflet/marker/Twinkle.vue")
			},
			{
				path: "/leaflet/visualization/heat",
				name: "热力图",
				component: () => import("@/views/leaflet/visualization/Heat.vue")
			},
			{
				path: "/leaflet/visualization/dynamicHeat",
				name: "动态热力图",
				component: () => import("@/views/leaflet/visualization/DynamicHeat.vue")
			},
			{
				path: "/leaflet/visualization/scatterPlot",
				name: "散点图",
				component: () => import("@/views/leaflet/visualization/ScatterPlot.vue")
			}
		]
	}
]
