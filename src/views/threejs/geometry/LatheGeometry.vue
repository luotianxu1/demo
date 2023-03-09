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
let cube: THREE.Mesh
const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
})

let controlsData = reactive({
	segments: 12,
	phiStart: 0,
	phiLength: Math.PI * 2,
	wireframe: false
})

const points: THREE.Vector2[] | undefined = []
for (let i = 0; i < 10; i++) {
	points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 2, (i - 5) * 2))
}

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x444444)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(15, 12, 15)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	addLatheGeometry(controlsData)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addLatheGeometry = (data: typeof controlsData) => {
	material.wireframe = data.wireframe
	scene.remove(cube)
	const geometry = new THREE.LatheGeometry(points, controlsData.segments, controlsData.phiStart, controlsData.phiLength)
	cube = new THREE.Mesh(geometry, material)
	scene.add(cube)
}

watch(controlsData, val => {
	addLatheGeometry(val)
})

const addGui = () => {
	gui = new dat.GUI()
	gui.add(controlsData, "segments").min(0).max(100)
	gui
		.add(controlsData, "phiStart")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "phiLength")
		.min(0)
		.max(Math.PI * 2)

	gui.add(controlsData, "wireframe")
}

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
