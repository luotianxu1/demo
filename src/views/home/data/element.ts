import type { IList } from "./types"

export const elementList: IList[] = [
	{
		title: "element",
		index: 7,
		children: [
			{
				title: "message",
				children: [
					{
						title: "Message",
						url: "/element/message",
						img: "element/message.jpg"
					},
					{
						title: "定高虚拟列表",
						url: "/element/virtualList",
						img: "element/virtualList.jpg"
					}
				]
			}
		]
	}
]
