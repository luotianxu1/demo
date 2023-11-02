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
let geometry: THREE.TorusKnotGeometry

let controlsData = reactive({
	radius: 6,
	tube: 0.4,
	radialSegments: 12,
	tubularSegments: 48,
	p: 2,
	q: 3,
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

	addTorusKnotGeometry(controlsData)
	addGui()

	renderScene()
}

const addTorusKnotGeometry = (data: typeof controlsData) => {
	web.destroyMesh("TorusKnotGeometry")

	material.wireframe = data.wireframe
	geometry = new THREE.TorusKnotGeometry(
		controlsData.radius,
		controlsData.tube,
		controlsData.tubularSegments,
		controlsData.radialSegments,
		controlsData.p,
		controlsData.q
	)
	cube = new THREE.Mesh(geometry, material)
	cube.name = "TorusKnotGeometry"
	web.scene.add(cube)
}

watch(controlsData, val => {
	addTorusKnotGeometry(val)
})

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "radius").name("圆环半径(radius)").min(0).max(50)
	gui.add(controlsData, "tube").name("管道半径(tube)").min(0).max(2)
	gui.add(controlsData, "radialSegments").name("管道分段(radialSegments)").min(0).max(100)
	gui.add(controlsData, "tubularSegments").name("横截面分段(tubularSegments)").min(0).max(100)
	gui.add(controlsData, "p").name("绕旋转对称轴旋转次数(p)").min(1).max(10).step(1)
	gui.add(controlsData, "q").name("绕旋转对称轴旋转次数(q)").min(1).max(10).step(1)
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
