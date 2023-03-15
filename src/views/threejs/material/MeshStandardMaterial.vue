<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let axesHelper: THREE.AxesHelper
let gui: dat.GUI

let event = {
	onLoad: () => {
		console.log("图片加载完成")
	},
	onProgress: (url: any, num: number, total: number) => {
		console.log("图片", url)
		console.log("图片加载进度", num)
		console.log("图片总数", total)
		console.log("加载进度", Number((num / total).toFixed(2)) * 100 + "%")
	},
	onError: (e: any) => {
		console.log("图片加载出现错误")
		console.log(e)
	}
}

// 设计加载管理器
const loadingManager = new THREE.LoadingManager(event.onLoad, event.onProgress, event.onError)

// 导入纹理
const textureLoader = new THREE.TextureLoader(loadingManager)
const mapTextures = (() => {
	return {
		none: null,
		mapTexture: textureLoader.load("./textures/map/door.jpg")
	}
})()
// doorColorTexture.offset.x = 0.5
// doorColorTexture.offset.y = 0.5
// doorColorTexture.center.set(0.5, 0.5)
// doorColorTexture.rotation = Math.PI / 4
// 设置纹理重复
// doorColorTexture.repeat.set(2,2)
// 设置纹理重复模式
// doorColorTexture.wrapS = THREE.MirroredRepeatWrapping
// doorColorTexture.wrapT = THREE.RepeatWrapping

// 透明纹理
const alphaTextures = (() => {
	return {
		none: null,
		alphaTexture: textureLoader.load("./textures/alpha/door.jpg")
	}
})()
// 环境遮挡
const aoTextures = (() => {
	return {
		none: null,
		aoTexture: textureLoader.load("./textures/ao/door.jpg")
	}
})()
// 位移贴图
const displacementTextures = (() => {
	return {
		none: null,
		displacementTexture: textureLoader.load("./textures/displacement/door.jpg")
	}
})()
// 粗糙度贴图
const roughnessTextures = (() => {
	return {
		none: null,
		roughnessTexture: textureLoader.load("./textures/roughness/door.jpg")
	}
})()
// 金属贴图
const metalnessTextures = (() => {
	return {
		none: null,
		metalnessTexture: textureLoader.load("./textures/metalness/door.jpg")
	}
})()
// 法线贴图
const normalTextures = (() => {
	return {
		none: null,
		normalTexture: textureLoader.load("./textures/normal/door.jpg")
	}
})()

let materialsData = reactive({
	map: "mapTexture",
	alphaMap: "alphaTexture",
	aoMap: "aoTexture",
	displacementMap: "displacementTexture",
	roughnessMap: "roughnessTexture",
	metalnessMap: "metalnessTexture",
	normalMap: "normalTexture"
})

const controlsData = reactive<THREE.MeshStandardMaterialParameters>({
	color: "#ffff00",
	transparent: true,
	opacity: 1,
	side: THREE.DoubleSide,
	aoMapIntensity: 1,
	displacementScale: 0.05,
	roughness: 1,
	metalness: 1
})

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 200, 200, 200)
const standardMaterial = new THREE.MeshStandardMaterial({
	color: controlsData.color,
	map: mapTextures.mapTexture,
	alphaMap: alphaTextures.alphaTexture,
	transparent: controlsData.transparent, // 定义材质是否透明，不透明则透明纹理无效
	opacity: controlsData.opacity,
	side: controlsData.side,
	aoMap: aoTextures.aoTexture, // 需要第二组贴图
	aoMapIntensity: controlsData.aoMapIntensity,
	displacementMap: displacementTextures.displacementTexture,
	displacementScale: controlsData.displacementScale,
	roughnessMap: roughnessTextures.roughnessTexture,
	roughness: controlsData.roughness,
	metalnessMap: metalnessTextures.metalnessTexture,
	metalness: controlsData.metalness,
	normalMap: normalTextures.normalTexture
})
const cube = new THREE.Mesh(cubeGeometry, standardMaterial)
// 设置第2组uv
cubeGeometry.setAttribute("uv2", new THREE.BufferAttribute((cubeGeometry.attributes.uv as any).array, 2))

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 0, 1.5)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.shadowMap.enabled = true

	const light = new THREE.AmbientLight(0xffffff, 0.5)
	scene.add(light)
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
	directionalLight.position.set(10, 10, 10)
	scene.add(directionalLight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	axesHelper = new THREE.AxesHelper(5)
	scene.add(axesHelper)

	scene.add(cube)

	addGui()

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const addGui = () => {
	gui = new dat.GUI()
	gui.addColor(controlsData, "color")
	gui.add(materialsData, "map", ["none", "mapTexture"])
	gui.add(materialsData, "alphaMap", ["none", "alphaTexture"])
	gui.add(controlsData, "transparent")
	gui.add(controlsData, "opacity", 0, 1)
	gui.add(controlsData, "side", ["THREE.DoubleSide"])
	gui.add(materialsData, "aoMap", ["none", "aoTexture"])
	gui.add(controlsData, "aoMapIntensity", 0, 1)
	gui.add(materialsData, "displacementMap", ["none", "displacementTexture"])
	gui.add(controlsData, "displacementScale", 0, 1)
	gui.add(materialsData, "roughnessMap", ["none", "roughnessTexture"])
	gui.add(controlsData, "roughness", 0, 1)
	gui.add(materialsData, "metalnessMap", ["none", "metalnessTexture"])
	gui.add(controlsData, "metalness", 0, 1)
	gui.add(materialsData, "normalMap", ["none", "normalTexture"])
}

watch(controlsData, val => {
	standardMaterial.color = new THREE.Color(val.color)
	standardMaterial.transparent = val.transparent as boolean
	standardMaterial.opacity = val.opacity as number
	standardMaterial.aoMapIntensity = val.aoMapIntensity as number
	standardMaterial.displacementScale = val.displacementScale as number
	standardMaterial.roughness = val.roughness as number
	standardMaterial.metalness = val.metalness as number
	standardMaterial.needsUpdate = true
})

watch(materialsData, val => {
	standardMaterial.map = mapTextures[val.map as keyof typeof mapTextures]
	standardMaterial.alphaMap = alphaTextures[val.alphaMap as keyof typeof alphaTextures]
	standardMaterial.aoMap = aoTextures[val.aoMap as keyof typeof aoTextures]
	standardMaterial.displacementMap = displacementTextures[val.displacementMap as keyof typeof displacementTextures]
	standardMaterial.roughnessMap = roughnessTextures[val.roughnessMap as keyof typeof roughnessTextures]
	standardMaterial.metalnessMap = metalnessTextures[val.metalnessMap as keyof typeof metalnessTextures]
	standardMaterial.normalMap = normalTextures[val.normalMap as keyof typeof normalTextures]
	standardMaterial.needsUpdate = true
})

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

onUnmounted(() => {
	gui.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
