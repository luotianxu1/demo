import type { IList } from "./types"

export const openlayersList: IList[] = [
	{
		title: "openlayers",
		index: 4,
		children: [
			{
				title: "基础",
				children: [
					{
						title: "基础地图",
						url: "/openlayers/base/map",
						img: "openlayers/base/map.jpg"
					}
				]
			},
			{
				title: "控件",
				children: [
					{
						title: "地图控件",
						url: "/openlayers/controls",
						img: "openlayers/controls/controls.jpg"
					},
					{
						title: "图层探查",
						url: "/openlayers/layerProbe",
						img: "openlayers/controls/layerProbe.jpg"
					},
					{
						title: "动画",
						url: "/openlayers/animation",
						img: "openlayers/controls/animation.jpg"
					}
				]
			},
			{
				title: "图层",
				children: [
					{
						title: "GeoJSON",
						url: "/openlayers/geoJSON",
						img: "openlayers/layer/geoJSON.jpg"
					},
					{
						title: "OSM",
						url: "/openlayers/osm",
						img: "openlayers/layer/osm.jpg"
					},
					{
						title: "WMTS",
						url: "/openlayers/wmts",
						img: "openlayers/layer/wmts.jpg"
					},
					{
						title: "Bing",
						url: "/openlayers/bing",
						img: "openlayers/layer/bing.jpg"
					},
					{
						title: "天地图",
						url: "/openlayers/tianditu",
						img: "openlayers/layer/tianditu.jpg"
					},
					{
						title: "百度地图",
						url: "/openlayers/baidu",
						img: "openlayers/layer/baidu.jpg"
					},
					{
						title: "高德地图",
						url: "/openlayers/gaode",
						img: "openlayers/layer/gaode.jpg"
					},
					{
						title: "图片图层",
						url: "/openlayers/img",
						img: "openlayers/layer/img.jpg"
					}
				]
			},
			{
				title: "覆盖物",
				children: [
					{
						title: "Marker",
						url: "/openlayers/marker",
						img: "openlayers/controls/marker.jpg"
					}
				]
			}
		]
	}
]
