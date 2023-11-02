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
let geometry: THREE.TorusGeometry

let controlsData = reactive({
	radius: 6,
	tube: 0.4,
	radialSegments: 12,
	tubularSegments: 48,
	arc: Math.PI * 2,
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

	addTorusGeometry(controlsData)
	addGui()

	renderScene()
}

const addTorusGeometry = (data: typeof controlsData) => {
	web.destroyMesh("TorusGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.TorusGeometry(
		controlsData.radius,
		controlsData.tube,
		controlsData.radialSegments,
		controlsData.tubularSegments,
		controlsData.arc
	)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "TorusGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addTorusGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "radius").name("环面半径(radius)").min(0).max(50)
	gui.add(controlsData, "tube").name("管道半径(tube)").min(0).max(2)
	gui.add(controlsData, "radialSegments").name("横截面分段(radialSegments)").min(0).max(100)
	gui.add(controlsData, "tubularSegments").name("管道分段(tubularSegments)").min(0).max(100)
	gui
		.add(controlsData, "arc")
		.name("圆心角(arc)")
		.min(0)
		.max(Math.PI * 2)
	gui.add(controlsData, "wireframe")
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
