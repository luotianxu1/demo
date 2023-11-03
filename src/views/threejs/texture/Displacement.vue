<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { addLargeGroundPlane } from "@utils/threejsShape"

const webgl = ref<HTMLDivElement>()
let web: WebGl

onMounted(() => {
	init()
})

let sphereMaterial: THREE.MeshStandardMaterial
let sphereMesh: THREE.Mesh

const textureLoader = new THREE.TextureLoader()

const form = reactive({
	displacementScale: 1,
	displacementBias: 1
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(0, 5, 40)
	web.addAmbientLight(0x343434)
	web.addSpotLight(-10, 30, 40, 0xffffff, 1, 0)

	const groundPlane = addLargeGroundPlane(web.scene, true)
	groundPlane.position.y = -10

	const sphere = new THREE.SphereGeometry(8, 180, 180)
	sphereMaterial = new THREE.MeshStandardMaterial({
		map: textureLoader.load("./threejs/texture/w_c.jpg"),
		displacementMap: textureLoader.load("./threejs/texture/w_d.png"),
		metalness: 0.02,
		roughness: 0.07,
		color: 0xffffff,
		displacementScale: form.displacementScale,
		displacementBias: form.displacementBias
	})
	sphereMesh = new THREE.Mesh(sphere, sphereMaterial)
	sphereMesh.castShadow = true
	web.scene.add(sphereMesh)

	addGui()

	renderScene()
}

watch(form, val => {
	sphereMaterial.displacementScale = val.displacementScale as number
	sphereMaterial.displacementBias = val.displacementBias as number
})

const addGui = () => {
	const gui = web.addGUI()
	gui.add(form, "displacementScale", -5, 5)
	gui.add(form, "displacementScale", -5, 5)
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
