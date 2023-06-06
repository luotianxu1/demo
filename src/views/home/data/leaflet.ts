import type { IList } from "./types"

export const leafletList: IList[] = [
	{
		title: "leaflet",
		index: 3,
		children: [
			{
				title: "地图",
				children: [
					{
						title: "地图",
						url: "/leaflet/map/map",
						img: "leaflet/map/map.jpg"
					},
					{
						title: "移动指定像素发送请求",
						url: "/leaflet/map/mapMove",
						img: "leaflet/map/mapMove.jpg"
					}
				]
			},
			{
				title: "图层",
				children: [
					{
						title: "高德地图",
						url: "/leaflet/layer/gaode",
						img: "leaflet/layer/gaode.jpg"
					},
					{
						title: "天地图",
						url: "/leaflet/layer/tianditu",
						img: "leaflet/layer/tianditu.jpg"
					},
					{
						title: "百度地图",
						url: "/leaflet/layer/baidu",
						img: "leaflet/layer/baidu.jpg"
					},
					{
						title: "腾讯地图",
						url: "/leaflet/layer/tencent",
						img: "leaflet/layer/tencent.jpg"
					},
					{
						title: "WMS",
						url: "/leaflet/layer/wms",
						img: "leaflet/layer/wms.jpg"
					},
					{
						title: "ImageOverLay",
						url: "/leaflet/layer/imageOverLay",
						img: "leaflet/layer/imageOverLay.jpg"
					},
					{
						title: "VideoOverLay",
						url: "/leaflet/layer/videoOverLay",
						img: "leaflet/layer/videoOverLay.jpg"
					},
					{
						title: "SvgOverLay",
						url: "/leaflet/layer/svgOverLay",
						img: "leaflet/layer/svgOverLay.jpg"
					},
					{
						title: "地图纠偏",
						url: "/leaflet/layer/mapCorrection",
						img: "leaflet/layer/mapCorrection.jpg"
					}
				]
			},
			{
				title: "UI图层",
				children: [
					{
						title: "Marker",
						url: "/leaflet/ui/marker",
						img: "leaflet/ui/marker.jpg"
					},
					{
						title: "自定义htmlMarker",
						url: "/leaflet/ui/markerHtml",
						img: "leaflet/ui/markerHtml.jpg"
					},
					{
						title: "Poup",
						url: "/leaflet/ui/popup",
						img: "leaflet/ui/popup.jpg"
					},
					{
						title: "Tooltip",
						url: "/leaflet/ui/tooltip",
						img: "leaflet/ui/tooltip.jpg"
					},
					{
						title: "自定义tooltip",
						url: "/leaflet/ui/tooltipHtml",
						img: "leaflet/ui/tooltipHtml.jpg"
					},
					{
						title: "聚合",
						url: "/leaflet/ui/markerCluster",
						img: "leaflet/ui/markerCluster.jpg"
					},
					{
						title: "图标闪烁",
						url: "/leaflet/ui/twinkle",
						img: "leaflet/ui/twinkle.jpg"
					},
					{
						title: "区域高亮",
						url: "/leaflet/ui/areaHighlighting",
						img: "leaflet/ui/areaHighlighting.jpg"
					},
					{
						title: "标注避让",
						url: "/leaflet/ui/labelTextCollision",
						img: "leaflet/ui/labelTextCollision.jpg"
					}
				]
			},
			{
				title: "矢量图层",
				children: [
					{
						title: "Polyline折线",
						url: "/leaflet/vectorLayer/polyline",
						img: "leaflet/vectorLayer/polyline.jpg"
					},
					{
						title: "Polygon多边形",
						url: "/leaflet/vectorLayer/polygon",
						img: "leaflet/vectorLayer/polygon.jpg"
					},
					{
						title: "Rectangle矩形",
						url: "/leaflet/vectorLayer/rectangle",
						img: "leaflet/vectorLayer/rectangle.jpg"
					},
					{
						title: "Circle圆形",
						url: "/leaflet/vectorLayer/circle",
						img: "leaflet/vectorLayer/circle.jpg"
					},
					{
						title: "CircleMarker圆形标记",
						url: "/leaflet/vectorLayer/circleMarker",
						img: "leaflet/vectorLayer/circleMarker.jpg"
					},
					{
						title: "GeoJson",
						url: "/leaflet/vectorLayer/geoJson",
						img: "leaflet/vectorLayer/geoJson.jpg"
					},
					{
						title: "GeoJson质心",
						url: "/leaflet/vectorLayer/geoJson2",
						img: "leaflet/vectorLayer/geoJson2.jpg"
					},
					{
						title: "线段叠加",
						url: "/leaflet/vectorLayer/lineOverlay",
						img: "leaflet/vectorLayer/lineOverlay.jpg"
					},
					{
						title: "绘制",
						url: "/leaflet/vectorLayer/draw",
						img: "leaflet/vectorLayer/draw.jpg"
					}
				]
			},
			{
				title: "控件",
				children: [
					{
						title: "基础控件",
						url: "/leaflet/control/control",
						img: "leaflet/control/control.jpg"
					},
					{
						title: "导航控件",
						url: "/leaflet/control/navigation",
						img: "leaflet/control/navigation.jpg"
					},
					{
						title: "鹰眼控件",
						url: "/leaflet/control/hawkeyeMap",
						img: "leaflet/control/hawkeyeMap.jpg"
					},
					{
						title: "全屏控件",
						url: "/leaflet/control/fullScreen",
						img: "leaflet/control/fullScreen.jpg"
					},
					{
						title: "测量控件",
						url: "/leaflet/control/measure",
						img: "leaflet/control/measure.jpg"
					},
					{
						title: "格网控件",
						url: "/leaflet/control/graticule",
						img: "leaflet/control/graticule.jpg"
					},
					{
						title: "图层探查控件",
						url: "/leaflet/control/magnifyingGlass",
						img: "leaflet/control/magnifyingGlass.jpg"
					}
				]
			},
			{
				title: "计算",
				children: [
					{
						title: "离点距离最近线上的点",
						url: "/leaflet/calculation/markerToLine",
						img: "leaflet/calculation/markerToLine.jpg"
					},
					{
						title: "截取线段",
						url: "/leaflet/calculation/intercept",
						img: "leaflet/calculation/intercept.jpg"
					},
					{
						title: "点与geojson关系",
						url: "/leaflet/calculation/markerAndjeojson",
						img: "leaflet/calculation/markerAndjeojson.jpg"
					},
					{
						title: "根据距离截取线段",
						url: "/leaflet/calculation/lineSegmentInterception",
						img: "leaflet/calculation/lineSegmentInterception.jpg"
					}
				]
			},
			{
				title: "可视化",
				children: [
					{
						title: "热力图",
						url: "/leaflet/visualization/heat",
						img: "leaflet/visualization/heat.jpg"
					},
					{
						title: "动态热力图",
						url: "/leaflet/visualization/dynamicHeat",
						img: "leaflet/visualization/heat.jpg"
					},
					{
						title: "散点图",
						url: "/leaflet/visualization/scatterPlot",
						img: "leaflet/visualization/scatterPlot.jpg"
					},
					{
						title: "蚂蚁线",
						url: "/leaflet/visualization/antPath",
						img: "leaflet/visualization/antPath.jpg"
					},
					{
						title: "轨迹线",
						url: "/leaflet/visualization/snakeAnim",
						img: "leaflet/visualization/snakeAnim.jpg"
					},
					{
						title: "动态画线",
						url: "/leaflet/visualization/snakeAnim2",
						img: "leaflet/visualization/snakeAnim2.jpg"
					}
				]
			}
		]
	}
]
