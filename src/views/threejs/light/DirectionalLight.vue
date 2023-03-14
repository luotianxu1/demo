<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
import { addDefaultCubeAndSphere, addGroundPlane } from "@utils/threejsShape"

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
let cube: THREE.Mesh
let sphere: THREE.Mesh
let plane: THREE.Mesh
let targetList: any
let directionalLight: THREE.DirectionalLight
let cameraHelper: THREE.CameraHelper

let controlsData = reactive({
	color: "#ff5808",
	intensity: 1,
	target: "Plane"
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
	renderer.shadowMap.enabled = true

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	ambientLight = new THREE.AmbientLight("#1c1c1c")
	scene.add(ambientLight)

	const cubeAndSphere = addDefaultCubeAndSphere(scene)
	cube = cubeAndSphere.cube
	sphere = cubeAndSphere.sphere
	plane = addGroundPlane(scene)
	targetList = {
		Cube: cube,
		Plane: plane,
		Sphere: sphere
	}

	directionalLight = new THREE.DirectionalLight(controlsData.color, controlsData.intensity)
	directionalLight.position.set(-40, 60, -10)
	directionalLight.castShadow = true
	directionalLight.target = plane
	scene.add(directionalLight)
	cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
	scene.add(cameraHelper)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

let step = 0
const clock = new THREE.Clock()
const renderScene = () => {
	const delta = clock.getDelta()
	cube.rotation.x += delta
	cube.rotation.y += delta
	cube.rotation.z += delta
	step += delta
	sphere.position.x = 20 + 10 * Math.cos(step)
	sphere.position.y = 2 + 10 * Math.abs(Math.sin(step))
	directionalLight.position.z = -8
	directionalLight.position.y = Number(27 * Math.sin(step / 3))
	directionalLight.position.x = 10 + 26 * Math.cos(step / 3)
	directionalLight.updateMatrix()
	controls.update()
	cameraHelper.update()
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.addColor(controlsData, "color")
	gui.add(controlsData, "intensity", 0, 3, 0.01)
	gui.add(controlsData, "target", ["Cube", "Plane", "Sphere"])
}

watch(controlsData, val => {
	directionalLight.color = new THREE.Color(val.color)
	directionalLight.intensity = val.intensity
	directionalLight.target = targetList[val.target]
	console.log(directionalLight)
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
