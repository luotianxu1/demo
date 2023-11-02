<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper"

const webgl = ref<HTMLDivElement>()
let web: WebGl

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(20, 20, -25)
	web.webGlRender.outputColorSpace = THREE.SRGBColorSpace

	const rectLight1 = web.addRectAreaLight(-5, 5, 5, 0xff0000, 5, 10, 10)
	const rectLight2 = web.addRectAreaLight(0, 5, 5, 0x00ff00, 5, 10, 10)
	const rectLight3 = web.addRectAreaLight(5, 5, 5, 0x0000ff, 5, 10, 10)
	web.scene.add(new RectAreaLightHelper(rectLight1))
	web.scene.add(new RectAreaLightHelper(rectLight2))
	web.scene.add(new RectAreaLightHelper(rectLight3))

	const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000)
	const matStdFloor = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.1, metalness: 0 })
	const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor)
	web.scene.add(mshStdFloor)

	const geoKnot = new THREE.TorusKnotGeometry(1.5, 0.5, 200, 16)
	const matKnot = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0, metalness: 0 })
	const meshKnot = new THREE.Mesh(geoKnot, matKnot)
	meshKnot.name = "meshKnot"
	meshKnot.position.set(0, 5, 0)
	web.scene.add(meshKnot)

	renderScene()
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
