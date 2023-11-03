<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

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
	web.camera.position.set(0, 20, 40)

	web.addAmbientLight(0x444444)
	web.addSpotLight(-10, 30, 40, 0xffffff, 1, 0)

	web.setBgHdr("./textures/hdr/050.hdr")

	const cubeMaterial = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		metalness: 1,
		roughness: 0
	})
	const cube = new THREE.BoxGeometry(16, 12, 12)
	const cube1 = new THREE.Mesh(cube, cubeMaterial)
	cube1.position.x = -15
	cube1.rotation.y = (-1 / 3) * Math.PI
	web.scene.add(cube1)

	const sphere = new THREE.SphereGeometry(10, 50, 50)
	const sphereMaterial = cubeMaterial.clone()
	const sphere1 = new THREE.Mesh(sphere, sphereMaterial)
	sphere1.position.x = 15
	web.scene.add(sphere1)

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
