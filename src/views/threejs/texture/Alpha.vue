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

	const textureLoader = new THREE.TextureLoader()
	const sphere = new THREE.SphereGeometry(8, 180, 180)
	const alpha = textureLoader.load("./threejs/texture/partial-transparency.png")
	alpha.wrapS = THREE.RepeatWrapping
	alpha.wrapT = THREE.RepeatWrapping
	alpha.repeat.set(8, 8)
	const sphereMaterial = new THREE.MeshStandardMaterial({
		alphaMap: alpha,
		metalness: 0.02,
		roughness: 0.07,
		color: 0xffffff,
		alphaTest: 0.5
	})

	const cube = new THREE.Mesh(sphere, sphereMaterial)
	cube.castShadow = true
	web.scene.add(cube)

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
