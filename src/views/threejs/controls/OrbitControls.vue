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

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xcccccc)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(400, 200, 0)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true
	controls.dampingFactor = 0.05
	controls.screenSpacePanning = false
	controls.minDistance = 100
	controls.maxDistance = 500
	controls.maxPolarAngle = Math.PI / 2

	const geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1)
	const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true })
	for (let i = 0; i < 500; i++) {
		const mesh = new THREE.Mesh(geometry, material)
		mesh.position.x = Math.random() * 1600 - 800
		mesh.position.y = 0
		mesh.position.z = Math.random() * 1600 - 800
		mesh.updateMatrix()
		mesh.matrixAutoUpdate = false
		scene.add(mesh)
	}

	const dirLight1 = new THREE.DirectionalLight(0xffffff)
	dirLight1.position.set(1, 1, 1)
	scene.add(dirLight1)

	const dirLight2 = new THREE.DirectionalLight(0x002288)
	dirLight2.position.set(-1, -1, -1)
	scene.add(dirLight2)

	const ambientLight = new THREE.AmbientLight(0x222222)
	scene.add(ambientLight)

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
