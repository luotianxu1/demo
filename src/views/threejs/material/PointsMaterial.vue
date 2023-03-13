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
const texture = textureLoader.load("./textures/map/points.png")

const sphereMetrial = new THREE.SphereGeometry(3, 30, 30)
const pointsMaterial = new THREE.PointsMaterial()
pointsMaterial.size = 0.2
pointsMaterial.color.set(0xfff000)
// 相机深度而衰减
pointsMaterial.sizeAttenuation = true
pointsMaterial.map = texture
pointsMaterial.alphaMap = texture
pointsMaterial.transparent = true
pointsMaterial.depthWrite = false
pointsMaterial.blending = THREE.AdditiveBlending

const points = new THREE.Points(sphereMetrial, pointsMaterial)

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x444444)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(5, 0, 5)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	scene.add(points)

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
