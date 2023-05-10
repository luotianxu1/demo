import type { RouteRecordRaw } from "vue-router"

export const leafletRouter: RouteRecordRaw[] = [
	{
		path: "/leaflet",
		name: "leaflet",
		redirect: "/leaflet/layer/gaode",
		children: [
			{
				path: "/leaflet/map/map",
				name: "地图",
				component: () => import("@/views/leaflet/map/Map.vue")
			},
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
				path: "/leaflet/layer/wms",
				name: "WMS",
				component: () => import("@/views/leaflet/layer/Wms.vue")
			},
			{
				path: "/leaflet/layer/imageOverLay",
				name: "ImageOverLay",
				component: () => import("@/views/leaflet/layer/ImageOverLay.vue")
			},
			{
				path: "/leaflet/layer/videoOverLay",
				name: "VideoOverLay",
				component: () => import("@/views/leaflet/layer/VideoOverLay.vue")
			},
			{
				path: "/leaflet/layer/svgOverLay",
				name: "SvgOverLay",
				component: () => import("@/views/leaflet/layer/SvgOverLay.vue")
			},
			{
				path: "/leaflet/ui/marker",
				name: "Marker",
				component: () => import("@/views/leaflet/ui/Marker.vue")
			},
			{
				path: "/leaflet/ui/popup",
				name: "Popup",
				component: () => import("@/views/leaflet/ui/Popup.vue")
			},
			{
				path: "/leaflet/ui/markerCluster",
				name: "点聚合",
				component: () => import("@/views/leaflet/ui/MarkerCluster.vue")
			},
			{
				path: "/leaflet/ui/tooltip",
				name: "Tooltip",
				component: () => import("@/views/leaflet/ui/Tooltip.vue")
			},
			{
				path: "/leaflet/ui/twinkle",
				name: "图标闪烁",
				component: () => import("@/views/leaflet/ui/Twinkle.vue")
			},
			{
				path: "/leaflet/vectorLayer/polyline",
				name: "Polyline",
				component: () => import("@/views/leaflet/vectorLayer/Polyline.vue")
			},
			{
				path: "/leaflet/vectorLayer/polygon",
				name: "Polygon",
				component: () => import("@/views/leaflet/vectorLayer/Polygon.vue")
			},
			{
				path: "/leaflet/vectorLayer/rectangle",
				name: "Rectangle",
				component: () => import("@/views/leaflet/vectorLayer/Rectangle.vue")
			},
			{
				path: "/leaflet/vectorLayer/circle",
				name: "Circle圆形",
				component: () => import("@/views/leaflet/vectorLayer/Circle.vue")
			},
			{
				path: "/leaflet/vectorLayer/circleMarker",
				name: "CircleMarker圆形标记",
				component: () => import("@/views/leaflet/vectorLayer/CircleMarker.vue")
			},
			{
				path: "/leaflet/control/control",
				name: "Control",
				component: () => import("@/views/leaflet/control/Control.vue")
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
