import type { RouteRecordRaw } from "vue-router"

export const openlayersRouter: RouteRecordRaw[] = [
	{
		path: "/openlayers",
		name: "openlayers",
		redirect: "/openlayers/base/map",
		children: [
			{
				path: "/openlayers/base/map",
				name: "形状-openLayers",
				component: () => import("@/views/openlayers/base/Map.vue")
			},
			{
				path: "/openlayers/flt",
				name: "视图适应-openLayers",
				component: () => import("@/views/openlayers/base/Flt.vue")
			},
			{
				path: "/openlayers/controls",
				name: "地图控件-openLayers",
				component: () => import("@/views/openlayers/controls/Controls.vue")
			},
			{
				path: "/openlayers/layerProbe",
				name: "图层探查-openLayers",
				component: () => import("@/views/openlayers/controls/LayerProbe.vue")
			},
			{
				path: "/openlayers/animation",
				name: "动画-openLayers",
				component: () => import("@/views/openlayers/controls/Animation.vue")
			},
			{
				path: "/openlayers/geoJSON",
				name: "GeoJSON-openLayers",
				component: () => import("@/views/openlayers/layer/GeoJSON.vue")
			},
			{
				path: "/openlayers/osm",
				name: "OSM-openLayers",
				component: () => import("@/views/openlayers/layer/OSM.vue")
			},
			{
				path: "/openlayers/bing",
				name: "Bing-openLayers",
				component: () => import("@/views/openlayers/layer/Bing.vue")
			},
			{
				path: "/openlayers/tianditu",
				name: "天地图-openLayers",
				component: () => import("@/views/openlayers/layer/Tianditu.vue")
			},
			{
				path: "/openlayers/baidu",
				name: "百度地图-openLayers",
				component: () => import("@/views/openlayers/layer/Baidu.vue")
			},
			{
				path: "/openlayers/gaode",
				name: "高德地图-openLayers",
				component: () => import("@/views/openlayers/layer/GaoDe.vue")
			},
			{
				path: "/openlayers/wmts",
				name: "WMTS-openLayers",
				component: () => import("@/views/openlayers/layer/WMTS.vue")
			},
			{
				path: "/openlayers/WMTSExcessive",
				name: "WMTS过渡-openLayers",
				component: () => import("@/views/openlayers/layer/WMTSExcessive.vue")
			},
			{
				path: "/openlayers/img",
				name: "图片-openLayers",
				component: () => import("@/views/openlayers/layer/ImgLayer.vue")
			},
			{
				path: "/openlayers/layerSwipe",
				name: "层滑动-openLayers",
				component: () => import("@/views/openlayers/layer/LayerSwipe.vue")
			},
			{
				path: "/openlayers/graticule",
				name: "网格-openLayers",
				component: () => import("@/views/openlayers/layer/Graticule.vue")
			},
			{
				path: "/openlayers/marker",
				name: "Marker-openLayers",
				component: () => import("@/views/openlayers/covering/Marker.vue")
			},
			{
				path: "/openlayers/customCircle",
				name: "自定义圆-openLayers",
				component: () => import("@/views/openlayers/covering/CustomCircle.vue")
			},
			{
				path: "/openlayers/featureAnimation",
				name: "扩散-openLayers",
				component: () => import("@/views/openlayers/covering/FeatureAnimation.vue")
			},
			{
				path: "/openlayers/clusters",
				name: "聚合-openLayers",
				component: () => import("@/views/openlayers/covering/Clusters.vue")
			},
			{
				path: "/openlayers/polygonStyles",
				name: "多边形样式-openLayers",
				component: () => import("@/views/openlayers/covering/PolygonStyles.vue")
			},
			{
				path: "/openlayers/drawAndModify",
				name: "编辑形状-openLayers",
				component: () => import("@/views/openlayers/covering/DrawAndModify.vue")
			},
			{
				path: "/openlayers/draw",
				name: "绘制-openLayers",
				component: () => import("@/views/openlayers/covering/Draw.vue")
			},
			{
				path: "/openlayers/iconPixelOperations",
				name: "图标像素操作-openLayers",
				component: () => import("@/views/openlayers/covering/IconPixelOperations.vue")
			},
			{
				path: "/openlayers/iconModify",
				name: "图标位置修改-openLayers",
				component: () => import("@/views/openlayers/covering/IconModify.vue")
			},
			{
				path: "/openlayers/lineArrows",
				name: "箭头-openLayers",
				component: () => import("@/views/openlayers/covering/LineArrows.vue")
			},
			{
				path: "/openlayers/markerAnimation",
				name: "图标动画-openLayers",
				component: () => import("@/views/openlayers/covering/MarkerAnimation.vue")
			},
			{
				path: "/openlayers/select",
				name: "选择-openLayers",
				component: () => import("@/views/openlayers/other/Select.vue")
			},
			{
				path: "/openlayers/thermalMap",
				name: "热力图-openLayers",
				component: () => import("@/views/openlayers/other/ThermalMap.vue")
			},
			{
				path: "/openlayers/turf",
				name: "turf-openLayers",
				component: () => import("@/views/openlayers/other/Turf.vue")
			},
			{
				path: "/openlayers/sharedViews",
				name: "同步视图-openLayers",
				component: () => import("@/views/openlayers/other/SharedViews.vue")
			},
			{
				path: "/openlayers/tracing",
				name: "跟踪-openLayers",
				component: () => import("@/views/openlayers/other/Tracing.vue")
			}
		]
	}
]
