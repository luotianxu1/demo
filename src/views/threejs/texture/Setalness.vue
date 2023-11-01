<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let pointLight: THREE.PointLight

// 点
const sphereLight = new THREE.SphereGeometry(0.2)
const sphereLightMaterial = new THREE.MeshStandardMaterial({
	color: 0xff5808
})
const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	const cubeLoader = new THREE.CubeTextureLoader()
	const urls = [
		"./textures/cubemap/car/right.png",
		"./textures/cubemap/car/left.png",
		"./textures/cubemap/car/top.png",
		"./textures/cubemap/car/bottom.png",
		"./textures/cubemap/car/front.png",
		"./textures/cubemap/car/back.png"
	]
	scene.background = cubeLoader.load(urls)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 5, 40)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.shadowMap.enabled = true

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	const ambientLight = new THREE.AmbientLight(0x888888)
	scene.add(ambientLight)
	const light = new THREE.SpotLight(0xffffff, 1, 0)
	light.position.set(-10, 30, 40)
	light.castShadow = true
	scene.add(light)

	// 点光源
	pointLight = new THREE.PointLight("#ff5808", 1)
	pointLight.position.set(0, 0, 0)
	scene.add(pointLight)

	scene.add(sphereLightMesh)

	const cubeMaterial = new THREE.MeshStandardMaterial({
		envMap: scene.background,
		color: 0xffffff,
		metalness: 1,
		roughness: 0.5
	})

	const textureLoader = new THREE.TextureLoader()
	const cubeMaterialWithMetalMap = cubeMaterial.clone()
	cubeMaterialWithMetalMap.metalnessMap = textureLoader.load("./threejs/texture/roughness-map.jpg")
	const cubeMaterialWithRoughnessMap = cubeMaterial.clone()
	cubeMaterialWithRoughnessMap.roughnessMap = textureLoader.load("./threejs/texture/roughness-map.jpg")

	const sphere = new THREE.SphereGeometry(8, 50, 50)
	const cube1 = new THREE.Mesh(sphere, cubeMaterialWithMetalMap)
	cube1.castShadow = true
	cube1.position.x = -10
	cube1.rotation.y = (1 / 3) * Math.PI
	scene.add(cube1)

	const cube2 = new THREE.Mesh(sphere, cubeMaterialWithRoughnessMap)
	cube2.castShadow = true
	cube2.position.x = 10
	cube2.rotation.y = (-1 / 3) * Math.PI
	scene.add(cube2)

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

let invert = 1
let phase = 0
const clock = new THREE.Clock()
const renderScene = () => {
	const time = clock.getDelta()
	if (phase > 2 * Math.PI) {
		invert = invert * -1
		phase -= 2 * Math.PI
	} else {
		phase += time
	}
	sphereLightMesh.position.z = Number(21 * Math.sin(phase))
	sphereLightMesh.position.x = -14 + 14 * Math.cos(phase)
	sphereLightMesh.position.y = 5
	if (invert < 0) {
		let pivot = 0
		sphereLightMesh.position.x = invert * (sphereLightMesh.position.x - pivot) + pivot
	}
	pointLight.position.copy(sphereLightMesh.position)
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
