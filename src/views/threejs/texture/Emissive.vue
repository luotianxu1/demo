<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { addLargeGroundPlane } from "@utils/threejsShape"
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
	web.camera.position.set(0, 5, 40)

	web.addSpotLight(0, 20, 40, 0xffffff, 0.1)

	const groundPlane = addLargeGroundPlane(web.scene, true)
	groundPlane.position.y = -10

	const textureLoader = new THREE.TextureLoader()
	const cubeMaterial = new THREE.MeshStandardMaterial({
		emissive: 0xffffff,
		emissiveMap: textureLoader.load("./threejs/texture/lava.png"),
		normalMap: textureLoader.load("./threejs/texture/lava-normals.png"),
		metalnessMap: textureLoader.load("./threejs/texture/lava-smoothness.png"),
		metalness: 1,
		roughness: 0.4,
		normalScale: new THREE.Vector2(4, 4)
	})
	const cube = new THREE.BoxGeometry(16, 16, 16)
	const cube1 = new THREE.Mesh(cube, cubeMaterial)
	cube1.rotation.y = (1 / 3) * Math.PI
	cube1.position.x = -12
	web.scene.add(cube1)

	const sphere = new THREE.SphereGeometry(9, 50, 50)
	const sphere1 = new THREE.Mesh(sphere, cubeMaterial)
	sphere1.rotation.y = (1 / 6) * Math.PI
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
