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
let geometry: THREE.ExtrudeGeometry

const length = 3
const width = 2

const shape = new THREE.Shape()
shape.moveTo(0, 0)
shape.lineTo(0, width)
shape.lineTo(length, width)
shape.lineTo(length, 0)
shape.lineTo(0, 0)

let controlsData = reactive({
	curveSegments: 12,
	steps: 1,
	depth: 1,
	bevelEnabled: true,
	bevelThickness: 0.2,
	bevelSize: 0.1,
	bevelOffset: 0,
	bevelSegments: 3,
	wireframe: false
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
	camera.position.set(5, 2, 5)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	addExtrudeGeometry(controlsData)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addExtrudeGeometry = (data: typeof controlsData) => {
	clear()
	material.wireframe = data.wireframe
	geometry = new THREE.ExtrudeGeometry(shape, controlsData)
	cube = new THREE.Mesh(geometry, material)
	scene.add(cube)
}

const clear = () => {
	if (cube) {
		scene.remove(cube)
	}
	if (geometry) {
		geometry.dispose()
	}
}

watch(controlsData, val => {
	addExtrudeGeometry(val)
})

const addGui = () => {
	gui = new dat.GUI()
	gui.add(controlsData, "curveSegments").min(0).max(30).step(1)
	gui.add(controlsData, "steps").min(0).max(4).step(1)
	gui.add(controlsData, "depth").min(0).max(20).step(1)
	gui.add(controlsData, "bevelEnabled")
	gui.add(controlsData, "bevelThickness").min(0).max(1).step(0.1)
	gui.add(controlsData, "bevelSize").min(0).max(1).step(0.1)
	gui.add(controlsData, "bevelOffset").min(0).max(5).step(0.1)
	gui.add(controlsData, "bevelSegments").min(0).max(5).step(1)
	gui.add(controlsData, "wireframe")
}

onUnmounted(() => {
	gui.destroy()
	clear()
	material.dispose()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
