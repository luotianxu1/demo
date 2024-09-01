export interface IEstimatedListProps<T> {
	loading: boolean
	estimatedHeight: number
	dataSource: T[]
}

export interface IPosInfo {
	index: number
	top: number
	bottom: number
	height: number
	dHeight: number
}
