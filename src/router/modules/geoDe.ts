import type { RouteRecordRaw } from "vue-router"

export const gaoDeRouter: RouteRecordRaw[] = [
	{
		path: "/gaoDe",
		name: "高德地图",
		redirect: "/gaoDe/base/map",
		children: [
			{
				path: "/gaoDe/base/map",
				name: "地图",
				component: () => import("@/views/gaoDe/base/Map.vue")
			},
			{
				path: "/gaoDe/base/control",
				name: "地图控件",
				component: () => import("@/views/gaoDe/base/Control.vue")
			},
			{
				path: "/gaoDe/layer/building",
				name: "自定义地图",
				component: () => import("@/views/gaoDe/layer/BuildingLayer.vue")
			},
			{
				path: "/gaoDe/layer/areaMasking",
				name: "区域遮掩",
				component: () => import("@/views/gaoDe/layer/AreaMasking.vue")
			},
			{
				path: "/gaoDe/layer/regionsOfChina",
				name: "简易行政区图-中国",
				component: () => import("@/views/gaoDe/layer/RegionsOfChina.vue")
			},
			{
				path: "/gaoDe/layer/regionsOfWorld",
				name: "简易行政区图-世界",
				component: () => import("@/views/gaoDe/layer/RegionsOfWorld.vue")
			}
		]
	}
]
