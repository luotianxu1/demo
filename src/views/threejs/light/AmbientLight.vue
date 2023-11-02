<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { addHouseAndTree } from "@/utils/threejsShape"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let ambientLight: THREE.AmbientLight
let controlsData = reactive({
	intensity: 1,
	color: "#606008"
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

	addHouseAndTree(web.scene)
	ambientLight = web.addAmbientLight(controlsData.color, controlsData.intensity)
	addGui()

	renderScene()
}

const addGui = () => {
	let gui = web.addGUI()
	gui.addColor(controlsData, "color").name("颜色(color)")
	gui.add(controlsData, "intensity", 0, 3, 0.01).name("强度(intensity)")
}

watch(controlsData, val => {
	ambientLight.color = new THREE.Color(val.color)
	ambientLight.intensity = val.intensity
})

const renderScene = () => {
	requestAnimationFrame(renderScene)
	web.update()
}

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
