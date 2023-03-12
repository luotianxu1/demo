export interface IFormItem {
	title: string
	url: string
	img: string
}

export interface IForm {
	title: string
	children: IFormItem[]
}

export interface IList {
	title: string
	index: number
	children: IForm[]
}

export const list: IList[] = [
	{
		title: "threejs",
		index: 0,
		children: [
			{
				title: "基础",
				children: [
					{
						title: "基本场景",
						url: "/threejs/base",
						img: "threejs/base/base.jpg"
					},
					{
						title: "物体移动",
						url: "/threejs/move",
						img: "threejs/base/move.jpg"
					},
					{
						title: "时钟",
						url: "/threejs/clock",
						img: "threejs/base/clock.jpg"
					},
					{
						title: "Gsap",
						url: "/threejs/gsap",
						img: "threejs/base/gsap.jpg"
					},
					{
						title: "监听页面尺寸变化",
						url: "/threejs/resize",
						img: "threejs/base/resize.jpg"
					},
					{
						title: "GUI",
						url: "/threejs/gui",
						img: "threejs/base/gui.jpg"
					}
				]
			},
			{
				title: "控制器",
				children: [
					{
						title: "轨道控制器",
						url: "/threejs/orbitControls",
						img: "threejs/controls/orbitControls.jpg"
					}
				]
			},
			{
				title: "辅助器",
				children: [
					{
						title: "坐标辅助器",
						url: "/threejs/axesHelper",
						img: "threejs/helper/axesHelper.jpg"
					}
				]
			},
			{
				title: "几何体",
				children: [
					{
						title: "立方缓冲几何体",
						url: "/threejs/boxGeometry",
						img: "threejs/geometry/boxGeometry.jpg"
					},
					{
						title: "圆形缓冲几何体",
						url: "/threejs/circleGeometry",
						img: "threejs/geometry/circleGeometry.jpg"
					},
					{
						title: "圆锥缓冲几何体",
						url: "/threejs/coneGeometry",
						img: "threejs/geometry/coneGeometry.jpg"
					},
					{
						title: "圆柱缓冲几何体",
						url: "/threejs/cylinderGeometry",
						img: "threejs/geometry/cylinderGeometry.jpg"
					},
					{
						title: "十二面缓冲几何体",
						url: "/threejs/dodecahedronGeometry",
						img: "threejs/geometry/dodecahedronGeometry.jpg"
					},
					{
						title: "边缘几何体",
						url: "/threejs/edgesGeometry",
						img: "threejs/geometry/edgesGeometry.jpg"
					},
					{
						title: "挤压缓冲几何体",
						url: "/threejs/extrudeGeometry",
						img: "threejs/geometry/extrudeGeometry.jpg"
					},
					{
						title: "二十面缓冲几何体",
						url: "/threejs/icosahedronGeometry",
						img: "threejs/geometry/icosahedronGeometry.jpg"
					},
					{
						title: "车削缓冲几何体",
						url: "/threejs/latheGeometry",
						img: "threejs/geometry/latheGeometry.jpg"
					},
					{
						title: "八面缓冲几何体",
						url: "/threejs/octahedronGeometry",
						img: "threejs/geometry/octahedronGeometry.jpg"
					},
					{
						title: "平面缓冲几何体",
						url: "/threejs/planeGeometry",
						img: "threejs/geometry/planeGeometry.jpg"
					},
					{
						title: "多面缓冲几何体",
						url: "/threejs/polyhedronGeometry",
						img: "threejs/geometry/polyhedronGeometry.jpg"
					},
					{
						title: "圆环缓冲几何体",
						url: "/threejs/ringGeometry",
						img: "threejs/geometry/ringGeometry.jpg"
					},
					{
						title: "形状缓冲几何体",
						url: "/threejs/shapeGeometry",
						img: "threejs/geometry/shapeGeometry.jpg"
					},
					{
						title: "球缓冲几何体",
						url: "/threejs/sphereGeometry",
						img: "threejs/geometry/sphereGeometry.jpg"
					},
					{
						title: "四面缓冲几何体",
						url: "/threejs/tetrahedronGeometry",
						img: "threejs/geometry/tetrahedronGeometry.jpg"
					},
					{
						title: "圆环缓冲几何体",
						url: "/threejs/torusGeometry",
						img: "threejs/geometry/torusGeometry.jpg"
					},
					{
						title: "圆环缓冲扭结几何体",
						url: "/threejs/torusKnotGeometry",
						img: "threejs/geometry/torusKnotGeometry.jpg"
					},
					{
						title: "管道缓冲几何体",
						url: "/threejs/tubeGeometry",
						img: "threejs/geometry/tubeGeometry.jpg"
					},
					{
						title: "网格几何体",
						url: "/threejs/wireframeGeometry",
						img: "threejs/geometry/wireframeGeometry.jpg"
					},
					{
						title: "凸包几何体",
						url: "/threejs/convexGeometry",
						img: "threejs/geometry/convexGeometry.jpg"
					},
					{
						title: "BufferGeometry",
						url: "/threejs/bufferGeometry",
						img: "threejs/geometry/bufferGeometry.jpg"
					}
				]
			},
			{
				title: "材质",
				children: [
					{
						title: "基础线条材质",
						url: "/threejs/lineBasicMaterial",
						img: "threejs/material/lineBasicMaterial.jpg"
					},
					{
						title: "虚线材质",
						url: "/threejs/lineDashedMaterial",
						img: "threejs/material/lineDashedMaterial.jpg"
					},
					{
						title: "网格基础材质",
						url: "/threejs/meshBasicMaterial",
						img: "threejs/material/meshBasicMaterial.jpg"
					},
					{
						title: "深度网格材质",
						url: "/threejs/meshDepthMaterial",
						img: "threejs/material/meshDepthMaterial.jpg"
					},
					{
						title: "Lambert网格材质",
						url: "/threejs/meshLambertMaterial",
						img: "threejs/material/meshLambertMaterial.jpg"
					},
					{
						title: "法线网格材质",
						url: "/threejs/meshNormalMaterial",
						img: "threejs/material/meshNormalMaterial.jpg"
					}
				]
			}
		]
	},
	{
		title: "leaflet",
		index: 1,
		children: []
	}
]
