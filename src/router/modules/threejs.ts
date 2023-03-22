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
				path: "/threejs/mergeBufferGeometries",
				name: "合并网络",
				component: () => import("@/views/threejs/base/MergeBufferGeometries.vue")
			},
			{
				path: "/threejs/raycaster",
				name: "射线检测",
				component: () => import("@/views/threejs/base/Raycaster.vue")
			},
			{
				path: "/threejs/orbitControls",
				name: "轨道控制器",
				component: () => import("@/views/threejs/controls/OrbitControls.vue")
			},
			{
				path: "/threejs/boxGeometry",
				name: "立方缓冲几何体",
				component: () => import("@/views/threejs/geometry/BoxGeometry.vue")
			},
			{
				path: "/threejs/circleGeometry",
				name: "圆形缓冲几何体",
				component: () => import("@/views/threejs/geometry/CircleGeometry.vue")
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
				path: "/threejs/icosahedronGeometry",
				name: "二十面缓冲几何体",
				component: () => import("@/views/threejs/geometry/IcosahedronGeometry.vue")
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
				name: "圆环缓冲几何体(TorusGeometry)",
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
			},
			{
				path: "/threejs/catmullRomCurve3",
				name: "曲线",
				component: () => import("@/views/threejs/geometry/CatmullRomCurve3.vue")
			},
			{
				path: "/threejs/lineBasicMaterial",
				name: "基础线条材质",
				component: () => import("@/views/threejs/material/LineBasicMaterial.vue")
			},
			{
				path: "/threejs/lineDashedMaterial",
				name: "虚线材质",
				component: () => import("@/views/threejs/material/LineDashedMaterial.vue")
			},
			{
				path: "/threejs/meshBasicMaterial",
				name: "网格基础材质",
				component: () => import("@/views/threejs/material/MeshBasicMaterial.vue")
			},
			{
				path: "/threejs/meshDepthMaterial",
				name: "深度网格材质",
				component: () => import("@/views/threejs/material/MeshDepthMaterial.vue")
			},
			{
				path: "/threejs/meshLambertMaterial",
				name: "Lambert网格材质",
				component: () => import("@/views/threejs/material/MeshLambertMaterial.vue")
			},
			{
				path: "/threejs/meshNormalMaterial",
				name: "法线网格材质",
				component: () => import("@/views/threejs/material/MeshNormalMaterial.vue")
			},
			{
				path: "/threejs/meshPhongMaterial",
				name: "Phong网格材质",
				component: () => import("@/views/threejs/material/MeshPhongMaterial.vue")
			},
			{
				path: "/threejs/meshPhysicalMaterial",
				name: "物理网格材质",
				component: () => import("@/views/threejs/material/MeshPhysicalMaterial.vue")
			},
			{
				path: "/threejs/meshStandardMaterial",
				name: "标准网格材质",
				component: () => import("@/views/threejs/material/MeshStandardMaterial.vue")
			},
			{
				path: "/threejs/spriteMaterial",
				name: "点精灵材质",
				component: () => import("@/views/threejs/material/SpriteMaterial.vue")
			},
			{
				path: "/threejs/pointsMaterial",
				name: "点材质",
				component: () => import("@/views/threejs/material/PointsMaterial.vue")
			},
			{
				path: "/threejs/minFilter",
				name: "MinFilter",
				component: () => import("@/views/threejs/texture/MinFilter.vue")
			},
			{
				path: "/threejs/bump",
				name: "凹凸贴图",
				component: () => import("@/views/threejs/texture/Bump.vue")
			},
			{
				path: "/threejs/normal",
				name: "法向贴图",
				component: () => import("@/views/threejs/texture/Normal.vue")
			},
			{
				path: "/threejs/displacement",
				name: "位移贴图",
				component: () => import("@/views/threejs/texture/Displacement.vue")
			},
			{
				path: "/threejs/setalness",
				name: "光泽度贴图",
				component: () => import("@/views/threejs/texture/Setalness.vue")
			},
			{
				path: "/threejs/alpha",
				name: "透明度贴图",
				component: () => import("@/views/threejs/texture/Alpha.vue")
			},
			{
				path: "/threejs/emissive",
				name: "自发光贴图",
				component: () => import("@/views/threejs/texture/Emissive.vue")
			},
			{
				path: "/threejs/specular",
				name: "高光贴图",
				component: () => import("@/views/threejs/texture/Specular.vue")
			},
			{
				path: "/threejs/env",
				name: "环境贴图",
				component: () => import("@/views/threejs/texture/Env.vue")
			},
			{
				path: "/threejs/hdr",
				name: "hdr",
				component: () => import("@/views/threejs/texture/Hdr.vue")
			},
			{
				path: "/threejs/video",
				name: "视频纹理",
				component: () => import("@/views/threejs/texture/Video.vue")
			},
			{
				path: "/threejs/canvas",
				name: "Canvas纹理",
				component: () => import("@/views/threejs/texture/Canvas.vue")
			},
			{
				path: "/threejs/ambientLight",
				name: "环境光",
				component: () => import("@/views/threejs/light/AmbientLight.vue")
			},
			{
				path: "/threejs/directionalLight",
				name: "平行光",
				component: () => import("@/views/threejs/light/DirectionalLight.vue")
			},
			{
				path: "/threejs/hemisphereLight",
				name: "半球光",
				component: () => import("@/views/threejs/light/HemisphereLight.vue")
			},
			{
				path: "/threejs/pointLight",
				name: "点光源",
				component: () => import("@/views/threejs/light/PointLight.vue")
			},
			{
				path: "/threejs/spotLight",
				name: "聚光灯",
				component: () => import("@/views/threejs/light/SpotLight.vue")
			},
			{
				path: "/threejs/rectAreaLight",
				name: "平面光光源",
				component: () => import("@/views/threejs/light/RectAreaLight.vue")
			},
			{
				path: "/threejs/shadow",
				name: "灯光与阴影",
				component: () => import("@/views/threejs/light/Shadow.vue")
			},
			{
				path: "/threejs/animation",
				name: "动画",
				component: () => import("@/views/threejs/animation/Animation.vue")
			},
			{
				path: "/threejs/cubeCamera",
				name: "立方相机",
				component: () => import("@/views/threejs/camera/CubeCamera.vue")
			},
			{
				path: "/threejs/arrayCamera",
				name: "摄像机阵列",
				component: () => import("@/views/threejs/camera/ArrayCamera.vue")
			},
			{
				path: "/threejs/css2DRender",
				name: "CSS2DRender",
				component: () => import("@/views/threejs/render/CSS2DRender.vue")
			},
			{
				path: "/threejs/rowShaderMaterial",
				name: "rowShaderMaterial",
				component: () => import("@/views/threejs/shader/rowShaderMaterial/index.vue")
			},
			{
				path: "/threejs/pattern",
				name: "pattern",
				component: () => import("@/views/threejs/shader/pattern/index.vue")
			}
		]
	}
]
