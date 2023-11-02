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
let geometry: THREE.TubeGeometry

let controlsData = reactive({
	radius: 6,
	tubularSegments: 48,
	radialSegments: 8,
	closed: false,
	wireframe: false
})

onMounted(() => {
	init()
})

class CustomSinCurve extends THREE.Curve<any> {
	scale: number
	constructor(scale = 1) {
		super()
		this.scale = scale
	}
	getPoint(t: number, optionalTarget = new THREE.Vector3()) {
		const tx = t * 3 - 1.5
		const ty = Math.sin(2 * Math.PI * t)
		const tz = 0
		return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale)
	}
}
const path = new CustomSinCurve(10)

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(20, 10, 30)
	web.addAxesHelper()

	addTubeGeometry(controlsData)
	addGui()

	renderScene()
}

const addTubeGeometry = (data: typeof controlsData) => {
	web.destroyMesh("TubeGeometry")
	material.wireframe = data.wireframe
	geometry = new THREE.TubeGeometry(
		path,
		controlsData.tubularSegments,
		controlsData.radius,
		controlsData.radialSegments,
		controlsData.closed
	)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "TubeGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addTubeGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "radius").name("半径(radius)").min(0).max(50)
	gui.add(controlsData, "tubularSegments").name("分段数(tubularSegments)").min(0).max(100).step(1)
	gui.add(controlsData, "radialSegments").name("横截面的分段数目(radialSegments)").min(1).max(50).step(1)
	gui.add(controlsData, "closed").name("闭合(closed)")
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
