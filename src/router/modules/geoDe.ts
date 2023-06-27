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
			},
			{
				path: "/gaoDe/layer/labelsLayer",
				name: "标注图层",
				component: () => import("@/views/gaoDe/layer/LabelsLayer.vue")
			},
			{
				path: "/gaoDe/covering/marker",
				name: "点标记",
				component: () => import("@/views/gaoDe/covering/Marker.vue")
			},
			{
				path: "/gaoDe/covering/text",
				name: "文本标记",
				component: () => import("@/views/gaoDe/covering/Text.vue")
			},
			{
				path: "/gaoDe/covering/icon",
				name: "Icon",
				component: () => import("@/views/gaoDe/covering/Icon.vue")
			},
			{
				path: "/gaoDe/covering/labelMarker",
				name: "标注",
				component: () => import("@/views/gaoDe/covering/LabelMarker.vue")
			},
			{
				path: "/gaoDe/covering/circleMarker",
				name: "圆点标记",
				component: () => import("@/views/gaoDe/covering/CircleMarker.vue")
			},
			{
				path: "/gaoDe/covering/moveAnimation",
				name: "轨迹回放",
				component: () => import("@/views/gaoDe/covering/MoveAnimation.vue")
			},
			{
				path: "/gaoDe/covering/elasticMarker",
				name: "灵活点标记",
				component: () => import("@/views/gaoDe/covering/ElasticMarker.vue")
			},
			{
				path: "/gaoDe/covering/massMarks",
				name: "海量点标记",
				component: () => import("@/views/gaoDe/covering/MassMarks.vue")
			},
			{
				path: "/gaoDe/covering/markerCluster",
				name: "点聚合",
				component: () => import("@/views/gaoDe/covering/MarkerCluster.vue")
			},
			{
				path: "/gaoDe/covering/markerClusterWeight",
				name: "点聚合(索引)",
				component: () => import("@/views/gaoDe/covering/MarkerClusterWeight.vue")
			},
			{
				path: "/gaoDe/covering/polyline",
				name: "折线",
				component: () => import("@/views/gaoDe/covering/Polyline.vue")
			},
			{
				path: "/gaoDe/covering/bezierCurve",
				name: "弧线",
				component: () => import("@/views/gaoDe/covering/BezierCurve.vue")
			},
			{
				path: "/gaoDe/covering/polygon",
				name: "多边形",
				component: () => import("@/views/gaoDe/covering/Polygon.vue")
			},
			{
				path: "/gaoDe/covering/rectangle",
				name: "矩形",
				component: () => import("@/views/gaoDe/covering/Rectangle.vue")
			},
			{
				path: "/gaoDe/covering/circle",
				name: "圆",
				component: () => import("@/views/gaoDe/covering/Circle.vue")
			},
			{
				path: "/gaoDe/covering/ellipse",
				name: "椭圆",
				component: () => import("@/views/gaoDe/covering/Ellipse.vue")
			},
			{
				path: "/gaoDe/covering/draw",
				name: "绘制",
				component: () => import("@/views/gaoDe/covering/Draw.vue")
			}
		]
	}
]
