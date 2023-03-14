<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"
const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(10, 10, -15)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.outputEncoding = THREE.sRGBEncoding

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	const rectLight1 = new THREE.RectAreaLight(0xff0000, 5, 4, 10)
	rectLight1.position.set(-5, 5, 5)
	scene.add(rectLight1)

	const rectLight2 = new THREE.RectAreaLight(0x00ff00, 5, 4, 10)
	rectLight2.position.set(0, 5, 5)
	scene.add(rectLight2)

	const rectLight3 = new THREE.RectAreaLight(0x0000ff, 5, 4, 10)
	rectLight3.position.set(5, 5, 5)
	scene.add(rectLight3)

	scene.add(new RectAreaLightHelper(rectLight1))
	scene.add(new RectAreaLightHelper(rectLight2))
	scene.add(new RectAreaLightHelper(rectLight3))

	const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000)
	const matStdFloor = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.1, metalness: 0 })
	const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor)
	scene.add(mshStdFloor)

	const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16)
	const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 })
	const meshKnot = new THREE.Mesh(geoKnot, matKnot)
	meshKnot.name = "meshKnot"
	meshKnot.position.set(0, 5, 0)
	scene.add(meshKnot)

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
