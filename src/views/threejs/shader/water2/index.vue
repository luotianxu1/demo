<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Water } from "three/examples/jsm/objects/Water2"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

const webgl = ref()
onMounted(() => {
	init()
})

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 5, 5)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
scene.add(directionalLight)

// 加载场景背景
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync("./textures/hdr/050.hdr").then(texture => {
	texture.mapping = THREE.EquirectangularReflectionMapping
	scene.background = texture
	scene.environment = texture
})

const gltfLoader = new GLTFLoader()
gltfLoader.load("./threejs/shader/yugang.glb", (gltf: any) => {
	const yugang = gltf.scene.children[0]
	yugang.material.side = THREE.DoubleSide

	const waterGeometry = gltf.scene.children[1].geometry
	const water = new Water(waterGeometry, {
		color: "#fff",
		scale: 1,
		flowDirection: new THREE.Vector2(1, 1),
		textureHeight: 1024,
		textureWidth: 1024
	})
	scene.add(gltf.scene)
	scene.add(water)
})

const init = () => {
	if (!webgl.value) {
		return
	}

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}
</script>

<style lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}

.label {
	display: none;
	font-size: 0.2rem;
	color: #fff;
}

.visible {
	display: block;
}
</style>
