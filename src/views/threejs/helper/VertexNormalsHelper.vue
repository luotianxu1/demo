<template>
	<div class="main">
		<div ref="webgl" class="webgl"></div>
	</div>
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
	web.camera.position.set(30, 30, 30)

	const geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2)
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const box = new THREE.Mesh(geometry, material)
	web.scene.add(box)

	web.addVertexNormalsHelper(box, "addVertexNormalsHelper", 2, 0x00ff00, 1)

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
.main {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	align-items: center;

	.btnList {
		padding: 10px 0;
	}

	.webgl {
		width: 100%;
		flex: 1;
	}
}
</style>
