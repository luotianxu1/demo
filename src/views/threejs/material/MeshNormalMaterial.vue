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

let controlsData = reactive<THREE.MeshNormalMaterialParameters>({
	flatShading: true,
	transparent: false,
	opacity: 1,
	depthTest: true,
	depthWrite: true,
	visible: true,
	alphaTest: 0
})

const geometry = new THREE.SphereGeometry(14, 20, 20)
const material = new THREE.MeshNormalMaterial({
	...(controlsData as unknown as THREE.MeshNormalMaterialParameters)
})
const mesh = new THREE.Mesh(geometry, material)

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x444444)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 2000)
	camera.position.set(25, 25, 25)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	const ambientLight = new THREE.AmbientLight(0x000000)
	scene.add(ambientLight)

	const light1 = new THREE.PointLight(0xffffff, 1, 0)
	light1.position.set(0, 200, 0)
	scene.add(light1)

	const light2 = new THREE.PointLight(0xffffff, 1, 0)
	light2.position.set(100, 200, 100)
	scene.add(light2)

	const light3 = new THREE.PointLight(0xffffff, 1, 0)
	light3.position.set(-100, -200, -100)
	scene.add(light3)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	scene.add(mesh)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.add(controlsData, "flatShading")
	gui.add(controlsData, "transparent")
	gui.add(controlsData, "opacity", 0, 1)
	gui.add(controlsData, "depthTest")
	gui.add(controlsData, "depthWrite")
	gui.add(controlsData, "visible")
	gui.add(controlsData, "alphaTest", 0, 1)
}

watch(controlsData, val => {
	material.flatShading = val.flatShading as boolean
	material.transparent = val.transparent as boolean
	material.depthTest = val.depthTest as boolean
	material.opacity = val.opacity as number
	material.depthWrite = val.depthWrite as boolean
	material.visible = val.visible as boolean
	material.alphaTest = val.alphaTest as number
	material.needsUpdate = true
})

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
