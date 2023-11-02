<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let controlsData = reactive({
	width: 20,
	height: 20,
	depth: 20,
	widthSegments: 1,
	heightSegments: 1,
	depthSegments: 1,
	wireframe: false
})

let geometry: THREE.BoxGeometry
const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
})
let cube: THREE.Mesh

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.addAxesHelper()

	addBoxGeometry(controlsData)
	addGui()

	renderScene()
}

watch(controlsData, val => {
	addBoxGeometry(val)
})

const addBoxGeometry = (data: typeof controlsData) => {
	web.destroyMesh("BoxGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.BoxGeometry(
		data.width,
		data.height,
		data.depth,
		Math.round(data.widthSegments),
		Math.round(data.heightSegments),
		Math.round(data.depthSegments)
	)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "BoxGeometry"
	web.scene.add(cube)
}

const addGui = () => {
	const gui = web.addGUI()
	gui.add(controlsData, "width").name("宽度(width)").min(1).max(50)
	gui.add(controlsData, "height").name("高度(height)").min(1).max(50)
	gui.add(controlsData, "depth").name("深度(depth)").min(1).max(50)
	gui.add(controlsData, "widthSegments").name("宽度分段(widthSegments)").min(1).max(20).step(1)
	gui.add(controlsData, "heightSegments").name("高度分段(heightSegments)").min(1).max(20).step(1)
	gui.add(controlsData, "depthSegments").name("深度分段(depthSegments)").min(1).max(20).step(1)
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
