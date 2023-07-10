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
				path: "/openlayers/flt",
				name: "openLayers视图适应",
				component: () => import("@/views/openlayers/base/Flt.vue")
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
				name: "openLayers天地图",
				component: () => import("@/views/openlayers/layer/Tianditu.vue")
			},
			{
				path: "/openlayers/baidu",
				name: "openLayers百度地图",
				component: () => import("@/views/openlayers/layer/Baidu.vue")
			},
			{
				path: "/openlayers/gaode",
				name: "openLayers高德地图",
				component: () => import("@/views/openlayers/layer/GaoDe.vue")
			},
			{
				path: "/openlayers/wmts",
				name: "openLayersWMTS",
				component: () => import("@/views/openlayers/layer/WMTS.vue")
			},
			{
				path: "/openlayers/WMTSExcessive",
				name: "openLayersWMTS过渡",
				component: () => import("@/views/openlayers/layer/WMTSExcessive.vue")
			},
			{
				path: "/openlayers/img",
				name: "openLayers图片",
				component: () => import("@/views/openlayers/layer/ImgLayer.vue")
			},
			{
				path: "/openlayers/marker",
				name: "openLayersMarker",
				component: () => import("@/views/openlayers/covering/Marker.vue")
			},
			{
				path: "/openlayers/customCircle",
				name: "openLayers自定义圆",
				component: () => import("@/views/openlayers/covering/CustomCircle.vue")
			},
			{
				path: "/openlayers/featureAnimation",
				name: "openLayers扩散",
				component: () => import("@/views/openlayers/covering/FeatureAnimation.vue")
			},
			{
				path: "/openlayers/clusters",
				name: "openLayers聚合",
				component: () => import("@/views/openlayers/covering/Clusters.vue")
			},
			{
				path: "/openlayers/select",
				name: "openLayers选择",
				component: () => import("@/views/openlayers/other/Select.vue")
			}
		]
	}
]
