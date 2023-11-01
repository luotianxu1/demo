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
let axesHelper: THREE.AxesHelper

// 导入纹理
const textLoader = new THREE.TextureLoader()
const mapTexture = textLoader.load("./threejs/texture/minecraft.png")
// 纹理显示设置
mapTexture.minFilter = THREE.NearestFilter
mapTexture.magFilter = THREE.NearestFilter
// mapTexture.minFilter = THREE.LinearFilter
// mapTexture.magFilter = THREE.LinearFilter

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const basicMaterial = new THREE.MeshBasicMaterial({
	color: "#ffff00",
	map: mapTexture
})
const cube = new THREE.Mesh(cubeGeometry, basicMaterial)

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 0, 3)

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
