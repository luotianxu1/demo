<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { addHouseAndTree } from "@utils/threejsShape"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl

onMounted(() => {
	init()
})

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

	web = new WebGl(webgl.value)
	web.camera.position.set(70, 70, 70)
	web.addAmbientLight("#0c0c0c")

	pointLight = web.addPointLight(0, 0, 0, controlsData.color)
	pointLightHelper = new THREE.PointLightHelper(pointLight)
	web.scene.add(pointLightHelper)

	addHouseAndTree(web.scene)
	addGui()

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
	pointLightHelper.update()
	web.update()
	requestAnimationFrame(renderScene)
}

const addGui = () => {
	let gui = web.addGUI()
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
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
