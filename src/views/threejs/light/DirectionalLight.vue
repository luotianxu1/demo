<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { addDefaultCubeAndSphere, addGroundPlane } from "@utils/threejsShape"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl

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

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(50, 50, 50)

	web.addAmbientLight("#1c1c1c")

	const cubeAndSphere = addDefaultCubeAndSphere(web.scene)
	cube = cubeAndSphere.cube
	sphere = cubeAndSphere.sphere
	plane = addGroundPlane(web.scene)

	targetList = {
		Cube: cube,
		Plane: plane,
		Sphere: sphere
	}

	directionalLight = web.addDirectionalLight(-40, 60, -10, controlsData.color, controlsData.intensity)
	directionalLight.target = plane

	cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
	web.scene.add(cameraHelper)
	addGui()

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
	cameraHelper.update()
	web.update()
	requestAnimationFrame(renderScene)
}

const addGui = () => {
	let gui = web.addGUI()
	gui.addColor(controlsData, "color").name("颜色(color)")
	gui.add(controlsData, "intensity", 0, 3, 0.01).name("强度(intensity)")
	gui.add(controlsData, "target", ["Cube", "Plane", "Sphere"])
}

watch(controlsData, val => {
	directionalLight.color = new THREE.Color(val.color)
	directionalLight.intensity = val.intensity
	directionalLight.target = targetList[val.target]
})

onUnmounted(() => {
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
