import type { RouteRecordRaw } from "vue-router"

export const threejsDemoRouter: RouteRecordRaw[] = [
	{
		path: "/threejsDemo",
		name: "threejsDemo",
		redirect: "/threejs/base",
		children: [
			{
				path: "/threejsDemo/website",
				name: "3D官网",
				component: () => import("@/views/threejsDemo/website/index.vue")
			},
			{
				path: "/threejsDemo/houseViewing",
				name: "全景看房",
				component: () => import("@/views/threejsDemo/houseViewing/index.vue")
			},
			{
				path: "/threejsDemo/room",
				name: "全景看房（户型图）",
				component: () => import("@/views/threejsDemo/room/index.vue")
			},
			{
				path: "/threejsDemo/fireworks",
				name: "烟花",
				component: () => import("@/views/threejsDemo/firework/index.vue")
			},
			{
				path: "/threejsDemo/smartCity",
				name: "智慧城市",
				component: () => import("@/views/threejsDemo/smartCity/index.vue")
			},
			{
				path: "/threejsDemo/smartFactory",
				name: "智慧园区",
				component: () => import("@/views/threejsDemo/smartFactory/index.vue")
			},
			{
				path: "/threejsDemo/hotel",
				name: "日夜交替",
				component: () => import("@/views/threejsDemo/hotel/Hotel.vue")
			}
		]
	}
]
