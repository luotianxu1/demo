import type { RouteRecordRaw } from "vue-router"

export const canvasRouter: RouteRecordRaw[] = [
	{
		path: "/canvas",
		name: "canvas",
		redirect: "/canvas/konva/shape",
		children: [
			{
				path: "/canvas/konva/shape",
				name: "形状",
				component: () => import("@/views/canvas/konva/shape/Shape.vue")
			},
			{
				path: "/canvas/konva/editor",
				name: "编辑器",
				component: () => import("@/views/canvas/konva/editor/index.vue")
			}
		]
	}
]
