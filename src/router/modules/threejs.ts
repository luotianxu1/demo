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
				redirect: "/threejs/base/scene",
				children: [
					{
						path: "/threejs/base/scene",
						name: "基本场景",
						component: () => import("@/views/threejs/base/Base.vue")
					},
					{
						path: "/threejs/base/move",
						name: "物体移动",
						component: () => import("@/views/threejs/base/Move.vue")
					},
					{
						path: "/threejs/base/clock",
						name: "时钟",
						component: () => import("@/views/threejs/base/Clock.vue")
					},
					{
						path: "/threejs/base/gsap",
						name: "Gsap",
						component: () => import("@/views/threejs/base/Gsap.vue")
					},
					{
						path: "/threejs/base/tween",
						name: "Tween",
						component: () => import("@/views/threejs/base/Tween.vue")
					},
					{
						path: "/threejs/base/resize",
						name: "监听页面尺寸变化",
						component: () => import("@/views/threejs/base/Resize.vue")
					},
					{
						path: "/threejs/base/raycaster",
						name: "射线检测",
						component: () => import("@/views/threejs/base/Raycaster.vue")
					}
				]
			},
			{
				path: "/threejs/controls",
				name: "控制器",
				redirect: "/threejs/controls/orbitControls",
				children: [
					{
						path: "/threejs/controls/orbitControls",
						name: "轨道控制器",
						component: () => import("@/views/threejs/controls/OrbitControls.vue")
					}
				]
			},
			{
				path: "/threejs/helper",
				name: "辅助对象",
				redirect: "/threejs/helper/vertexNormalsHelper",
				children: [
					{
						path: "/threejs/helper/vertexNormalsHelper",
						name: "顶点法线辅助器",
						component: () => import("@/views/threejs/helper/VertexNormalsHelper.vue")
					},
					{
						path: "/threejs/helper/boxHelper",
						name: "包围盒辅助器",
						component: () => import("@/views/threejs/helper/BoxHelper.vue")
					}
				]
			},
			{
				path: "/threejs/camera",
				name: "相机",
				redirect: "/threejs/camera/cubeCamera",
				children: [
					{
						path: "/threejs/camera/cubeCamera",
						name: "立方相机",
						component: () => import("@/views/threejs/camera/CubeCamera.vue")
					},
					{
						path: "/threejs/camera/arrayCamera",
						name: "摄像机阵列",
						component: () => import("@/views/threejs/camera/ArrayCamera.vue")
					},
					{
						path: "/threejs/camera/changeCameraType",
						name: "更换相机",
						component: () => import("@/views/threejs/camera/ChangeCameraType.vue")
					}
				]
			},
			{
				path: "/threejs/geometry",
				name: "几何体",
				redirect: "/threejs/geometry/boxGeometry",
				children: [
					{
						path: "/threejs/geometry/boxGeometry",
						name: "立方缓冲几何体",
						component: () => import("@/views/threejs/geometry/BoxGeometry.vue")
					},
					{
						path: "/threejs/geometry/circleGeometry",
						name: "圆形缓冲几何体",
						component: () => import("@/views/threejs/geometry/CircleGeometry.vue")
					},
					{
						path: "/threejs/geometry/coneGeometry",
						name: "圆锥缓冲几何体",
						component: () => import("@/views/threejs/geometry/ConeGeometry.vue")
					},
					{
						path: "/threejs/geometry/cylinderGeometry",
						name: "圆柱缓冲几何体",
						component: () => import("@/views/threejs/geometry/CylinderGeometry.vue")
					},
					{
						path: "/threejs/geometry/dodecahedronGeometry",
						name: "十二面缓冲几何体",
						component: () => import("@/views/threejs/geometry/DodecahedronGeometry.vue")
					},
					{
						path: "/threejs/geometry/edgesGeometry",
						name: "边缘几何体",
						component: () => import("@/views/threejs/geometry/EdgesGeometry.vue")
					},
					{
						path: "/threejs/geometry/icosahedronGeometry",
						name: "二十面缓冲几何体",
						component: () => import("@/views/threejs/geometry/IcosahedronGeometry.vue")
					},
					{
						path: "/threejs/geometry/extrudeGeometry",
						name: "挤压缓冲几何体",
						component: () => import("@/views/threejs/geometry/ExtrudeGeometry.vue")
					},
					{
						path: "/threejs/geometry/latheGeometry",
						name: "车削缓冲几何体",
						component: () => import("@/views/threejs/geometry/LatheGeometry.vue")
					},
					{
						path: "/threejs/geometry/octahedronGeometry",
						name: "八面缓冲几何体",
						component: () => import("@/views/threejs/geometry/OctahedronGeometry.vue")
					},
					{
						path: "/threejs/geometry/planeGeometry",
						name: "平面缓冲几何体",
						component: () => import("@/views/threejs/geometry/PlaneGeometry.vue")
					},
					{
						path: "/threejs/geometry/ringGeometry",
						name: "圆环缓冲几何体",
						component: () => import("@/views/threejs/geometry/RingGeometry.vue")
					},
					{
						path: "/threejs/geometry/shapeGeometry",
						name: "形状缓冲几何体",
						component: () => import("@/views/threejs/geometry/ShapeGeometry.vue")
					},
					{
						path: "/threejs/geometry/sphereGeometry",
						name: "球缓冲几何体",
						component: () => import("@/views/threejs/geometry/SphereGeometry.vue")
					},
					{
						path: "/threejs/geometry/tetrahedronGeometry",
						name: "四面缓冲几何体",
						component: () => import("@/views/threejs/geometry/TetrahedronGeometry.vue")
					},
					{
						path: "/threejs/geometry/torusGeometry",
						name: "圆环缓冲几何体(TorusGeometry)",
						component: () => import("@/views/threejs/geometry/TorusGeometry.vue")
					},
					{
						path: "/threejs/geometry/torusKnotGeometry",
						name: "圆环缓冲扭结几何体",
						component: () => import("@/views/threejs/geometry/TorusKnotGeometry.vue")
					},
					{
						path: "/threejs/geometry/tubeGeometry",
						name: "管道缓冲几何体",
						component: () => import("@/views/threejs/geometry/TubeGeometry.vue")
					},
					{
						path: "/threejs/geometry/wireframeGeometry",
						name: "网格几何体",
						component: () => import("@/views/threejs/geometry/WireframeGeometry.vue")
					},
					{
						path: "/threejs/geometry/convexGeometry",
						name: "凸包几何体",
						component: () => import("@/views/threejs/geometry/ConvexGeometry.vue")
					},
					{
						path: "/threejs/geometry/catmullRomCurve3",
						name: "曲线",
						component: () => import("@/views/threejs/geometry/CatmullRomCurve3.vue")
					}
				]
			},
			{
				path: "/threejs/light",
				name: "灯光",
				redirect: "/threejs/light/ambientLight",
				children: [
					{
						path: "/threejs/light/ambientLight",
						name: "环境光",
						component: () => import("@/views/threejs/light/AmbientLight.vue")
					},
					{
						path: "/threejs/light/directionalLight",
						name: "平行光",
						component: () => import("@/views/threejs/light/DirectionalLight.vue")
					},
					{
						path: "/threejs/light/hemisphereLight",
						name: "半球光",
						component: () => import("@/views/threejs/light/HemisphereLight.vue")
					},
					{
						path: "/threejs/light/pointLight",
						name: "点光源",
						component: () => import("@/views/threejs/light/PointLight.vue")
					},
					{
						path: "/threejs/light/spotLight",
						name: "聚光灯",
						component: () => import("@/views/threejs/light/SpotLight.vue")
					},
					{
						path: "/threejs/light/rectAreaLight",
						name: "平面光光源",
						component: () => import("@/views/threejs/light/RectAreaLight.vue")
					},
					{
						path: "/threejs/light/shadow",
						name: "灯光与阴影",
						component: () => import("@/views/threejs/light/Shadow.vue")
					}
				]
			},
			{
				path: "/threejs/material",
				name: "材质",
				redirect: "/threejs/material/lineBasicMaterial",
				children: [
					{
						path: "/threejs/material/lineBasicMaterial",
						name: "基础线条材质",
						component: () => import("@/views/threejs/material/LineBasicMaterial.vue")
					},
					{
						path: "/threejs/material/lineDashedMaterial",
						name: "虚线材质",
						component: () => import("@/views/threejs/material/LineDashedMaterial.vue")
					},
					{
						path: "/threejs/material/meshBasicMaterial",
						name: "网格基础材质",
						component: () => import("@/views/threejs/material/MeshBasicMaterial.vue")
					},
					{
						path: "/threejs/material/meshDepthMaterial",
						name: "深度网格材质",
						component: () => import("@/views/threejs/material/MeshDepthMaterial.vue")
					},
					{
						path: "/threejs/material/meshLambertMaterial",
						name: "Lambert网格材质",
						component: () => import("@/views/threejs/material/MeshLambertMaterial.vue")
					},
					{
						path: "/threejs/material/meshNormalMaterial",
						name: "法线网格材质",
						component: () => import("@/views/threejs/material/MeshNormalMaterial.vue")
					},
					{
						path: "/threejs/material/meshPhongMaterial",
						name: "Phong网格材质",
						component: () => import("@/views/threejs/material/MeshPhongMaterial.vue")
					},
					{
						path: "/threejs/material/meshPhysicalMaterial",
						name: "物理网格材质",
						component: () => import("@/views/threejs/material/MeshPhysicalMaterial.vue")
					},
					{
						path: "/threejs/material/meshStandardMaterial",
						name: "标准网格材质",
						component: () => import("@/views/threejs/material/MeshStandardMaterial.vue")
					},
					{
						path: "/threejs/material/spriteMaterial",
						name: "点精灵材质",
						component: () => import("@/views/threejs/material/SpriteMaterial.vue")
					},
					{
						path: "/threejs/material/pointsMaterial",
						name: "点材质",
						component: () => import("@/views/threejs/material/PointsMaterial.vue")
					}
				]
			},
			{
				path: "/threejs/texture",
				name: "贴图与纹理",
				redirect: "/threejs/texture/minFilter",
				children: [
					{
						path: "/threejs/texture/minFilter",
						name: "MinFilter",
						component: () => import("@/views/threejs/texture/MinFilter.vue")
					},
					{
						path: "/threejs/texture/bump",
						name: "凹凸贴图",
						component: () => import("@/views/threejs/texture/Bump.vue")
					},
					{
						path: "/threejs/texture/normal",
						name: "法向贴图",
						component: () => import("@/views/threejs/texture/Normal.vue")
					},
					{
						path: "/threejs/texture/displacement",
						name: "位移贴图",
						component: () => import("@/views/threejs/texture/Displacement.vue")
					},
					{
						path: "/threejs/texture/setalness",
						name: "光泽度贴图",
						component: () => import("@/views/threejs/texture/Setalness.vue")
					},
					{
						path: "/threejs/texture/alpha",
						name: "透明度贴图",
						component: () => import("@/views/threejs/texture/Alpha.vue")
					},
					{
						path: "/threejs/texture/emissive",
						name: "自发光贴图",
						component: () => import("@/views/threejs/texture/Emissive.vue")
					},
					{
						path: "/threejs/texture/specular",
						name: "高光贴图",
						component: () => import("@/views/threejs/texture/Specular.vue")
					},
					{
						path: "/threejs/texture/env",
						name: "环境贴图",
						component: () => import("@/views/threejs/texture/Env.vue")
					},
					{
						path: "/threejs/texture/hdr",
						name: "hdr",
						component: () => import("@/views/threejs/texture/Hdr.vue")
					},
					{
						path: "/threejs/texture/video",
						name: "视频纹理",
						component: () => import("@/views/threejs/texture/Video.vue")
					},
					{
						path: "/threejs/texture/canvas",
						name: "Canvas纹理",
						component: () => import("@/views/threejs/texture/Canvas.vue")
					},
					{
						path: "/threejs/texture/videoText",
						name: "视频添加文字",
						component: () => import("@/views/threejs/texture/VideoText.vue")
					}
				]
			},
			{
				path: "/threejs/animation",
				name: "动画",
				redirect: "/threejs/animation/animation",
				children: [
					{
						path: "/threejs/animation/animation",
						name: "动画",
						component: () => import("@/views/threejs/animation/Animation.vue")
					}
				]
			},
			{
				path: "/threejs/render",
				name: "渲染器",
				redirect: "/threejs/render/css2DRender",
				children: [
					{
						path: "/threejs/render/css2DRender",
						name: "CSS2DRender",
						component: () => import("@/views/threejs/render/CSS2DRender.vue")
					}
				]
			},
			{
				path: "/threejs/shader",
				name: "Shader",
				redirect: "/threejs/shader/rowShaderMaterial",
				children: [
					{
						path: "/threejs/shader/rowShaderMaterial",
						name: "rowShaderMaterial",
						component: () => import("@/views/threejs/shader/rowShaderMaterial/index.vue")
					},
					{
						path: "/threejs/shader/pattern",
						name: "pattern",
						component: () => import("@/views/threejs/shader/pattern/index.vue")
					},
					{
						path: "/threejs/shader/water",
						name: "烟水雾",
						component: () => import("@/views/threejs/shader/water/index.vue")
					},
					{
						path: "/threejs/shader/water2",
						name: "水",
						component: () => import("@/views/threejs/shader/water2/index.vue")
					},
					{
						path: "/threejs/shader/point",
						name: "点",
						component: () => import("@/views/threejs/shader/point/index.vue")
					}
				]
			},
			{
				path: "/threejs/effect",
				name: "效果合成",
				redirect: "/threejs/effect/click",
				children: [
					{
						path: "/threejs/effect/click",
						name: "点击效果",
						component: () => import("@/views/threejs/effect/Click.vue")
					}
				]
			},
			{
				path: "/threejs/module",
				name: "组件",
				redirect: "/threejs/module/lightWall",
				children: [
					{
						path: "/threejs/module/lightWall",
						name: "光墙",
						component: () => import("@/views/threejs/module/LightWall.vue")
					},
					{
						path: "/threejs/module/lightRadar",
						name: "雷达",
						component: () => import("@/views/threejs/module/LightRadar.vue")
					},
					{
						path: "/threejs/module/meshLine",
						name: "线框",
						component: () => import("@/views/threejs/module/MeshLine.vue")
					},
					{
						path: "/threejs/module/flyLineTexture",
						name: "飞线(贴图)",
						component: () => import("@/views/threejs/module/FlyLineTexture.vue")
					},
					{
						path: "/threejs/module/spriteIcon",
						name: "图标",
						component: () => import("@/views/threejs/module/SpriteIcon.vue")
					}
				]
			},
			{
				path: "/threejs/other",
				name: "其他",
				redirect: "/threejs/other/octree",
				children: [
					{
						path: "/threejs/other/octree",
						name: "八叉树检测",
						component: () => import("@/views/threejs/other/Octree.vue")
					},
					{
						path: "/threejs/other/lod",
						name: "Lod",
						component: () => import("@/views/threejs/other/Lod.vue")
					},
					{
						path: "/threejs/other/changeCamera",
						name: "相机切换",
						component: () => import("@/views/threejs/other/ChangeCamera.vue")
					},
					{
						path: "/threejs/other/active",
						name: "动作切换",
						component: () => import("@/views/threejs/other/Active.vue")
					},
					{
						path: "/threejs/other/merge",
						name: "合并物体",
						component: () => import("@/views/threejs/other/Merge.vue")
					},
					{
						path: "/threejs/other/sound",
						name: "声音",
						component: () => import("@/views/threejs/other/Sound.vue")
					}
				]
			},
			{
				path: "/threejs/cannon",
				name: "物理引擎",
				redirect: "/threejs/cannon/cannonBase",
				children: [
					{
						path: "/threejs/cannon/cannonBase",
						name: "物理引擎基础",
						component: () => import("@/views/threejs/cannon/Base.vue")
					},
					{
						path: "/threejs/cannon/cannonMaterial",
						name: "摩擦与材质",
						component: () => import("@/views/threejs/cannon/Material.vue")
					},
					{
						path: "/threejs/cannon/collision",
						name: "碰撞与休眠",
						component: () => import("@/views/threejs/cannon/Collision.vue")
					},
					{
						path: "/threejs/cannon/combination",
						name: "形状组合",
						component: () => import("@/views/threejs/cannon/Combination.vue")
					},
					{
						path: "/threejs/cannon/cannonModel",
						name: "复杂模型",
						component: () => import("@/views/threejs/cannon/Model.vue")
					},
					{
						path: "/threejs/cannon/force",
						name: "力",
						component: () => import("@/views/threejs/cannon/Force.vue")
					},
					{
						path: "/threejs/cannon/lockConstraint",
						name: "LockConstraint物体约束",
						component: () => import("@/views/threejs/cannon/LockConstraint.vue")
					},
					{
						path: "/threejs/cannon/pointToPointConstraint",
						name: "PointToPointConstraint物体约束",
						component: () => import("@/views/threejs/cannon/PointToPointConstraint.vue")
					},
					{
						path: "/threejs/cannon/distanceConstraint",
						name: "DistanceConstraint距离约束",
						component: () => import("@/views/threejs/cannon/DistanceConstraint.vue")
					},
					{
						path: "/threejs/cannon/cloth",
						name: "布料模拟",
						component: () => import("@/views/threejs/cannon/Cloth.vue")
					},
					{
						path: "/threejs/cannon/springRestraint",
						name: "弹簧约束",
						component: () => import("@/views/threejs/cannon/SpringRestraint.vue")
					},
					{
						path: "/threejs/cannon/breakConstraint",
						name: "破坏约束",
						component: () => import("@/views/threejs/cannon/BreakConstraint.vue")
					},
					{
						path: "/threejs/cannon/fluid",
						name: "流体模拟",
						component: () => import("@/views/threejs/cannon/Fluid.vue")
					},
					{
						path: "/threejs/cannon/car1",
						name: "刚体车辆",
						component: () => import("@/views/threejs/cannon/Car1.vue")
					},
					{
						path: "/threejs/cannon/car2",
						name: "悬架车辆",
						component: () => import("@/views/threejs/cannon/Car2.vue")
					}
				]
			},
			{
				path: "/threejs/yuka",
				name: "路径规划",
				redirect: "/threejs/yuka/pathFollowing",
				children: [
					{
						path: "/threejs/yuka/pathFollowing",
						name: "路径跟随",
						component: () => import("@/views/threejs/yuka/PathFollowing.vue")
					},
					{
						path: "/threejs/yuka/obstacleAvoidance",
						name: "避障",
						component: () => import("@/views/threejs/yuka/ObstacleAvoidance.vue")
					},
					{
						path: "/threejs/yuka/escape",
						name: "逃离",
						component: () => import("@/views/threejs/yuka/Escape.vue")
					},
					{
						path: "/threejs/yuka/chase",
						name: "追击",
						component: () => import("@/views/threejs/yuka/Chase.vue")
					},
					{
						path: "/threejs/yuka/cluster",
						name: "集群",
						component: () => import("@/views/threejs/yuka/Cluster.vue")
					}
				]
			}
		]
	}
]
