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
const AMOUNT = 6
let mesh: THREE.Object3D<THREE.Event> | THREE.Mesh<THREE.CylinderGeometry, THREE.MeshPhongMaterial>

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x444444)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.set(0, 0, 150)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(window.innerWidth, window.innerHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	const WIDTH = (window.innerWidth / AMOUNT) * window.devicePixelRatio
	const HEIGHT = (window.innerHeight / AMOUNT) * window.devicePixelRatio

	const cameras = []
	for (let y = 0; y < AMOUNT; y++) {
		for (let x = 0; x < AMOUNT; x++) {
			let subcamera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10)
			;(subcamera as any).viewport = new THREE.Vector4(
				Math.floor(x * WIDTH),
				Math.floor(y * HEIGHT),
				Math.ceil(WIDTH),
				Math.ceil(HEIGHT)
			)
			subcamera.position.x = x / AMOUNT - 0.5
			subcamera.position.y = 0.5 - y / AMOUNT
			subcamera.position.z = 1.5
			subcamera.position.multiplyScalar(2)
			subcamera.lookAt(0, 0, 0)
			subcamera.updateMatrixWorld()
			cameras.push(subcamera)
		}
	}
	camera = new THREE.ArrayCamera(cameras)
	camera.position.z = 3

	scene.add(new THREE.AmbientLight(0x222244))
	const light = new THREE.DirectionalLight()
	light.position.set(0.5, 0.5, 1)
	light.castShadow = true
	light.shadow.camera.zoom = 4 // tighter shadow map
	scene.add(light)

	const geometryBackground = new THREE.PlaneGeometry(100, 100)
	const materialBackground = new THREE.MeshPhongMaterial({ color: 0x000066 })
	const background = new THREE.Mesh(geometryBackground, materialBackground)
	background.receiveShadow = true
	background.position.set(0, 0, -1)
	scene.add(background)

	const geometryCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
	const materialCylinder = new THREE.MeshPhongMaterial({ color: 0xff0000 })
	mesh = new THREE.Mesh(geometryCylinder, materialCylinder)
	mesh.castShadow = true
	mesh.receiveShadow = true
	scene.add(mesh)

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	mesh.rotation.x += 0.005
	mesh.rotation.z += 0.01
	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
