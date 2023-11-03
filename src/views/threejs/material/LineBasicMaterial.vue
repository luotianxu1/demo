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
	linewidth: 100,
	linecap: "butt",
	linejoin: "round"
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
	const material = new THREE.LineBasicMaterial({
		color: data.color,
		linewidth: data.linewidth,
		linecap: data.linecap,
		linejoin: data.linejoin
	})
	const line = new THREE.Line(lines, material)
	line.position.set(0, 0, 0)
	line.name = "line"
	web.scene.add(line)
}

watch(controlsData, val => {
	addBoxGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.addColor(controlsData, "color").name("颜色(color)")
	gui.add(controlsData, "linewidth").name("线宽(linewidth)").min(0).max(100).step(1)
	gui.add(controlsData, "linecap", ["butt", "round", "round"]).name("两端的样式(linecap)")
	gui.add(controlsData, "linejoin", ["butt", "round", "round"]).name("节点的样式(linejoin)")
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
