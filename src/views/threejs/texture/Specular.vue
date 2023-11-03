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
	web.camera.position.set(10, 10, 20)

	web.addAmbientLight(0x343434)
	web.addSpotLight(-10, 30, 40, 0xffffff)

	const textureLoader = new THREE.TextureLoader()
	const earthMaterial = new THREE.MeshPhongMaterial({
		map: textureLoader.load("./threejs/texture/Earth.png"),
		normalMap: textureLoader.load("./threejs/texture/EarthNormal.png"),
		specularMap: textureLoader.load("./threejs/texture/EarthSpec.png"),
		normalScale: new THREE.Vector2(6, 6)
	})
	const sphere = new THREE.SphereGeometry(9, 50, 50)
	const sphere1 = new THREE.Mesh(sphere, earthMaterial)
	sphere1.rotation.y = (1 / 6) * Math.PI
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
