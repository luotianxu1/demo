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
	web.scene.background = new THREE.Color(0xe0e0e0)
	web.camera.position.set(3, 1, 3)
	web.camera.lookAt(0, 0, 0)
	web.addHemisphereLight(0xffffff, 0x444444)

	web.addGltf("./threejs/helper/Duck.glb").then(glb => {
		let duckMesh = glb.scene.getObjectByName("LOD3spShape") as THREE.Mesh
		let duckGeometry = duckMesh.geometry
		duckGeometry.center()
		web.scene.add(glb.scene)

		const meshSize = web.meshSize(duckMesh)
		web.scene.add(meshSize)
	})

	renderScene()
}

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
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
