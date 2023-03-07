export interface IFormItem {
	title: string
	url: string
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
						title: "环境光",
						url: "/threejs/base"
					}
				]
			},
			{
				title: "灯光",
				children: [
					{
						title: "环境光",
						url: "/threejs/base"
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
