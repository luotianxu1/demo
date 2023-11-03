<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { gosper } from "@utils/threejsShape"

const webgl = ref<HTMLDivElement>()
let web: WebGl
const points = gosper(4, 60)
let controlsData = reactive({
	color: 0xffffff,
	dashSize: 10,
	scale: 0.1,
	gapSize: 1
})

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(0, 0, 180)

	addBoxGeometry(controlsData)
	addGui()

	renderScene()
}

const addBoxGeometry = (data: typeof controlsData) => {
	web.destroyMesh("line")
	const lines = new THREE.BufferGeometry()
	lines.setFromPoints(points)
	const material = new THREE.LineDashedMaterial({
		color: data.color,
		dashSize: controlsData.dashSize,
		scale: data.scale,
		gapSize: data.gapSize
	})
	const line = new THREE.Line(lines, material)
	line.computeLineDistances()
	line.name = "line"
	web.scene.add(line)
}

watch(controlsData, val => {
	addBoxGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.addColor(controlsData, "color").name("颜色(color)")
	gui.add(controlsData, "dashSize").name("虚线大小(dashSize)").min(0).max(100).step(1)
	gui.add(controlsData, "scale").name("虚线占比(scale)").min(0).max(100).step(1)
	gui.add(controlsData, "gapSize").name("间隙大小(gapSize)").min(0).max(100).step(1)
}
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
