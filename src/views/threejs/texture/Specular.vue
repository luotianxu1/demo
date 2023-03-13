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

const textureLoader = new THREE.TextureLoader()
const earthMaterial = new THREE.MeshPhongMaterial({
	map: textureLoader.load("./textures/map/Earth.png"),
	normalMap: textureLoader.load("./textures/normal/EarthNormal.png"),
	specularMap: textureLoader.load("./textures/specular/EarthSpec.png"),
	normalScale: new THREE.Vector2(6, 6)
})
const sphere = new THREE.SphereGeometry(9, 50, 50)
const sphere1 = new THREE.Mesh(sphere, earthMaterial)
sphere1.rotation.y = (1 / 6) * Math.PI

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(10, 10, 20)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.shadowMap.enabled = true

	const ambientLight = new THREE.AmbientLight(0x343434)
	scene.add(ambientLight)
	const sportLight = new THREE.SpotLight(0xffffff)
	sportLight.position.set(-10, 30, 40)
	scene.add(sportLight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

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
