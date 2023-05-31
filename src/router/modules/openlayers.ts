import type { RouteRecordRaw } from "vue-router"

export const openlayersRouter: RouteRecordRaw[] = [
	{
		path: "/openlayers",
		name: "openlayers",
		redirect: "/openlayers/base/map",
		children: [
			{
				path: "/openlayers/base/map",
				name: "形状",
				component: () => import("@/views/openlayers/base/Map.vue")
			},
			{
				path: "/openlayers/controls/controls",
				name: "地图控件",
				component: () => import("@/views/openlayers/controls/Controls.vue")
			}
		]
	}
]
