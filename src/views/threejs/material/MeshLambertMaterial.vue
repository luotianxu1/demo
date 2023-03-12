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
		reflection: reflectionCube,
		refraction: refractionCube
	}
})()

let controlsData = reactive<THREE.MeshLambertMaterialParameters>({
	color: "rgb(4,158,244)",
	emissive: "rgb(0,0,0)",
	wireframe: false,
	fog: true,
	combine: THREE.MultiplyOperation,
	reflectivity: 1,
	refractionRatio: 0.98
})
let materialsData = reactive({
	alphaMap: "none",
	envMaps: "none",
	map: "none"
})

const geometry = new THREE.TorusKnotGeometry(10, 3, 200, 32).toNonIndexed()
const material = new THREE.MeshLambertMaterial({
	...(controlsData as unknown as THREE.MeshLambertMaterialParameters)
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
	gui.add(controlsData, "wireframe")
	gui.add(controlsData, "fog")
	gui.add(materialsData, "envMaps", ["none", "reflection", "refraction"])
	gui.add(materialsData, "map", ["none", "bricks"])
	gui.add(materialsData, "alphaMap", ["none", "fibers"])
	gui.add(controlsData, "reflectivity").min(0).max(1).step(0.01)
	gui.add(controlsData, "refractionRatio").min(0).max(1).step(0.01)
}

watch(controlsData, val => {
	material.color.set(val.color as THREE.Color)
	material.emissive.set(val.emissive as THREE.Color)
	material.wireframe = val.wireframe as boolean
	material.fog = val.fog as boolean
	material.reflectivity = val.reflectivity as number
	material.refractionRatio = val.refractionRatio as number
	material.reflectivity = val.reflectivity as number
	material.refractionRatio = val.refractionRatio as number
})

watch(materialsData, val => {
	material.alphaMap = alphaMaps[val.alphaMap as keyof typeof alphaMaps]
	material.envMap = envMaps[val.envMaps as keyof typeof envMaps]
	material.map = diffuseMaps[val.map as keyof typeof diffuseMaps]
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
