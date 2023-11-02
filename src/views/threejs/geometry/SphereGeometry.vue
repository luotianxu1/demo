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
let geometry: THREE.SphereGeometry

let controlsData = reactive({
	radius: 5,
	widthSegments: 32,
	heightSegments: 16,
	phiStart: 0,
	phiLength: Math.PI * 2,
	thetaStart: 0,
	thetaLength: Math.PI,
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

	addSphereGeometry(controlsData)
	addGui()

	renderScene()
}

const addSphereGeometry = (data: typeof controlsData) => {
	web.destroyMesh("SphereGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.SphereGeometry(
		controlsData.radius,
		controlsData.widthSegments,
		controlsData.heightSegments,
		controlsData.phiStart,
		controlsData.phiLength,
		controlsData.thetaStart,
		controlsData.thetaLength
	)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "SphereGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addSphereGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "radius").name("半径(radius)").min(0).max(50)
	gui.add(controlsData, "widthSegments").name("水平分段数(widthSegments)").min(3).max(100)
	gui.add(controlsData, "heightSegments").name("垂直分段数(heightSegments)").min(2).max(100)
	gui
		.add(controlsData, "phiStart")
		.name("水平起始角度(phiStart)")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "phiLength")
		.name("水平扫描角度(phiLength)")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "thetaStart")
		.name("垂直起始角度(thetaStart)")
		.min(0)
		.max(Math.PI * 2)
	gui
		.add(controlsData, "thetaLength")
		.name("垂直扫描角度(thetaLength)")
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
