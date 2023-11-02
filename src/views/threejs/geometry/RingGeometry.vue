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
let geometry: THREE.RingGeometry

let controlsData = reactive({
	innerRadius: 1,
	outerRadius: 5,
	thetaSegments: 5,
	phiSegments: 4,
	thetaStart: 0,
	thetaLength: Math.PI * 2,
	wireframe: false
})

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(20, 10, 30)
	web.addAxesHelper()

	addRingGeometry(controlsData)
	addGui()

	renderScene()
}

const addRingGeometry = (data: typeof controlsData) => {
	web.destroyMesh("RingGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.RingGeometry(
		controlsData.innerRadius,
		controlsData.outerRadius,
		controlsData.thetaSegments,
		controlsData.phiSegments,
		controlsData.thetaStart,
		controlsData.thetaLength
	)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "RingGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addRingGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "innerRadius").name("内部半径(innerRadius)").min(0).max(20)
	gui.add(controlsData, "outerRadius").name("外部半径(outerRadius)").min(5).max(20)
	gui.add(controlsData, "thetaSegments").name("分段数(thetaSegments)").min(3).max(32)
	gui.add(controlsData, "phiSegments").min(1).max(8)
	gui
		.add(controlsData, "thetaStart")
		.name("起始角度(thetaStart)")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "thetaLength")
		.name(" 圆心角(thetaLength)")
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
