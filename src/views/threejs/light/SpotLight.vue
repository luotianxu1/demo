<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { addDefaultCubeAndSphere, addGroundPlane } from "@utils/threejsShape"

const webgl = ref<HTMLDivElement>()
let web: WebGl

onMounted(() => {
	init()
})

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

	spotLight = new THREE.SpotLight(
		controlsData.spotColor,
		controlsData.intensity,
		controlsData.distance,
		controlsData.angle,
		controlsData.penumbra,
		controlsData.decay
	)
	web.scene.add(spotLight)
	spotLight.target = plane
	spotLightHelper = new THREE.SpotLightHelper(spotLight)
	web.scene.add(spotLightHelper)

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
	spotLight.position.z = -8
	spotLight.position.y = Number(27 * Math.sin(step / 3))
	spotLight.position.x = 10 + 26 * Math.cos(step / 3)
	spotLight.updateMatrix()
	spotLightHelper.update()
	web.update()
	requestAnimationFrame(renderScene)
}

const addGui = () => {
	const gui = web.addGUI()
	gui.addColor(controlsData, "spotColor").name("颜色(spotColor)")
	gui.add(controlsData, "angle", 0, Math.PI / 2).name("角度(angle)")
	gui.add(controlsData, "intensity", 0, 5).name("光照强度(intensity)")
	gui.add(controlsData, "penumbra", 0, 1).name("衰减速度(penumbra)")
	gui.add(controlsData, "distance", 0, 200).name("最大距离(distance)")
	gui.add(controlsData, "decay", 0, 2).name("衰减量(decay)")
	gui.add(controlsData, "castShadow").name("接受阴影(castShadow)")
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
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
