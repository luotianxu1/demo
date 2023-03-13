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
const cubeMaterial = new THREE.MeshStandardMaterial({
	emissive: 0xffffff,
	emissiveMap: textureLoader.load("./textures/emissive/lava.png"),
	normalMap: textureLoader.load("./textures/emissive/lava-normals.png"),
	metalnessMap: textureLoader.load("./textures/emissive/lava-smoothness.png"),
	metalness: 1,
	roughness: 0.4,
	normalScale: new THREE.Vector2(4, 4)
})
const cube = new THREE.BoxGeometry(16, 16, 16)
const cube1 = new THREE.Mesh(cube, cubeMaterial)
cube1.rotation.y = (1 / 3) * Math.PI
cube1.position.x = -12

const sphere = new THREE.SphereGeometry(9, 50, 50)
const sphere1 = new THREE.Mesh(sphere, cubeMaterial)
sphere1.rotation.y = (1 / 6) * Math.PI
sphere1.position.x = 15

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

	const sportLight = new THREE.SpotLight(0xffffff, 0.1)
	sportLight.position.set(0, 20, 40)
	scene.add(sportLight)

	const groundPlane = addLargeGroundPlane(scene, true)
	groundPlane.position.y = -10

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
