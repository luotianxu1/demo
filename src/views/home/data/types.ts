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
