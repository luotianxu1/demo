<template>
	<div ref="webgl" class="webgl"></div>
</template>
<script setup lang="ts">
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
// 加载hdrloader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { float, texture, normalMap, uv, NodeMaterial, mx_noise_vec3 } from "three/nodes"
import { nodeFrame } from "three/addons/renderers/webgl/nodes/WebGLNodes.js"
// 珠光漆的法向贴图

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

	// 设置环境光
	let ambientLight = new THREE.AmbientLight(0xffffff, 1)
	scene.add(ambientLight)

	// 加载纹理
	let rgbeLoader = new RGBELoader()
	rgbeLoader.load("./textures/hdr/023.hdr", envMap => {
		envMap.mapping = THREE.EquirectangularReflectionMapping
		scene.background = envMap
		scene.environment = envMap
	})

	// 创建材质
	let material = new THREE.MeshPhysicalMaterial()
	// 在原有的材质上创建节点材质
	let nodeMaterial = NodeMaterial.fromMaterial(material)

	const textureLoader = new THREE.TextureLoader()
	let carbonTexture = textureLoader.load("./textures/map/Carbon.png")
	carbonTexture.encoding = THREE.sRGBEncoding
	carbonTexture.wrapS = THREE.RepeatWrapping
	carbonTexture.wrapT = THREE.RepeatWrapping
	let carbonNormal = textureLoader.load("./textures/map/Carbon_Normal.png")
	carbonNormal.wrapS = THREE.RepeatWrapping
	carbonNormal.wrapT = THREE.RepeatWrapping

	let carbonUv = uv().mul(5)
	nodeMaterial.colorNode = texture(carbonTexture, carbonUv)
	nodeMaterial.normalNode = normalMap(texture(carbonNormal, carbonUv)).mul(mx_noise_vec3(carbonUv))
	nodeMaterial.clearcoatNode = float(1)
	nodeMaterial.clearcoatRoughnessNode = float(0.01)
	nodeMaterial.roughnessNode = float(0.5)

	// 创建球体
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
	controls.update()
	nodeFrame.update()
	requestAnimationFrame(renderScene)
	renderer.render(scene, camera)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
