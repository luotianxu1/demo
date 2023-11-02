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
let geometry: THREE.ExtrudeGeometry
const length = 3
const width = 2

onMounted(() => {
	init()
})

const shape = new THREE.Shape()
shape.moveTo(0, 0)
shape.lineTo(0, width)
shape.lineTo(length, width)
shape.lineTo(length, 0)
shape.lineTo(0, 0)

let controlsData = reactive({
	curveSegments: 12,
	steps: 1,
	depth: 1,
	bevelEnabled: true,
	bevelThickness: 0.2,
	bevelSize: 0.1,
	bevelOffset: 0,
	bevelSegments: 3,
	wireframe: false
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(8, 2, 8)
	web.addAxesHelper()

	addExtrudeGeometry(controlsData)
	addGui()

	renderScene()
}

const addExtrudeGeometry = (data: typeof controlsData) => {
	web.destroyMesh("ExtrudeGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.ExtrudeGeometry(shape, controlsData)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "ExtrudeGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addExtrudeGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "curveSegments").name("曲线上点的数量(curveSegments)").min(0).max(100).step(1)
	gui.add(controlsData, "steps").name("细分数量(steps)").min(0).max(100).step(1)
	gui.add(controlsData, "depth").name("深度(depth)").min(0).max(20).step(1)
	gui.add(controlsData, "bevelEnabled").name("是否斜角(bevelEnabled)")
	gui.add(controlsData, "bevelThickness").name("厚度(bevelThickness)").min(0).max(1).step(0.1)
	gui.add(controlsData, "bevelSize").name("延伸距离(bevelSize)").min(0).max(1).step(0.1)
	gui.add(controlsData, "bevelOffset").name("斜角距离(bevelOffset)").min(0).max(5).step(0.1)
	gui.add(controlsData, "bevelSegments").name("斜角分段层数(bevelSegments)").min(0).max(5).step(1)
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
