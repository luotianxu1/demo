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
					}
				]
			}
		]
	}
]
