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

let controlsData = reactive({
	near: 50,
	far: 110,
	add: function () {
		let cubeSize = Math.ceil(3 + Math.random() * 3)
		let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
		let cubeMaterial = new THREE.MeshLambertMaterial({
			color: Math.random() * 0xffffff
		})
		let cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
		cube.castShadow = true

		cube.position.x = -60 + Math.round(Math.random() * 100)
		cube.position.y = Math.round(Math.random() * 10)
		cube.position.z = -100 + Math.round(Math.random() * 150)
		scene.add(cube)
	}
})

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x444444)

	// 创建相机
	camera = new THREE.PerspectiveCamera(
		75,
		webgl.value.offsetWidth / webgl.value.offsetHeight,
		controlsData.near,
		controlsData.far
	)
	camera.position.set(25, 25, 25)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

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

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.add(controlsData, "near", 1, 100)
	gui.add(controlsData, "far", 50, 200)
	gui.add(controlsData, "add").name("添加物体")
}

watch(controlsData, val => {
	camera.near = val.near
	camera.far = val.far
	camera.updateProjectionMatrix()
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
