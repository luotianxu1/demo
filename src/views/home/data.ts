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
				title: "场景",
				children: [
					{
						title: "基本场景",
						url: "/threejs/base",
						img: "threejs/base/base.jpg"
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
