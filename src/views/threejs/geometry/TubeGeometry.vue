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
let geometry: THREE.TubeGeometry

let controlsData = reactive({
	radius: 6,
	tubularSegments: 48,
	radialSegments: 8,
	closed: false,
	wireframe: false
})

class CustomSinCurve extends THREE.Curve<any> {
	scale: number
	constructor(scale = 1) {
		super()
		this.scale = scale
	}
	getPoint(t: number, optionalTarget = new THREE.Vector3()) {
		const tx = t * 3 - 1.5
		const ty = Math.sin(2 * Math.PI * t)
		const tz = 0
		return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
	}
}
const path = new CustomSinCurve(10)

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

	addTubeGeometry(controlsData)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addTubeGeometry = (data: typeof controlsData) => {
	clear()
	material.wireframe = data.wireframe
	geometry = new THREE.TubeGeometry(
		path,
		controlsData.tubularSegments,
		controlsData.radius,
		controlsData.radialSegments,
		controlsData.closed
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
	addTubeGeometry(val)
})

const addGui = () => {
	gui = new dat.GUI()
	gui.add(controlsData, "radius").min(0).max(50)
	gui.add(controlsData, "tubularSegments").min(0).max(100).step(1)
	gui.add(controlsData, "radialSegments").min(1).max(50).step(1)
	gui.add(controlsData, "closed")
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
