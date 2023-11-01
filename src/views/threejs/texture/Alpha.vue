<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { addLargeGroundPlane } from "@utils/threejsShape"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls

const textureLoader = new THREE.TextureLoader()
const sphere = new THREE.SphereGeometry(8, 180, 180)
const alpha = textureLoader.load("./threejs/texture/partial-transparency.png")
alpha.wrapS = THREE.RepeatWrapping
alpha.wrapT = THREE.RepeatWrapping
alpha.repeat.set(8, 8)
const sphereMaterial = new THREE.MeshStandardMaterial({
	alphaMap: alpha,
	metalness: 0.02,
	roughness: 0.07,
	color: 0xffffff,
	alphaTest: 0.5
})

const cube = new THREE.Mesh(sphere, sphereMaterial)
cube.castShadow = true

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 5, 40)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.shadowMap.enabled = true

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	const ambientLight = new THREE.AmbientLight(0x343434)
	scene.add(ambientLight)
	const light = new THREE.SpotLight(0xffffff, 1, 0)
	light.position.set(-10, 30, 40)
	light.castShadow = true
	scene.add(light)

	const groundPlane = addLargeGroundPlane(scene, true)
	groundPlane.position.y = -10

	scene.add(cube)

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
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
