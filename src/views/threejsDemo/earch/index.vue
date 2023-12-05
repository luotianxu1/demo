<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import fragmentShader from "./shaders/earth/fragment.glsl?raw"
import vertexShader from "./shaders/earth/vertex.glsl?raw"
import { createAnimateLine, flyArc, createPointMesh, createLightPillar, createWaveMesh } from "./utils/utils"
import data from "./data/data"
import { gsap } from "gsap"
import { getCirclePoints, lon2xyz } from "@/utils/three/utils"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let group: THREE.Group
let earthGroup: THREE.Group
let starGroup: THREE.Group
let flyLineGroup: THREE.Group
let markupPointGroup: THREE.Group
const radius = 50
let earchUniforms
let timeValue = 100

const circleLineList = []
const flyLineList = []
const waveMeshArr = []
const lines = []
// 炫光粒子 透明度
let opacitys: any = []

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value, {
		render: {
			antialias: true,
			alpha: true
		},
		loading: {
			show: true,
			html: true,
			callback: () => {
				show()
			}
		}
	})
	web.createPerspectiveCamera(5, -20, 200, 45, "earchCamera")
	web.switchCamera("earchCamera")
	web.scene.background = new THREE.Color(0x020924)
	web.scene.fog = new THREE.Fog(0x020924, 200, 1000)

	web.orbitControls.enableDamping = true
	web.orbitControls.enableZoom = true
	web.orbitControls.autoRotate = false
	web.orbitControls.autoRotateSpeed = 2
	web.orbitControls.enablePan = true

	web.addAmbientLight(0xcccccc, 1.1)
	web.addDirectionalLight(1, 0.1, 0, 0xffffff, 0.2)
	web.addDirectionalLight(1, 0.1, 0.1, 0xff2ffff, 0.2)
	const hemiLight = web.addHemisphereLight(0xffffff, 0x444444, 0.2)
	hemiLight.position.set(0, 1, 0)
	const directionalLight = web.addDirectionalLight(1, 500, -20, 0xffffff)
	directionalLight.position.set(1, 500, -20)
	directionalLight.castShadow = true
	directionalLight.shadow.camera.top = 18
	directionalLight.shadow.camera.bottom = -10
	directionalLight.shadow.camera.left = -52
	directionalLight.shadow.camera.right = 12

	web.addAxesHelper()

	group = new THREE.Group()
	group.scale.set(0, 0, 0)
	web.scene.add(group)
	earthGroup = new THREE.Group()
	group.add(earthGroup)
	markupPointGroup = new THREE.Group()

	createStars() // 添加星星
	createEarth() // 创建地球
	createEarthGlow() // 创建地球辉光
	createAnimateCircle() // 创建环绕卫星
	createFlyLine() // 创建飞线
	createMarkupPoint() // 创建柱状点位
	createSpriteLabel() // 城市名称
	loadMap()

	renderScene()
}

const show = () => {
	gsap.to(group.scale, {
		x: 1,
		y: 1,
		z: 1,
		duration: 2,
		ease: "Quadratic"
	})
}

const createStars = () => {
	starGroup = new THREE.Group()
	const vertices = []
	const colors = []
	for (let i = 0; i < 500; i++) {
		const vertex = new THREE.Vector3()
		vertex.x = 800 * Math.random() - 300
		vertex.y = 800 * Math.random() - 300
		vertex.z = 800 * Math.random() - 300
		vertices.push(vertex.x, vertex.y, vertex.z)
		colors.push(new THREE.Color(1, 1, 1))
	}

	// 星空效果
	const around = new THREE.BufferGeometry()
	around.setAttribute("position", new THREE.BufferAttribute(new Float32Array(vertices), 3))
	around.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3))

	web.loaderMap("/threejsDemo/earth/gradient.png").then(texture => {
		const aroundMaterial = new THREE.PointsMaterial({
			size: 2,
			sizeAttenuation: true, // 尺寸衰减
			color: 0x4d76cf,
			transparent: true,
			opacity: 1,
			map: texture
		})

		const aroundPoints = new THREE.Points(around, aroundMaterial)
		aroundPoints.name = "星空"
		aroundPoints.scale.set(1, 1, 1)
		starGroup.add(aroundPoints)
		group.add(starGroup)
	})
}

const createEarth = () => {
	web.loaderMap("/threejsDemo/earth/earth.jpg").then(texture => {
		earchUniforms = {
			glowColor: {
				value: new THREE.Color(0x0cd1eb)
			},
			scale: {
				value: -1.0
			},
			bias: {
				value: 1.0
			},
			power: {
				value: 3.3
			},
			time: {
				value: timeValue
			},
			isHover: {
				value: false
			},
			map: {
				value: texture
			}
		}
		const earth_material = new THREE.ShaderMaterial({
			uniforms: earchUniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		})
		earth_material.needsUpdate = true
		const earth_geometry = new THREE.SphereGeometry(radius, 50, 50)
		const earth = new THREE.Mesh(earth_geometry, earth_material)
		earth.name = "earth"
		earthGroup.add(earth)
	})

	const earth_border = new THREE.SphereGeometry(radius + 10, 60, 60)
	const pointMaterial = new THREE.PointsMaterial({
		color: 0x81ffff, //设置颜色，默认 0xFFFFFF
		transparent: true,
		sizeAttenuation: true,
		opacity: 0.1,
		vertexColors: false, //定义材料是否使用顶点颜色，默认false ---如果该选项设置为true，则color属性失效
		size: 0.01 //定义粒子的大小。默认为1.0
	})
	const points = new THREE.Points(earth_border, pointMaterial) //将模型添加到场景
	earthGroup.add(points)
}

const createEarthGlow = () => {
	web.loaderMap("/threejsDemo/earth/glow.png").then(texture => {
		// 创建精灵材质对象SpriteMaterial
		const spriteMaterial = new THREE.SpriteMaterial({
			map: texture, // 设置精灵纹理贴图
			color: 0x4390d1,
			transparent: true, //开启透明
			opacity: 0.7, // 可以通过透明度整体调节光圈
			depthWrite: false //禁止写入深度缓冲区数据
		})

		const sprite = new THREE.Sprite(spriteMaterial)
		sprite.scale.set(radius * 3.0, radius * 3.0, 1)
		earthGroup.add(sprite)
	})
}

const createAnimateCircle = () => {
	// 创建 圆环 点
	const list = getCirclePoints({
		radius: radius + 15,
		number: 150, //切割数
		closed: true // 闭合
	})
	const mat = new THREE.MeshBasicMaterial({
		color: "#0c3172",
		transparent: true,
		opacity: 0.4,
		side: THREE.DoubleSide
	})
	const line = createAnimateLine({
		pointList: list,
		material: mat,
		number: 100,
		radius: 0.1
	})
	earthGroup.add(line)

	// 在clone两条线出来
	const l2 = line.clone()
	l2.scale.set(1.2, 1.2, 1.2)
	l2.rotateZ(Math.PI / 6)
	earthGroup.add(l2)

	const l3 = line.clone()
	l3.scale.set(0.8, 0.8, 0.8)
	l3.rotateZ(-Math.PI / 6)
	earthGroup.add(l3)

	// 球
	const ball = new THREE.Mesh(
		new THREE.SphereGeometry(1, 32, 32),
		new THREE.MeshBasicMaterial({
			color: "#e0b187" // 745F4D
		})
	)

	const ball2 = new THREE.Mesh(
		new THREE.SphereGeometry(1, 32, 32),
		new THREE.MeshBasicMaterial({
			color: "#628fbb" // 324A62
		})
	)

	const ball3 = new THREE.Mesh(
		new THREE.SphereGeometry(1, 32, 32),
		new THREE.MeshBasicMaterial({
			color: "#806bdf" //6D5AC4
		})
	)
	circleLineList.push(line, l2, l3)
	ball.name = ball2.name = ball3.name = "卫星"

	for (let i = 0; i < 2; i++) {
		const ball01 = ball.clone()
		// 一根线上总共有几个球，根据数量平均分布一下
		const num = Math.floor(list.length / 2)
		ball01.position.set(list[num * (i + 1)][0] * 1, list[num * (i + 1)][1] * 1, list[num * (i + 1)][2] * 1)
		line.add(ball01)

		const ball02 = ball2.clone()
		const num02 = Math.floor(list.length / 2)
		ball02.position.set(list[num02 * (i + 1)][0] * 1, list[num02 * (i + 1)][1] * 1, list[num02 * (i + 1)][2] * 1)
		l2.add(ball02)

		const ball03 = ball2.clone()
		const num03 = Math.floor(list.length / 2)
		ball03.position.set(list[num03 * (i + 1)][0] * 1, list[num03 * (i + 1)][1] * 1, list[num03 * (i + 1)][2] * 1)
		l3.add(ball03)
	}
}

const createFlyLine = () => {
	flyLineGroup = new THREE.Group()
	data.forEach(cities => {
		cities.endArray.forEach(item => {
			// 调用函数flyArc绘制球面上任意两点之间飞线圆弧轨迹
			const arcline = flyArc(radius, cities.startArray.E, cities.startArray.N, item.E, item.N, {
				color: 0xf3ae76, // 飞线的颜色
				flyLineColor: 0xff7714, // 飞行线的颜色
				speed: 0.004 // 拖尾飞线的速度
			})

			flyLineGroup.add(arcline) // 飞线插入flyArcGroup中
			flyLineList.push(arcline.userData["flyLine"])
		})
	})
	earthGroup.add(flyLineGroup)
}

const createMarkupPoint = async () => {
	const texture = await web.loaderMap("/threejsDemo/earth/label.png")
	const lightColumn = await web.loaderMap("/threejsDemo/earth/light_column.png")
	const aperture = await web.loaderMap("/threejsDemo/earth/aperture.png")

	const punctuationMaterial = new THREE.MeshBasicMaterial({
		color: new THREE.Color(0x3892ff),
		map: texture,
		transparent: true, //使用背景透明的png贴图，注意开启透明计算
		depthWrite: false //禁止写入深度缓冲区数据
	})

	data.forEach(item => {
		const lon = item.startArray.E //经度
		const lat = item.startArray.N //纬度
		const mesh = createPointMesh({ radius, lon, lat, material: punctuationMaterial }) //光柱底座矩形平面
		markupPointGroup.add(mesh)
		const LightPillar = createLightPillar({
			radius: radius,
			lon,
			lat,
			index: 0,
			textures: lightColumn,
			punctuation: {
				circleColor: 0x3892ff,
				lightColumn: {
					startColor: 0xe4007f, // 起点颜色
					endColor: 0xffffff // 终点颜色
				}
			}
		}) //光柱
		markupPointGroup.add(LightPillar)
		const WaveMesh = createWaveMesh({ radius, lon, lat, textures: aperture }) //波动光圈
		markupPointGroup.add(WaveMesh)
		waveMeshArr.push(WaveMesh)

		item.endArray.forEach(obj => {
			const lon = obj.E //经度
			const lat = obj.N //纬度
			const mesh = createPointMesh({ radius, lon, lat, material: punctuationMaterial }) //光柱底座矩形平面
			markupPointGroup.add(mesh)
			const LightPillar = createLightPillar({
				radius: radius,
				lon,
				lat,
				index: 1,
				textures: lightColumn,
				punctuation: {
					circleColor: 0x3892ff,
					lightColumn: {
						startColor: 0xe4007f, // 起点颜色
						endColor: 0xffffff // 终点颜色
					}
				}
			}) //光柱
			markupPointGroup.add(LightPillar)
			const WaveMesh = createWaveMesh({ radius, lon, lat, textures: aperture }) //波动光圈
			markupPointGroup.add(WaveMesh)
			waveMeshArr.push(WaveMesh)
		})
	})
	earthGroup.add(markupPointGroup)
}

const createSpriteLabel = () => {
	data.map(item => {
		let cityArry = []
		cityArry.push(item.startArray)
		cityArry = cityArry.concat(...item.endArray)
		cityArry.forEach(city => {
			// 创建canvas
			const canvas = document.createElement("canvas")
			canvas.width = 1080
			canvas.height = 1080
			canvas.style.zIndex = "1"
			const context = canvas.getContext("2d")

			context.textAlign = "center"
			context.textBaseline = "middle"
			context.font = "bold 100px Arial"
			context.fillStyle = "rgba(0,255,255,1)"
			context.clearRect(0, 0, canvas.width, canvas.height)
			context.fillText(city.name, canvas.width / 2, canvas.height / 2)
			let texture = new THREE.CanvasTexture(canvas)
			const material = new THREE.SpriteMaterial({
				map: texture,
				transparent: true
			})
			const p = lon2xyz(radius * 1.001, city.E, city.N)
			const sprite = new THREE.Sprite(material)
			sprite.position.set(p.x * 1.1, p.y * 1.1, p.z * 1.1)
			sprite.scale.set(20, 20, 20)
			earthGroup.add(sprite)
		})
	})
}

// 炫光粒子 几何体
const geometryLz: any = new THREE.BufferGeometry()
// 加载地图
const loadMap = () => {
	const url = `./threejsDemo/map/geojson/100000_full.json`
	fetch(url)
		.then(res => res.json())
		.then(data => {
			// 中国边界
			const feature = data.features[0]
			const province = new THREE.Object3D()
			// 点数据
			const coordinates = feature.geometry.coordinates
			coordinates.forEach(coordinate => {
				// coordinate 多边形数据
				coordinate.forEach(rows => {
					// 绘制线
					const line = lineDraw(rows, 0xaa381e)
					province.add(line)
				})
			})
			earthGroup.add(province)

			// 拉平 为一维数组
			const positions = new Float32Array(lines.flat(1))
			// 设置顶点
			geometryLz.setAttribute("position", new THREE.BufferAttribute(positions, 3))
			// 设置 粒子透明度为 0
			opacitys = new Float32Array(positions.length).map(() => 0)
			geometryLz.setAttribute("aOpacity", new THREE.BufferAttribute(opacitys, 1))

			geometryLz.currentPos = 0
			// 炫光移动速度
			geometryLz.pointSpeed = 20

			// 控制 颜色和粒子大小
			const params = {
				pointSize: 2.0,
				pointColor: "#4ec0e9"
			}

			const vertexPointShader = `
        attribute float aOpacity;
        uniform float uSize;
        varying float vOpacity;

        void main(){
            gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
            gl_PointSize = uSize;

            vOpacity=aOpacity;
        }
        `

			const fragmentPointShader = `
          varying float vOpacity;
          uniform vec3 uColor;

          float invert(float n){
              return 1.-n;
          }

          void main(){
            if(vOpacity <=0.2){
                discard;
            }
            vec2 uv=vec2(gl_PointCoord.x,invert(gl_PointCoord.y));
            vec2 cUv=2.*uv-1.;
            vec4 color=vec4(1./length(cUv));
            color*=vOpacity;
            color.rgb*=uColor;

            gl_FragColor=color;
          }
          `

			// 创建着色器材质
			const material = new THREE.ShaderMaterial({
				vertexShader: vertexPointShader,
				fragmentShader: fragmentPointShader,
				transparent: true, // 设置透明
				uniforms: {
					uSize: {
						value: params.pointSize
					},
					uColor: {
						value: new THREE.Color(params.pointColor)
					}
				}
			})
			const points = new THREE.Points(geometryLz, material)

			earthGroup.add(points)
		})
}

/**
 * 边框 图形绘制
 * @param polygon 多边形 点数组
 * @param color 材质颜色
 * */
let indexBol = true
function lineDraw(polygon, color) {
	const lineGeometry = new THREE.BufferGeometry()
	const pointsArray = new Array()
	polygon.forEach(row => {
		// 转换坐标
		const xyz = lon2xyz(radius, row[0], row[1])
		// 创建三维点
		pointsArray.push(xyz)
		if (indexBol) {
			// 为了好看 这里只要内陆边界
			lines.push([xyz.x, xyz.y, xyz.z])
		}
	})
	indexBol = false
	lineGeometry.setFromPoints(pointsArray)
	const lineMaterial = new THREE.LineBasicMaterial({
		color: new THREE.Color("#91dae6")
	})
	return new THREE.Line(lineGeometry, lineMaterial)
}

const renderScene = () => {
	if (earchUniforms) {
		earchUniforms.time.value = earchUniforms.time.value < -timeValue ? timeValue : earchUniforms.time.value - 1
	}
	circleLineList.forEach(e => {
		e.rotateY(-0.01)
	})
	flyLineList.forEach(fly => {
		fly.rotation.z += 0.004 // 调节飞线速度
		if (fly.rotation.z >= fly.flyEndAngle) fly.rotation.z = 0
	})
	if (waveMeshArr.length) {
		waveMeshArr.forEach((mesh: THREE.Mesh) => {
			mesh.userData["scale"] += 0.007
			mesh.scale.set(
				mesh.userData["size"] * mesh.userData["scale"],
				mesh.userData["size"] * mesh.userData["scale"],
				mesh.userData["size"] * mesh.userData["scale"]
			)
			if (mesh.userData["scale"] <= 1.5) {
				;(mesh.material as THREE.Material).opacity = (mesh.userData["scale"] - 1) * 2 //2等于1/(1.5-1.0)，保证透明度在0~1之间变化
			} else if (mesh.userData["scale"] > 1.5 && mesh.userData["scale"] <= 2) {
				;(mesh.material as THREE.Material).opacity = 1 - (mesh.userData["scale"] - 1.5) * 2 //2等于1/(2.0-1.5) mesh缩放2倍对应0 缩放1.5被对应1
			} else {
				mesh.userData["scale"] = 1
			}
		})
	}

	if (geometryLz.attributes.position) {
		geometryLz.currentPos += geometryLz.pointSpeed
		for (let i = 0; i < geometryLz.pointSpeed; i++) {
			opacitys[(geometryLz.currentPos - i) % lines.length] = 0
		}

		for (let i = 0; i < 200; i++) {
			opacitys[(geometryLz.currentPos + i) % lines.length] = i / 50 > 2 ? 2 : i / 50
		}
		geometryLz.attributes.aOpacity.needsUpdate = true
	}
	if (earthGroup) {
		earthGroup.rotation.y += 0.001
	}
	web.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
