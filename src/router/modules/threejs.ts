import type { RouteRecordRaw } from "vue-router"

export const threejsRouter: RouteRecordRaw[] = [
	{
		path: "/threejs",
		name: "threejs",
		redirect: "/threejs/base",
		children: [
			{
				path: "/threejs/base",
				name: "基本场景",
				component: () => import("@/views/threejs/base/Base.vue")
			},
			{
				path: "/threejs/move",
				name: "物体移动",
				component: () => import("@/views/threejs/base/Move.vue")
			},
			{
				path: "/threejs/clock",
				name: "时钟",
				component: () => import("@/views/threejs/base/Clock.vue")
			},
			{
				path: "/threejs/gsap",
				name: "Gsap",
				component: () => import("@/views/threejs/base/Gsap.vue")
			},
			{
				path: "/threejs/resize",
				name: "监听页面尺寸变化",
				component: () => import("@/views/threejs/base/Resize.vue")
			},
			{
				path: "/threejs/gui",
				name: "GUI",
				component: () => import("@/views/threejs/base/Gui.vue")
			},
			{
				path: "/threejs/orbitControls",
				name: "轨道控制器",
				component: () => import("@/views/threejs/controls/OrbitControls.vue")
			},
			{
				path: "/threejs/axesHelper",
				name: "坐标辅助器",
				component: () => import("@/views/threejs/helper/AxesHelper.vue")
			},
			{
				path: "/threejs/boxGeometry",
				name: "立方缓冲几何体",
				component: () => import("@/views/threejs/geometry/BoxGeometry.vue")
			},
			{
				path: "/threejs/coneGeometry",
				name: "圆锥缓冲几何体",
				component: () => import("@/views/threejs/geometry/ConeGeometry.vue")
			},
			{
				path: "/threejs/cylinderGeometry",
				name: "圆柱缓冲几何体",
				component: () => import("@/views/threejs/geometry/CylinderGeometry.vue")
			},
			{
				path: "/threejs/dodecahedronGeometry",
				name: "十二面缓冲几何体",
				component: () => import("@/views/threejs/geometry/DodecahedronGeometry.vue")
			},
			{
				path: "/threejs/edgesGeometry",
				name: "边缘几何体",
				component: () => import("@/views/threejs/geometry/EdgesGeometry.vue")
			},
			{
				path: "/threejs/extrudeGeometry",
				name: "挤压缓冲几何体",
				component: () => import("@/views/threejs/geometry/ExtrudeGeometry.vue")
			},
			{
				path: "/threejs/latheGeometry",
				name: "车削缓冲几何体",
				component: () => import("@/views/threejs/geometry/LatheGeometry.vue")
			},
			{
				path: "/threejs/octahedronGeometry",
				name: "八面缓冲几何体",
				component: () => import("@/views/threejs/geometry/OctahedronGeometry.vue")
			},
			{
				path: "/threejs/planeGeometry",
				name: "平面缓冲几何体",
				component: () => import("@/views/threejs/geometry/PlaneGeometry.vue")
			},
			{
				path: "/threejs/polyhedronGeometry",
				name: "多面缓冲几何体",
				component: () => import("@/views/threejs/geometry/PolyhedronGeometry.vue")
			},
			{
				path: "/threejs/ringGeometry",
				name: "圆环缓冲几何体",
				component: () => import("@/views/threejs/geometry/RingGeometry.vue")
			},
			{
				path: "/threejs/shapeGeometry",
				name: "形状缓冲几何体",
				component: () => import("@/views/threejs/geometry/ShapeGeometry.vue")
			},
			{
				path: "/threejs/sphereGeometry",
				name: "球缓冲几何体",
				component: () => import("@/views/threejs/geometry/SphereGeometry.vue")
			},
			{
				path: "/threejs/tetrahedronGeometry",
				name: "四面缓冲几何体",
				component: () => import("@/views/threejs/geometry/TetrahedronGeometry.vue")
			},
			{
				path: "/threejs/torusGeometry",
				name: "圆环缓冲几何体",
				component: () => import("@/views/threejs/geometry/TorusGeometry.vue")
			},
			{
				path: "/threejs/torusKnotGeometry",
				name: "圆环缓冲扭结几何体",
				component: () => import("@/views/threejs/geometry/TorusKnotGeometry.vue")
			},
			{
				path: "/threejs/tubeGeometry",
				name: "管道缓冲几何体",
				component: () => import("@/views/threejs/geometry/TubeGeometry.vue")
			},
			{
				path: "/threejs/wireframeGeometry",
				name: "网格几何体",
				component: () => import("@/views/threejs/geometry/WireframeGeometry.vue")
			},
			{
				path: "/threejs/convexGeometry",
				name: "凸包几何体",
				component: () => import("@/views/threejs/geometry/ConvexGeometry.vue")
			}
		]
	}
]
