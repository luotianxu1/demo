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
					}
				]
			},
			{
				title: "点",
				children: [
					{
						title: "点",
						url: "/leaflet/marker/marker",
						img: "leaflet/marker/marker.jpg"
					},
					{
						title: "Poup",
						url: "/leaflet/marker/popup",
						img: "leaflet/marker/popup.jpg"
					},
					{
						title: "聚合",
						url: "/leaflet/marker/markerCluster",
						img: "leaflet/marker/markerCluster.jpg"
					},
					{
						title: "图标闪烁",
						url: "/leaflet/marker/twinkle",
						img: "leaflet/marker/twinkle.jpg"
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
