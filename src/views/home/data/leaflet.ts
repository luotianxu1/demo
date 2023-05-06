import type { IList } from "./types"

export const leafletList: IList[] = [
	{
		title: "leaflet",
		index: 3,
		children: [
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
			}
		]
	}
]
