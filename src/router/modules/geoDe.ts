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
			},
			{
				path: "/gaoDe/layer/WMTS",
				name: "WMTS",
				component: () => import("@/views/gaoDe/layer/WMTS.vue")
			},
			{
				path: "/gaoDe/layer/WMS",
				name: "WMS",
				component: () => import("@/views/gaoDe/layer/WMS.vue")
			},
			{
				path: "/gaoDe/layer/xyzTileLayer",
				name: "xyz栅格图层",
				component: () => import("@/views/gaoDe/layer/XyzTileLayer.vue")
			},
			{
				path: "/gaoDe/layer/imageLayer",
				name: "图片图层",
				component: () => import("@/views/gaoDe/layer/ImageLayer.vue")
			},
			{
				path: "/gaoDe/layer/canvasLayer",
				name: "Canvas图层",
				component: () => import("@/views/gaoDe/layer/CanvasLayer.vue")
			},
			{
				path: "/gaoDe/layer/heatmap",
				name: "热力图",
				component: () => import("@/views/gaoDe/layer/Heatmap.vue")
			},
			{
				path: "/gaoDe/layer/customLayerCanvas",
				name: "自定义图层-Canvas",
				component: () => import("@/views/gaoDe/layer/CustomLayerCanvas.vue")
			},
			{
				path: "/gaoDe/layer/indoorMap",
				name: "室内地图",
				component: () => import("@/views/gaoDe/layer/IndoorMap.vue")
			}
		]
	}
]
