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
				component: () => import("@/views/game/sheep/Sheep.vue")
			},
			{
				path: "/game/minesweeper",
				name: "扫雷",
				component: () => import("@/views/game/minesweeper/Minesweeper.vue")
			},
			{
				path: "/game/jump",
				name: "跳一跳",
				component: () => import("@/views/game/jump/Jump.vue")
			}
		]
	}
]
