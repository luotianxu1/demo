<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
import { addHouseAndTree } from "@utils/threejsShape"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let gui: dat.GUI
let ambientLight: THREE.AmbientLight
let pointLight: THREE.PointLight
let pointLightHelper: THREE.PointLightHelper

let controlsData = reactive({
	color: "#ccffcc",
	distance: 0,
	intensity: 1,
	decay: 1
})

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(50, 50, 50)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	ambientLight = new THREE.AmbientLight("#0c0c0c")
	scene.add(ambientLight)

	pointLight = new THREE.PointLight(controlsData.color)
	pointLight.position.set(0, 0, 0)
	scene.add(pointLight)

	pointLightHelper = new THREE.PointLightHelper(pointLight)
	scene.add(pointLightHelper)

	addHouseAndTree(scene)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

let invert = 1
let phase = 0
const clock = new THREE.Clock()
const renderScene = () => {
	const time = clock.getDelta()
	if (phase > 2 * Math.PI) {
		invert = invert * -1
		phase -= 2 * Math.PI
	} else {
		phase += time
	}
	pointLight.position.z = Number(25 * Math.sin(phase))
	pointLight.position.x = Number(14 * Math.cos(phase))
	pointLight.position.y = 5
	if (invert < 0) {
		const pivot = 14
		pointLight.position.x = invert * (pointLight.position.x - pivot) + pivot
	}
	requestAnimationFrame(renderScene)
	controls.update()
	pointLightHelper.update()
	renderer.render(scene, camera)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.addColor(controlsData, "color")
	gui.add(controlsData, "distance", 0, 100, 0.01)
	gui.add(controlsData, "intensity", 0, 3, 0.01)
	gui.add(controlsData, "decay", 0, 3, 0.01)
}

watch(controlsData, val => {
	pointLight.color = new THREE.Color(val.color)
	pointLight.distance = val.distance
	pointLight.intensity = val.intensity
	pointLight.decay = val.decay
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
