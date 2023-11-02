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
	web.camera.position.set(4, 2, 8)
	web.addAxesHelper()

	const geometry = new THREE.BoxGeometry(4, 4, 4)
	const edges = new THREE.EdgesGeometry(geometry)
	const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }))
	web.scene.add(line)

	renderScene()
}

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
