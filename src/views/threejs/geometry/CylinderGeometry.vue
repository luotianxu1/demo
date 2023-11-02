<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let controlsData = reactive({
	radiusTop: 2,
	radiusBottom: 2,
	height: 5,
	radialSegments: 32,
	heightSegments: 1,
	openEnded: true,
	thetaStart: 0,
	thetaLength: Math.PI * 2,
	wireframe: false
})
const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
})
let geometry: THREE.CylinderGeometry
let cube: THREE.Mesh

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

	addCylinderGeometry(controlsData)
	addGui()

	renderScene()
}

const addCylinderGeometry = (data: typeof controlsData) => {
	web.destroyMesh("CylinderGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.CylinderGeometry(
		data.radiusTop,
		data.radiusBottom,
		data.height,
		data.radialSegments,
		data.heightSegments,
		data.openEnded,
		data.thetaStart,
		data.thetaLength
	)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "CylinderGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addCylinderGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "radiusTop").name("顶部半径(radiusTop)").min(1).max(20)
	gui.add(controlsData, "radiusBottom").name("底部半径(radiusBottom)").min(1).max(20)
	gui.add(controlsData, "height").name("高度(height)").min(3).max(20)
	gui.add(controlsData, "radialSegments").name("侧面分段(radialSegments)").min(0).max(100).step(1)
	gui.add(controlsData, "heightSegments").name("高度分段(heightSegments)").min(0).max(100).step(1)
	gui.add(controlsData, "openEnded").name("闭合(openEnded)")
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
