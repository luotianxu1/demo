<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let controlsData = reactive({
	radius: 3,
	segments: 10,
	thetaStart: 0,
	thetaLength: 2 * Math.PI,
	wireframe: false
})
let cube: THREE.Mesh
const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
})
let geometry: THREE.CircleGeometry

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(5, 2, 10)
	web.addAxesHelper()

	addCircleGeometry(controlsData)
	addGui()

	renderScene()
}

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
}

const addCircleGeometry = (data: typeof controlsData) => {
	web.destroyMesh("CircleGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.CircleGeometry(data.radius, data.segments, data.thetaStart, data.thetaLength)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "CircleGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addCircleGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "radius").name("半径(radius)").min(1).max(10)
	gui.add(controlsData, "segments").name(" 分段数量(segments)").min(3).max(100).step(1)
	gui
		.add(controlsData, "thetaStart")
		.name("起始角度(thetaStart)")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "thetaLength")
		.name("中心角(thetaLength)")
		.min(0)
		.max(Math.PI * 2)
	gui.add(controlsData, "wireframe").name("线框(wireframe)")
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
