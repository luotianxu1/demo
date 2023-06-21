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
					}
				]
			}
		]
	}
]
