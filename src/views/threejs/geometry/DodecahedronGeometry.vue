<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let controlsData = reactive({
	radius: 2,
	detail: 0,
	wireframe: false
})

let cube: THREE.Mesh
const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
})
let geometry: THREE.DodecahedronGeometry

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(8, 2, 8)
	web.addAxesHelper()

	addDodecahedronGeometry(controlsData)
	addGui()
	renderScene()
}

const addDodecahedronGeometry = (data: typeof controlsData) => {
	web.destroyMesh("DodecahedronGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.DodecahedronGeometry(data.radius, data.detail)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "DodecahedronGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addDodecahedronGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "radius").name("半径(radius)").min(0).max(5)
	gui.add(controlsData, "detail").name("顶点(detail)").min(0).max(4).step(1)
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
