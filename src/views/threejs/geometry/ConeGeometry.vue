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
let geometry: THREE.ConeGeometry

let controlsData = reactive({
	radius: 3,
	height: 5,
	radialSegments: 32,
	heightSegments: 1,
	openEnded: true,
	thetaStart: 0,
	thetaLength: Math.PI * 2,
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

	addConeGeometry(controlsData)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addConeGeometry = (data: typeof controlsData) => {
	clear()
	material.wireframe = data.wireframe
	geometry = new THREE.ConeGeometry(
		data.radius,
		data.height,
		data.radialSegments,
		data.heightSegments,
		data.openEnded,
		data.thetaStart,
		data.thetaLength
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
	addConeGeometry(val)
})

const addGui = () => {
	gui = new dat.GUI()
	gui.add(controlsData, "radius").min(1).max(20)
	gui.add(controlsData, "height").min(3).max(20)
	gui.add(controlsData, "radialSegments").min(0).max(100).step(1)
	gui.add(controlsData, "heightSegments").min(0).max(100).step(1)
	gui.add(controlsData, "openEnded")
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
