<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { vec2, uv, NodeMaterial, checker, timerLocal } from "three/nodes"
import { nodeFrame } from "three/addons/renderers/webgl/nodes/WebGLNodes.js"

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
	scene = new THREE.Scene()
	camera = new THREE.PerspectiveCamera(45, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 1.5, 5)
	camera.lookAt(0, 0, -2)
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	renderer.toneMappingExposure = 2
	controls = new OrbitControls(camera, renderer.domElement)
	webgl.value.appendChild(renderer.domElement)

	const material = new THREE.MeshBasicMaterial()

	// 创建节点材质
	// const nodeMaterial = new MeshPhysicalNodeMaterial()
	let nodeMaterial = NodeMaterial.fromMaterial(material)
	// 设置器棋盘纹理
	let uvNode = uv()
		.mul(5)
		.add(vec2(timerLocal().add(-0.5).mul(3), 0.25))
	let node = checker(uvNode)
	nodeMaterial.colorNode = node
	nodeMaterial.color = new THREE.Color(0xff0000)

	let geometry = new THREE.SphereGeometry(0.5, 32, 32)
	let sphere = new THREE.Mesh(geometry, nodeMaterial)
	sphere.position.set(2, 0, 0)
	scene.add(sphere)
	// 创建立方体
	let cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
	let cube = new THREE.Mesh(cubeGeometry, nodeMaterial)
	cube.position.set(-2, 0, 0)
	scene.add(cube)
	// 创建平面
	let planeGeometry = new THREE.PlaneGeometry(1, 1, 10, 10)
	let plane = new THREE.Mesh(planeGeometry, nodeMaterial)
	scene.add(plane)

	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	nodeFrame.update()
	renderer.render(scene, camera)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
