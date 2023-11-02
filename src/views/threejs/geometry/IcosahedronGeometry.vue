<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

onMounted(() => {
	init()
})

const webgl = ref<HTMLDivElement>()
let web: WebGl
let cube: THREE.Mesh
const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
})
let geometry: THREE.IcosahedronGeometry
let controlsData = reactive({
	radius: 2,
	detail: 0,
	wireframe: false
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(8, 2, 8)
	web.addAxesHelper()

	addIcosahedronGeometry(controlsData)

	addGui()
	renderScene()
}

const addIcosahedronGeometry = (data: typeof controlsData) => {
	web.destroyMesh("IcosahedronGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.IcosahedronGeometry(data.radius, data.detail)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "IcosahedronGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addIcosahedronGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "radius").name("半径(radius)").min(0).max(5)
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
