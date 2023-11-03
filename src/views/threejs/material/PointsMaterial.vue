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
	web.camera.position.set(10, 0, 10)

	const textureLoader = new THREE.TextureLoader()
	const texture = textureLoader.load("./threejs/material/points.png")

	const sphereMetrial = new THREE.SphereGeometry(3, 30, 30)
	const pointsMaterial = new THREE.PointsMaterial()
	pointsMaterial.size = 0.2
	pointsMaterial.color.set(0xfff000)
	// 相机深度而衰减
	pointsMaterial.sizeAttenuation = true
	pointsMaterial.map = texture
	pointsMaterial.alphaMap = texture
	pointsMaterial.transparent = true
	pointsMaterial.depthWrite = false
	pointsMaterial.blending = THREE.AdditiveBlending

	const points = new THREE.Points(sphereMetrial, pointsMaterial)
	web.scene.add(points)

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
