<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let gui: dat.GUI
let cubeRenderTarget: THREE.WebGLCubeRenderTarget
let cubeCamera: THREE.CubeCamera
let material: THREE.MeshStandardMaterial
let sphere: THREE.Mesh
let cube: THREE.Mesh
let torus: THREE.Mesh

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x444444)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 1, 1000)
	camera.position.z = 75

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.setAnimationLoop(animation)
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.toneMapping = THREE.ACESFilmicToneMapping

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)
	controls.autoRotate = true

	const material2 = new THREE.MeshStandardMaterial({
		roughness: 0.1,
		metalness: 0
	})
	cube = new THREE.Mesh(new THREE.BoxGeometry(15, 15, 15), material2)
	scene.add(cube)

	torus = new THREE.Mesh(new THREE.TorusKnotGeometry(8, 3, 128, 16), material2)
	scene.add(torus)

	cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256)
	cubeRenderTarget.texture.type = THREE.HalfFloatType

	cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget)

	material = new THREE.MeshStandardMaterial({
		roughness: 0.05,
		metalness: 1
	})

	// 加载hdr
	const rgbeLoader = new RGBELoader()
	rgbeLoader.loadAsync("./textures/hdr/050.hdr").then(texture => {
		texture.mapping = THREE.EquirectangularReflectionMapping
		texture.format = THREE.RGBAFormat
		scene.background = texture
		scene.environment = texture
		material.envMap = cubeRenderTarget.texture
	})

	sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(15, 8), material)
	scene.add(sphere)

	addGui()
	webgl.value.appendChild(renderer.domElement)
}

function animation(msTime: number) {
	const time = msTime / 1000
	cube.position.x = Math.cos(time) * 30
	cube.position.y = Math.sin(time) * 30
	cube.position.z = Math.sin(time) * 30
	cube.rotation.x += 0.02
	cube.rotation.y += 0.03
	torus.position.x = Math.cos(time + 10) * 30
	torus.position.y = Math.sin(time + 10) * 30
	torus.position.z = Math.sin(time + 10) * 30
	torus.rotation.x += 0.02
	torus.rotation.y += 0.03
	cubeCamera.update(renderer, scene)
	controls.update()
	renderer.render(scene, camera)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.add(material, "roughness", 0, 1)
	gui.add(material, "metalness", 0, 1)
	gui.add(renderer, "toneMappingExposure", 0, 2).name("exposure")
}

onUnmounted(() => {
	gui.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
