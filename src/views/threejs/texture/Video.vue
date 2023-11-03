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
	web.camera.position.set(0, 0, 20)

	web.addVideoTexture("./video/ui_chat.mp4").then(texture => {
		const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
		const planeMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			side: THREE.DoubleSide,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			map: texture,
			alphaMap: texture
		})
		const plane = new THREE.Mesh(planeGeometry, planeMaterial)
		web.scene.add(plane)
	})

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
