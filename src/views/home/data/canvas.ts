import type { IList } from "./types"

export const canvasList: IList[] = [
	{
		title: "canvas",
		index: 2,
		children: [
			{
				title: "konva",
				children: [
					{
						title: "形状",
						url: "/canvas/konva/shape",
						img: "canvas/konva/shape.jpg"
					},
					{
						title: "编辑器",
						url: "/canvas/konva/editor",
						img: "canvas/konva/editor.jpg"
					}
				]
			}
		]
	}
]
