<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js"

const webgl = ref()
onMounted(() => {
	init()
})

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, -10)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

// 添加灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(0, 0, 1)
scene.add(directionalLight)

// 创建地球
const textureLoader = new THREE.TextureLoader()
const EARTH_RADIUS = 1
const MOON_RADIUS = 0.27
const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16)
const earthMaterial = new THREE.MeshPhongMaterial({
	specular: 0x333333,
	shininess: 5,
	map: textureLoader.load("./threejs/render/earth_atmos_2048.jpg"),
	specularMap: textureLoader.load("./threejs/render/earth_specular_2048.jpg"),
	normalMap: textureLoader.load("./threejs/render/earth_normal_2048.jpg"),
	normalScale: new THREE.Vector2(0.85, 0.85)
})
const earth = new THREE.Mesh(earthGeometry, earthMaterial)
earth.name = "earth"
scene.add(earth)

// 创建月亮
const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16)
const moonMaterial = new THREE.MeshPhongMaterial({
	shininess: 5,
	map: textureLoader.load("./threejs/render/moon_1024.jpg")
})
const moon = new THREE.Mesh(moonGeometry, moonMaterial)
moon.name = "mooon"
scene.add(moon)

// 实例化CSS2d渲染器
const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(labelRenderer.domElement)
labelRenderer.domElement.style.position = "fixed"
labelRenderer.domElement.style.top = "0"
labelRenderer.domElement.style.left = "0"
labelRenderer.domElement.style.zIndex = "10"

const controls = new OrbitControls(camera, labelRenderer.domElement)
controls.enableDamping = true

// 添加地球标签
const earthDiv = document.createElement("div")
earthDiv.className = "label1"
earthDiv.innerHTML = "地球"
earthDiv.style.color = "#fff"
let earthLabel = new CSS2DObject(earthDiv)
earthLabel.position.set(0, 1, 0)
earth.add(earthLabel)

// 创建中国标签
const chinaDiv = document.createElement("div")
chinaDiv.className = "label"
chinaDiv.innerHTML = "中国"
chinaDiv.style.color = "#fff"
let chinaLabel = new CSS2DObject(chinaDiv)
chinaLabel.position.set(-0.3, 0.5, -0.9)
earth.add(chinaLabel)

// 创建月球标签
const moonDiv = document.createElement("div")
moonDiv.className = "label1"
moonDiv.innerHTML = "月球"
moonDiv.style.color = "#fff"
let moonLabel = new CSS2DObject(moonDiv)
moonLabel.position.set(0, 0.3, 0)
moon.add(moonLabel)

// 创建射线检测
const raycaster = new THREE.Raycaster()

const init = () => {
	if (!webgl.value) {
		return
	}

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const clock = new THREE.Clock()
const renderScene = () => {
	const elapsed = clock.getElapsedTime()
	moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5)

	const chainPosition = chinaLabel.position.clone()
	// 计算除标签和摄像机之间的距离
	const labelDistance = chainPosition.distanceTo(camera.position)
	// 检测射线的碰撞
	// 向量（坐标）从世界空间投影到相机的标准化设备坐标（NDC）空间
	chainPosition.project(camera)
	raycaster.setFromCamera(new THREE.Vector2(chainPosition.x, chainPosition.y), camera)
	const intersects = raycaster.intersectObjects(scene.children, true)
	// console.log(intersects)

	// 如果没有碰撞到任何物体,那么让标签显示
	if (intersects.length === 0) {
		chinaLabel.element.classList.add("visible")
	} else {
		const minDistane = intersects[0].distance
		if (minDistane < labelDistance) {
			chinaLabel.element.classList.remove("visible")
		} else {
			chinaLabel.element.classList.add("visible")
		}
	}

	controls.update()
	labelRenderer.render(scene, camera)
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}

onBeforeUnmount(() => {
	document.body.removeChild(labelRenderer.domElement)
})
</script>

<style lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}

.label {
	display: none;
	font-size: 0.2rem;
	color: #fff;
}

.visible {
	display: block;
}
</style>
