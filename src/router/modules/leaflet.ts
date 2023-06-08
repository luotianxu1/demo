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
				path: "/leaflet/map/mapMove",
				name: "移动指定像素发送请求",
				component: () => import("@/views/leaflet/map/MapMove.vue")
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
				path: "/leaflet/layer/mapCorrection",
				name: "地图纠偏",
				component: () => import("@/views/leaflet/layer/MapCorrection.vue")
			},
			{
				path: "/leaflet/ui/marker",
				name: "Marker",
				component: () => import("@/views/leaflet/ui/Marker.vue")
			},
			{
				path: "/leaflet/ui/markerHtml",
				name: "MarkerHtml",
				component: () => import("@/views/leaflet/ui/MarkerHTML.vue")
			},
			{
				path: "/leaflet/ui/popup",
				name: "Popup",
				component: () => import("@/views/leaflet/ui/Popup.vue")
			},
			{
				path: "/leaflet/ui/tooltipHtml",
				name: "TooltipHtml",
				component: () => import("@/views/leaflet/ui/TooltipHtml.vue")
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
				path: "/leaflet/ui/areaHighlighting",
				name: "区域高亮",
				component: () => import("@/views/leaflet/ui/AreaHighlighting.vue")
			},
			{
				path: "/leaflet/ui/labelTextCollision",
				name: "标注避让",
				component: () => import("@/views/leaflet/ui/LabelTextCollision.vue")
			},
			{
				path: "/leaflet/ui/text",
				name: "文本标注",
				component: () => import("@/views/leaflet/ui/Text.vue")
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
				path: "/leaflet/vectorLayer/geoJson",
				name: "GeoJson",
				component: () => import("@/views/leaflet/vectorLayer/GeoJson.vue")
			},
			{
				path: "/leaflet/vectorLayer/geoJson2",
				name: "GeoJson质心",
				component: () => import("@/views/leaflet/vectorLayer/GeoJson2.vue")
			},
			{
				path: "/leaflet/vectorLayer/lineOverlay",
				name: "线段叠加内容",
				component: () => import("@/views/leaflet/vectorLayer/LineOverlay.vue")
			},
			{
				path: "/leaflet/vectorLayer/draw",
				name: "绘制",
				component: () => import("@/views/leaflet/vectorLayer/Draw.vue")
			},
			{
				path: "/leaflet/vectorLayer/draw2",
				name: "绘制2",
				component: () => import("@/views/leaflet/vectorLayer/Draw2.vue")
			},
			{
				path: "/leaflet/vectorLayer/multiCircle",
				name: "同心圆",
				component: () => import("@/views/leaflet/vectorLayer/MultiCircle.vue")
			},
			{
				path: "/leaflet/vectorLayer/multiRect",
				name: "对称多边形",
				component: () => import("@/views/leaflet/vectorLayer/MultiRect.vue")
			},
			{
				path: "/leaflet/vectorLayer/parallelGrid",
				name: "平行四边形网络",
				component: () => import("@/views/leaflet/vectorLayer/ParallelGrid.vue")
			},
			{
				path: "/leaflet/vectorLayer/rectGrid",
				name: "矩形网络",
				component: () => import("@/views/leaflet/vectorLayer/RectGrid.vue")
			},
			{
				path: "/leaflet/vectorLayer/radiationZone",
				name: "辐射区",
				component: () => import("@/views/leaflet/vectorLayer/RadiationZone.vue")
			},
			{
				path: "/leaflet/control/control",
				name: "基础控件",
				component: () => import("@/views/leaflet/control/Control.vue")
			},
			{
				path: "/leaflet/control/navigation",
				name: "导航控件",
				component: () => import("@/views/leaflet/control/Navigation.vue")
			},
			{
				path: "/leaflet/control/hawkeyeMap",
				name: "鹰眼控件",
				component: () => import("@/views/leaflet/control/HawkeyeMap.vue")
			},
			{
				path: "/leaflet/control/fullScreen",
				name: "全屏控件",
				component: () => import("@/views/leaflet/control/FullScreen.vue")
			},
			{
				path: "/leaflet/control/graticule",
				name: "格网控件",
				component: () => import("@/views/leaflet/control/Graticule.vue")
			},
			{
				path: "/leaflet/control/magnifyingGlass",
				name: "图层探查控件",
				component: () => import("@/views/leaflet/control/MagnifyingGlass.vue")
			},
			{
				path: "/leaflet/control/print",
				name: "打印控件",
				component: () => import("@/views/leaflet/control/Print.vue")
			},
			{
				path: "/leaflet/control/side",
				name: "卷帘控件",
				component: () => import("@/views/leaflet/control/Side.vue")
			},
			{
				path: "/leaflet/control/contextmenu",
				name: "右键菜单",
				component: () => import("@/views/leaflet/control/Contextmenu.vue")
			},
			{
				path: "/leaflet/control/sidebar",
				name: "侧边栏",
				component: () => import("@/views/leaflet/control/Sidebar.vue")
			},
			{
				path: "/leaflet/calculation/markerToLine",
				name: "离点距离最近线上的点",
				component: () => import("@/views/leaflet/calculation/MarkerToLine.vue")
			},
			{
				path: "/leaflet/calculation/intercept",
				name: "截取线段",
				component: () => import("@/views/leaflet/calculation/Intercept.vue")
			},
			{
				path: "/leaflet/calculation/markerAndjeojson",
				name: "点与geojson关系",
				component: () => import("@/views/leaflet/calculation/MarkerAndGeojson.vue")
			},
			{
				path: "/leaflet/calculation/lineSegmentInterception",
				name: "根据距离截取线段",
				component: () => import("@/views/leaflet/calculation/LineSegmentInterception.vue")
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
			},
			{
				path: "/leaflet/visualization/antPath",
				name: "蚂蚁线",
				component: () => import("@/views/leaflet/visualization/AntPath.vue")
			},
			{
				path: "/leaflet/visualization/snakeAnim",
				name: "轨迹线",
				component: () => import("@/views/leaflet/visualization/SnakeAnim.vue")
			},
			{
				path: "/leaflet/visualization/snakeAnim2",
				name: "动态画线",
				component: () => import("@/views/leaflet/visualization/SnakeAnim2.vue")
			},
			{
				path: "/leaflet/visualization/move",
				name: "轨迹移动",
				component: () => import("@/views/leaflet/visualization/Move.vue")
			}
		]
	}
]
