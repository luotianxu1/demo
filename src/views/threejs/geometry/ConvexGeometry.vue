<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry"
import { Vector3 } from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let cube: THREE.Mesh
const material = new THREE.MeshNormalMaterial({
	side: THREE.DoubleSide
})
let geometry: ConvexGeometry

onMounted(() => {
	init()
})

let controlsData = reactive({
	draw: () => {
		web.destroyMesh("ConvexGeometry")
		let points: any = []
		for (let i = 0; i < 20; i++) {
			let randomX = -15 + Math.round(Math.random() * 30)
			let randomY = -15 + Math.round(Math.random() * 30)
			let randomZ = -15 + Math.round(Math.random() * 30)
			points.push(new Vector3(randomX, randomY, randomZ))
		}

		geometry = new ConvexGeometry(points)
		cube = new THREE.Mesh(geometry, material)
		cube.name = "ConvexGeometry"
		web.scene.add(cube)
	}
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(20, 10, 30)
	web.addAxesHelper()

	controlsData.draw()
	addGui()

	renderScene()
}

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "draw").name("绘制")
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
