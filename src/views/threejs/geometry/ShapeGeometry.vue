<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let cube: THREE.Mesh
let controlsData = reactive({
	curveSegments: 12,
	wireframe: false
})

onMounted(() => {
	init()
})

const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
})
let geometry: THREE.ShapeGeometry

const x = 0
const y = 0
const heartShape = new THREE.Shape()
heartShape.moveTo(x + 5, y + 5)
heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y)
heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7)
heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19)
heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7)
heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y)
heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5)

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(20, 30, 40)

	addShapeGeometry(controlsData)
	addGui()

	renderScene()
}

const addShapeGeometry = (data: typeof controlsData) => {
	web.destroyMesh("ShapeGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.ShapeGeometry(heartShape, controlsData.curveSegments)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "ShapeGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addShapeGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "curveSegments").name("分段数(curveSegments)").min(0).max(50)
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
