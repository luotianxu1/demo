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
let geometry: THREE.SphereGeometry

let controlsData = reactive({
	radius: 5,
	widthSegments: 32,
	heightSegments: 16,
	phiStart: 0,
	phiLength: Math.PI * 2,
	thetaStart: 0,
	thetaLength: Math.PI,
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
	camera.position.set(15, 12, 15)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	addSphereGeometry(controlsData)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addSphereGeometry = (data: typeof controlsData) => {
	clear()
	material.wireframe = data.wireframe
	geometry = new THREE.SphereGeometry(
		controlsData.radius,
		controlsData.widthSegments,
		controlsData.heightSegments,
		controlsData.phiStart,
		controlsData.phiLength,
		controlsData.thetaStart,
		controlsData.thetaLength
	)
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
	addSphereGeometry(val)
})

const addGui = () => {
	gui = new dat.GUI()
	gui.add(controlsData, "radius").min(0).max(50)
	gui.add(controlsData, "widthSegments").min(3).max(100)
	gui.add(controlsData, "heightSegments").min(2).max(100)
	gui
		.add(controlsData, "phiStart")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "phiLength")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "thetaStart")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "thetaLength")
		.min(0)
		.max(Math.PI * 2)
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
