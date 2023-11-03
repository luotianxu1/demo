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
	web.addSpotLight(-10, 30, 40, 0xffffff, 1)

	const groundPlane = addLargeGroundPlane(web.scene, true)
	groundPlane.position.y = -10

	const textureLoader = new THREE.TextureLoader()
	const cubeMap = textureLoader.load("./textures/map/stone.jpg")
	const cubeMaterial = new THREE.MeshStandardMaterial({
		map: cubeMap,
		metalness: 0.2,
		roughness: 0.07
	})

	// 凹凸贴图
	const cubeMaterialWithBumpMap = cubeMaterial.clone()
	cubeMaterialWithBumpMap.bumpMap = textureLoader.load("./threejs/texture/stone-bump.jpg")

	const cube = new THREE.BoxGeometry(16, 16, 16)

	const cube1 = new THREE.Mesh(cube, cubeMaterial)
	cube1.castShadow = true
	cube1.position.x = -17
	cube1.rotation.y = (1 / 3) * Math.PI
	web.scene.add(cube1)

	const cube2 = new THREE.Mesh(cube, cubeMaterialWithBumpMap)
	cube2.castShadow = true
	cube2.position.x = 17
	cube2.rotation.y = (1 / 3) * Math.PI
	web.scene.add(cube2)

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
