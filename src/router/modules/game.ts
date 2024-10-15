import type { RouteRecordRaw } from "vue-router"

export const gameRouter: RouteRecordRaw[] = [
	{
		path: "/game",
		name: "游戏",
		redirect: "/game/shape",
		children: [
			{
				path: "/game/shape",
				name: "羊了个羊",
				component: () => import("@/views/game/Sheep.vue")
			}
		]
	}
]
