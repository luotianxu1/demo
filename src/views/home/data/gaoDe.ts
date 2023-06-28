import type { IList } from "./types"

export const gaoDeList: IList[] = [
	{
		title: "高德地图",
		index: 5,
		children: [
			{
				title: "基础",
				children: [
					{
						title: "基础地图",
						url: "/gaoDe/base/map",
						img: "gaoDe/base/map.jpg"
					},
					{
						title: "地图控件",
						url: "/gaoDe/base/control",
						img: "gaoDe/base/control.jpg"
					}
				]
			},
			{
				title: "图层",
				children: [
					{
						title: "楼块图层",
						url: "/gaoDe/layer/building",
						img: "gaoDe/layer/building.jpg"
					},
					{
						title: "区域遮掩",
						url: "/gaoDe/layer/areaMasking",
						img: "gaoDe/layer/areaMasking.jpg"
					},
					{
						title: "简易行政区图-中国",
						url: "/gaoDe/layer/regionsOfChina",
						img: "gaoDe/layer/regionsOfChina.jpg"
					},
					{
						title: "简易行政区图-世界",
						url: "/gaoDe/layer/regionsOfWorld",
						img: "gaoDe/layer/regionsOfWorld.jpg"
					},
					{
						title: "WMTS",
						url: "/gaoDe/layer/WMTS",
						img: "gaoDe/layer/WMTS.jpg"
					},
					{
						title: "WMS",
						url: "/gaoDe/layer/WMS",
						img: "gaoDe/layer/WMS.jpg"
					},
					{
						title: "xyz栅格图层",
						url: "/gaoDe/layer/xyzTileLayer",
						img: "gaoDe/layer/xyzTileLayer.jpg"
					},
					{
						title: "图片图层",
						url: "/gaoDe/layer/imageLayer",
						img: "gaoDe/layer/imageLayer.jpg"
					},
					{
						title: "Canvas图层",
						url: "/gaoDe/layer/canvasLayer",
						img: "gaoDe/layer/canvasLayer.jpg"
					},
					{
						title: "热力图",
						url: "/gaoDe/layer/heatmap",
						img: "gaoDe/layer/heatmap.jpg"
					},
					{
						title: "自定义图层-canvas",
						url: "/gaoDe/layer/customLayerCanvas",
						img: "gaoDe/layer/customLayerCanvas.jpg"
					},
					{
						title: "室内地图",
						url: "/gaoDe/layer/indoorMap",
						img: "gaoDe/layer/indoorMap.jpg"
					},
					{
						title: "标注图层",
						url: "/gaoDe/layer/labelsLayer",
						img: "gaoDe/layer/labelsLayer.jpg"
					}
				]
			},
			{
				title: "覆盖物",
				children: [
					{
						title: "点标记",
						url: "/gaoDe/covering/marker",
						img: "gaoDe/covering/marker.jpg"
					},
					{
						title: "文本标记",
						url: "/gaoDe/covering/text",
						img: "gaoDe/covering/text.jpg"
					},
					{
						title: "Icon",
						url: "/gaoDe/covering/icon",
						img: "gaoDe/covering/icon.jpg"
					},
					{
						title: "标注",
						url: "/gaoDe/covering/labelMarker",
						img: "gaoDe/covering/labelMarker.jpg"
					},
					{
						title: "圆点标记",
						url: "/gaoDe/covering/circleMarker",
						img: "gaoDe/covering/circleMarker.jpg"
					},
					{
						title: "轨迹回放",
						url: "/gaoDe/covering/moveAnimation",
						img: "gaoDe/covering/moveAnimation.jpg"
					},
					{
						title: "灵活点标记",
						url: "/gaoDe/covering/elasticMarker",
						img: "gaoDe/covering/elasticMarker.jpg"
					},
					{
						title: "海量点标记",
						url: "/gaoDe/covering/massMarks",
						img: "gaoDe/covering/massMarks.jpg"
					},
					{
						title: "点聚合",
						url: "/gaoDe/covering/markerCluster",
						img: "gaoDe/covering/markerCluster.jpg"
					},
					{
						title: "点聚合(索引)",
						url: "/gaoDe/covering/markerClusterWeight",
						img: "gaoDe/covering/markerClusterWeight.jpg"
					},
					{
						title: "折线",
						url: "/gaoDe/covering/polyline",
						img: "gaoDe/covering/polyline.jpg"
					},
					{
						title: "弧线",
						url: "/gaoDe/covering/bezierCurve",
						img: "gaoDe/covering/bezierCurve.jpg"
					},
					{
						title: "多边形",
						url: "/gaoDe/covering/polygon",
						img: "gaoDe/covering/polygon.jpg"
					},
					{
						title: "矩形",
						url: "/gaoDe/covering/rectangle",
						img: "gaoDe/covering/rectangle.jpg"
					},
					{
						title: "圆",
						url: "/gaoDe/covering/circle",
						img: "gaoDe/covering/circle.jpg"
					},
					{
						title: "椭圆",
						url: "/gaoDe/covering/ellipse",
						img: "gaoDe/covering/ellipse.jpg"
					},
					{
						title: "绘制",
						url: "/gaoDe/covering/draw",
						img: "gaoDe/covering/draw.jpg"
					},
					{
						title: "GeoJSON",
						url: "/gaoDe/covering/geoJSON",
						img: "gaoDe/covering/geoJSON.jpg"
					},
					{
						title: "吸附",
						url: "/gaoDe/covering/adsorb",
						img: "gaoDe/covering/adsorb.jpg"
					},
					{
						title: "右键菜单",
						url: "/gaoDe/covering/contextMenu",
						img: "gaoDe/covering/contextMenu.jpg"
					}
				]
			},
			{
				title: "搜索服务",
				children: [
					{
						title: "输入提示",
						url: "/gaoDe/search/tips",
						img: "gaoDe/search/tips.jpg"
					},
					{
						title: "关键字搜索",
						url: "/gaoDe/search/keyword",
						img: "gaoDe/search/keyword.jpg"
					},
					{
						title: "周边搜索",
						url: "/gaoDe/search/rim",
						img: "gaoDe/search/rim.jpg"
					},
					{
						title: "多边形搜索",
						url: "/gaoDe/search/polygon",
						img: "gaoDe/search/polygon.jpg"
					},
					{
						title: "详情",
						url: "/gaoDe/search/detail",
						img: "gaoDe/search/detail.jpg"
					}
				]
			},
			{
				title: "路线规划",
				children: [
					{
						title: "驾车路线规划",
						url: "/gaoDe/planning/routePlanning",
						img: "gaoDe/planning/routePlanning.jpg"
					},
					{
						title: "可拖拽驾车路线规划",
						url: "/gaoDe/planning/dragRoute",
						img: "gaoDe/planning/dragRoute.jpg"
					}
				]
			}
		]
	}
]
