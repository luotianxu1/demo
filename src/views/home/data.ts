export interface IFormItem {
	title: string
	url: string
	img: string
}

export interface IForm {
	title: string
	children: IFormItem[]
}

export interface IList {
	title: string
	index: number
	children: IForm[]
}

export const list: IList[] = [
	{
		title: "threejs",
		index: 0,
		children: [
			{
				title: "基础",
				children: [
					{
						title: "基本场景",
						url: "/threejs/base",
						img: "threejs/base/base.jpg"
					},
					{
						title: "物体移动",
						url: "/threejs/move",
						img: "threejs/base/move.jpg"
					},
					{
						title: "跟踪时间",
						url: "/threejs/clock",
						img: "threejs/base/clock.jpg"
					},
					{
						title: "Gsap",
						url: "/threejs/gsap",
						img: "threejs/base/gsap.jpg"
					},
					{
						title: "监听页面尺寸变化",
						url: "/threejs/resize",
						img: "threejs/base/resize.jpg"
					}
				]
			},
			{
				title: "控制器",
				children: [
					{
						title: "轨道控制器",
						url: "/threejs/orbitControls",
						img: "threejs/controls/orbitControls.jpg"
					}
				]
			},
			{
				title: "辅助器",
				children: [
					{
						title: "坐标辅助器",
						url: "/threejs/axesHelper",
						img: "threejs/helper/axesHelper.jpg"
					}
				]
			}
		]
	},
	{
		title: "leaflet",
		index: 1,
		children: []
	}
]
