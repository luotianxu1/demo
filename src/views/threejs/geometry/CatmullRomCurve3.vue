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
let cube: THREE.Mesh
let boxGeometry: THREE.BoxGeometry

const curve = new THREE.CatmullRomCurve3(
	[
		new THREE.Vector3(-10, 0, 10),
		new THREE.Vector3(-5, 5, 5),
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(5, -5, 5),
		new THREE.Vector3(10, 0, 10)
	],
	true
)
const points = curve.getPoints(50)
const geometry = new THREE.BufferGeometry().setFromPoints(points)
const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
const curveObject = new THREE.Line(geometry, material)

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x444444)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(15, 15, 15)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	scene.add(curveObject)

	boxGeometry = new THREE.BoxGeometry(2, 2, 2)
	cube = new THREE.Mesh(boxGeometry, material)
	scene.add(cube)

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const clock = new THREE.Clock()
const renderScene = () => {
	requestAnimationFrame(renderScene)
	const elapsed = clock.getElapsedTime()
	const time = (elapsed * 0.1) % 1
	const point = curve.getPoint(time)
	cube.position.copy(point)
	// camera.position.copy(point)
	// camera.lookAt(0, 0, 0)
	controls.update()
	renderer.render(scene, camera)
}

const clear = () => {
	if (cube) {
		scene.remove(cube)
	}
	if (geometry) {
		geometry.dispose()
	}
}

onUnmounted(() => {
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
