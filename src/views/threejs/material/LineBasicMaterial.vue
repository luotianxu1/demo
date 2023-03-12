<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
import { gosper } from "@utils/threejsShape"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let gui: dat.GUI
let line: THREE.Line

const points = gosper(4, 60)

let controlsData = reactive({
	color: 0xffffff,
	linewidth: 10,
	linecap: "round",
	linejoin: "round"
})

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x444444)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 0, 150)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	addBoxGeometry(controlsData)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addBoxGeometry = (data: typeof controlsData) => {
	const lines = new THREE.BufferGeometry()
	lines.setFromPoints(points)
	const material = new THREE.LineBasicMaterial({
		color: data.color,
		linewidth: data.linewidth,
		linecap: data.linecap,
		linejoin: data.linejoin
	})

	if (line) {
		scene.remove(line)
	}
	line = new THREE.Line(lines, material)
	line.position.set(0, 0, 0)
	scene.add(line)
}

watch(controlsData, val => {
	addBoxGeometry(val)
})

const addGui = () => {
	gui = new dat.GUI()
	gui.addColor(controlsData, "color")
	gui.add(controlsData, "linewidth").min(0).max(100).step(1)
	gui.add(controlsData, "linecap", ["butt", "round", "round"])
	gui.add(controlsData, "linejoin", ["butt", "round", "round"])
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
