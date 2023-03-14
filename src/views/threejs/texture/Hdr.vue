<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls

const cubeMaterial = new THREE.MeshStandardMaterial({
	color: 0xffffff,
	metalness: 1,
	roughness: 0
})
const cube = new THREE.BoxGeometry(16, 12, 12)
const cube1 = new THREE.Mesh(cube, cubeMaterial)
cube1.position.x = -15
cube1.rotation.y = (-1 / 3) * Math.PI

const sphere = new THREE.SphereGeometry(10, 50, 50)
const sphereMaterial = cubeMaterial.clone()
const sphere1 = new THREE.Mesh(sphere, sphereMaterial)
sphere1.position.x = 15

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 20, 40)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.shadowMap.enabled = true

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	const ambientLight = new THREE.AmbientLight(0x444444)
	scene.add(ambientLight)
	const light = new THREE.SpotLight(0xffffff, 1, 0)
	light.position.set(-10, 30, 40)
	light.castShadow = true
	scene.add(light)

	const rgbeLoader = new RGBELoader()
	rgbeLoader.loadAsync("./textures/hdr/050.hdr").then(texture => {
		texture.mapping = THREE.EquirectangularReflectionMapping
		scene.background = texture
		scene.environment = texture
	})
	scene.add(cube1)
	scene.add(sphere1)

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
