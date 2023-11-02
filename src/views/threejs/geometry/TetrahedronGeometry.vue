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
let geometry: THREE.TetrahedronGeometry

let controlsData = reactive({
	radius: 6,
	detail: 0,
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

	addTetrahedronGeometry(controlsData)
	addGui()

	renderScene()
}

const addTetrahedronGeometry = (data: typeof controlsData) => {
	web.destroyMesh("TetrahedronGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.TetrahedronGeometry(controlsData.radius, controlsData.detail)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "TetrahedronGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addTetrahedronGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "radius").name("半径(radius)").min(0).max(50)
	gui.add(controlsData, "detail").name("顶点(detail)").min(0).max(10).step(1)
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
