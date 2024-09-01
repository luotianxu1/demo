import type { RouteRecordRaw } from "vue-router"

export const elementRouter: RouteRecordRaw[] = [
	{
		path: "/element",
		name: "element",
		redirect: "/element/message",
		children: [
			{
				path: "/element/message",
				name: "消息",
				component: () => import("@/views/element/message/Message.vue")
			},
			{
				path: "/element/virtualList",
				name: "虚拟列表",
				component: () => import("@/views/element/virtualList/virtualList.vue")
			}
		]
	}
]
