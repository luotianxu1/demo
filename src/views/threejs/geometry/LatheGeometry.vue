<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let cube: THREE.Mesh
const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
})
let geometry: THREE.LatheGeometry
let controlsData = reactive({
	segments: 12,
	phiStart: 0,
	phiLength: Math.PI * 2,
	wireframe: false
})

const points: THREE.Vector2[] | undefined = []
for (let i = 0; i < 10; i++) {
	points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 2, (i - 5) * 2))
}

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(30, 20, 30)
	web.addAxesHelper()

	addLatheGeometry(controlsData)
	addGui()

	renderScene()
}

const addLatheGeometry = (data: typeof controlsData) => {
	web.destroyMesh("LatheGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.LatheGeometry(points, controlsData.segments, controlsData.phiStart, controlsData.phiLength)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "LatheGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addLatheGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "segments").name("分段(segments)").min(0).max(100)
	gui
		.add(controlsData, "phiStart")
		.name("起始角度(phiStart)")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "phiLength")
		.name("弧度(phiLength)")
		.min(0)
		.max(Math.PI * 2)

	gui.add(controlsData, "wireframe").name("线框(wireframe)")
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
