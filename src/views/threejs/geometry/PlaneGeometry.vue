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
let geometry: THREE.PlaneGeometry
let controlsData = reactive({
	width: 3,
	height: 3,
	widthSegments: 1,
	heightSegments: 1,
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
	web.camera.position.set(8, 2, 8)
	web.addAxesHelper()

	addPlaneGeometry(controlsData)
	addGui()

	renderScene()
}

const addPlaneGeometry = (data: typeof controlsData) => {
	web.destroyMesh("PlaneGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.PlaneGeometry(data.width, data.height, Math.round(data.widthSegments), Math.round(data.heightSegments))
	cube = new THREE.Mesh(geometry, material)
	cube.name = "PlaneGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addPlaneGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "width").name("宽度(width)").min(1).max(20)
	gui.add(controlsData, "height").name("高度(height)").min(1).max(20)
	gui.add(controlsData, "widthSegments").name("宽度分段(widthSegments)").min(1).max(20).step(1)
	gui.add(controlsData, "heightSegments").name("高度分段(heightSegments)").min(1).max(20).step(1)
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
