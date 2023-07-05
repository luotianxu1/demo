import type { RouteRecordRaw } from "vue-router"

export const openlayersRouter: RouteRecordRaw[] = [
	{
		path: "/openlayers",
		name: "openlayers",
		redirect: "/openlayers/base/map",
		children: [
			{
				path: "/openlayers/base/map",
				name: "形状",
				component: () => import("@/views/openlayers/base/Map.vue")
			},
			{
				path: "/openlayers/controls",
				name: "openLayers地图控件",
				component: () => import("@/views/openlayers/controls/Controls.vue")
			},
			{
				path: "/openlayers/layerProbe",
				name: "openLayers图层探查",
				component: () => import("@/views/openlayers/controls/LayerProbe.vue")
			},
			{
				path: "/openlayers/animation",
				name: "openLayers动画",
				component: () => import("@/views/openlayers/controls/Animation.vue")
			},
			{
				path: "/openlayers/geoJSON",
				name: "openLayersGeoJSON",
				component: () => import("@/views/openlayers/layer/GeoJSON.vue")
			},
			{
				path: "/openlayers/osm",
				name: "openLayersOSM",
				component: () => import("@/views/openlayers/layer/OSM.vue")
			},
			{
				path: "/openlayers/bing",
				name: "openLayersBing",
				component: () => import("@/views/openlayers/layer/Bing.vue")
			},
			{
				path: "/openlayers/tianditu",
				name: "openLayersTianditu",
				component: () => import("@/views/openlayers/layer/Tianditu.vue")
			},
			{
				path: "/openlayers/baidu",
				name: "openLayersBaidu",
				component: () => import("@/views/openlayers/layer/Baidu.vue")
			},
			{
				path: "/openlayers/gaode",
				name: "openLayersGaode",
				component: () => import("@/views/openlayers/layer/Gaode.vue")
			},
			{
				path: "/openlayers/wmts",
				name: "openLayersWMTS",
				component: () => import("@/views/openlayers/layer/WMTS.vue")
			},
			{
				path: "/openlayers/img",
				name: "openLayersImg",
				component: () => import("@/views/openlayers/layer/ImgLayer.vue")
			},
			{
				path: "/openlayers/marker",
				name: "openLayersMarker",
				component: () => import("@/views/openlayers/covering/Marker.vue")
			}
		]
	}
]
