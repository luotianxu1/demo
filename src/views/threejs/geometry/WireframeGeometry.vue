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
	web.camera.position.set(20, 10, 30)
	web.addAxesHelper()

	addWireframeGeometry()

	renderScene()
}

const addWireframeGeometry = () => {
	const geometry = new THREE.SphereGeometry(10, 10, 10)
	const wireframe = new THREE.WireframeGeometry(geometry)
	const line = new THREE.LineSegments(wireframe)
	web.scene.add(line)
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
