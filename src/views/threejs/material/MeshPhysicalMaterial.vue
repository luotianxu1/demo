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
let gui: dat.GUI

const textureLoader = new THREE.TextureLoader()
const fibers = textureLoader.load("./textures/alpha/alphaMap.jpg")
const bricks = textureLoader.load("./textures/map/brick_diffuse.jpg")
bricks.wrapS = THREE.RepeatWrapping
bricks.wrapT = THREE.RepeatWrapping
bricks.repeat.set(9, 1)

const cubeTextureLoader = new THREE.CubeTextureLoader()
const path = "./textures/env/SwedishRoyalCastle/"
const format = ".jpg"
const urls = [
	path + "px" + format,
	path + "nx" + format,
	path + "py" + format,
	path + "ny" + format,
	path + "pz" + format,
	path + "nz" + format
]
const reflectionCube = cubeTextureLoader.load(urls)
const refractionCube = cubeTextureLoader.load(urls)
refractionCube.mapping = THREE.CubeRefractionMapping

const diffuseMaps = (() => {
	return {
		none: null,
		bricks: bricks
	}
})()

const alphaMaps = (() => {
	return {
		none: null,
		fibers: fibers
	}
})()

const envMaps = (() => {
	return {
		none: null,
		reflection: reflectionCube
	}
})()

const roughnessMaps = (() => {
	return {
		none: null,
		bricks: bricks
	}
})()

let controlsData = reactive<THREE.MeshPhysicalMaterialParameters>({
	color: "rgb(4,158,244)",
	emissive: "rgb(0,0,0)",
	roughness: 1,
	metalness: 0,
	reflectivity: 1,
	clearcoat: 0,
	clearcoatRoughness: 0,
	flatShading: false,
	wireframe: false,
	vertexColors: false,
	fog: true,
	transparent: false,
	opacity: 1,
	depthTest: true,
	depthWrite: true,
	visible: true,
	alphaTest: 0
})
let materialsData = reactive({
	alphaMap: "none",
	envMaps: "none",
	map: "none",
	roughnessMap: "none"
})

const geometry = new THREE.TorusKnotGeometry(10, 3, 200, 32).toNonIndexed()
const material = new THREE.MeshPhysicalMaterial({
	...(controlsData as unknown as THREE.MeshPhysicalMaterialParameters)
})
const cube = new THREE.Mesh(geometry, material)

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x444444)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(25, 25, 25)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	const ambientLight = new THREE.AmbientLight(0x000000)
	scene.add(ambientLight)

	const light1 = new THREE.PointLight(0xffffff, 1, 0)
	light1.position.set(0, 200, 0)
	scene.add(light1)

	const light2 = new THREE.PointLight(0xffffff, 1, 0)
	light2.position.set(100, 200, 100)
	scene.add(light2)

	const light3 = new THREE.PointLight(0xffffff, 1, 0)
	light3.position.set(-100, -200, -100)
	scene.add(light3)

	scene.add(cube)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

let step = 0
const clock = new THREE.Clock()
const renderScene = () => {
	const time = clock.getDelta()
	cube.rotation.y = step += time
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.addColor(controlsData, "color")
	gui.addColor(controlsData, "emissive")
	gui.add(controlsData, "roughness", 0, 1)
	gui.add(controlsData, "metalness", 0, 1)
	gui.add(controlsData, "reflectivity").min(0).max(1).step(0.01)
	gui.add(controlsData, "clearcoat").min(0).max(1).step(0.01)
	gui.add(controlsData, "clearcoatRoughness").min(0).max(1).step(0.01)
	gui.add(controlsData, "flatShading")
	gui.add(controlsData, "wireframe")
	gui.add(controlsData, "vertexColors")
	gui.add(controlsData, "fog")
	gui.add(materialsData, "envMaps", ["none", "reflection", "refraction"])
	gui.add(materialsData, "map", ["none", "bricks"])
	gui.add(materialsData, "alphaMap", ["none", "fibers"])
	gui.add(materialsData, "roughnessMap", ["none", "bricks"])
	gui.add(controlsData, "transparent")
	gui.add(controlsData, "opacity", 0, 1)
	gui.add(controlsData, "depthTest")
	gui.add(controlsData, "depthWrite")
	gui.add(controlsData, "visible")
	gui.add(controlsData, "alphaTest", 0, 1)
}

watch(controlsData, val => {
	material.color.set(val.color as THREE.Color)
	material.emissive.set(val.emissive as THREE.Color)
	material.roughness = val.roughness as number
	material.metalness = val.metalness as number
	material.reflectivity = val.reflectivity as number
	material.clearcoat = val.clearcoat as number
	material.clearcoatRoughness = val.clearcoatRoughness as number
	material.flatShading = val.flatShading as boolean
	material.wireframe = val.wireframe as boolean
	material.vertexColors = val.vertexColors as boolean
	material.fog = val.fog as boolean
	material.transparent = val.transparent as boolean
	material.depthTest = val.depthTest as boolean
	material.opacity = val.opacity as number
	material.depthWrite = val.depthWrite as boolean
	material.visible = val.visible as boolean
	material.alphaTest = val.alphaTest as number
	material.needsUpdate = true
})

watch(materialsData, val => {
	material.alphaMap = alphaMaps[val.alphaMap as keyof typeof alphaMaps]
	material.envMap = envMaps[val.envMaps as keyof typeof envMaps]
	material.map = diffuseMaps[val.map as keyof typeof diffuseMaps]
	material.roughnessMap = roughnessMaps[val.map as keyof typeof roughnessMaps]
	material.needsUpdate = true
})

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
