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
let spotLight: THREE.SpotLight
let spotLightHelper: THREE.SpotLightHelper

let controlsData = reactive({
	spotColor: "#ffffff",
	intensity: 0.5,
	distance: 0,
	angle: 0.4,
	penumbra: 0,
	decay: 1,
	castShadow: true,
	movingLight: true,
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

	spotLight = new THREE.SpotLight(
		controlsData.spotColor,
		controlsData.intensity,
		controlsData.distance,
		controlsData.angle,
		controlsData.penumbra,
		controlsData.decay
	)
	scene.add(spotLight)
	spotLight.target = plane
	spotLightHelper = new THREE.SpotLightHelper(spotLight)
	scene.add(spotLightHelper)

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
	spotLight.position.z = -8
	spotLight.position.y = Number(27 * Math.sin(step / 3))
	spotLight.position.x = 10 + 26 * Math.cos(step / 3)
	spotLight.updateMatrix()
	controls.update()
	spotLightHelper.update()
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.addColor(controlsData, "spotColor")
	gui.add(controlsData, "angle", 0, Math.PI / 2)
	gui.add(controlsData, "intensity", 0, 5)
	gui.add(controlsData, "penumbra", 0, 1)
	gui.add(controlsData, "distance", 0, 200)
	gui.add(controlsData, "decay", 0, 2)
	gui.add(controlsData, "castShadow")
	gui.add(controlsData, "target", ["Plane", "Sphere", "Cube"])
}

watch(controlsData, val => {
	spotLight.color = new THREE.Color(val.spotColor)
	spotLight.angle = val.angle
	spotLight.intensity = val.intensity
	spotLight.penumbra = val.penumbra
	spotLight.distance = val.distance
	spotLight.decay = val.decay
	spotLight.castShadow = val.castShadow
	spotLight.target = targetList[val.target]
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
