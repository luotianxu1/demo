<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

let webgl = ref<HTMLDivElement>()
let web: WebGl

let params = {
	scissorWidth: 0
}

// 创建新场景
const newScene = new THREE.Scene()

onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.activeCamera.position.set(2, 4, 50)

	web.setBgHdr("./textures/hdr/Alex_Hart-Nature_Lab_Bones_2k.hdr").then(texture => {
		newScene.background = texture
		newScene.environment = texture
	})

	const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)

	const material = new THREE.MeshPhysicalMaterial({
		side: THREE.DoubleSide
	})
	const torusKnot = new THREE.Mesh(geometry, material)
	web.scene.add(torusKnot)

	const material1 = new THREE.MeshBasicMaterial({
		wireframe: true
	})
	const torusKnot1 = new THREE.Mesh(geometry, material1)
	newScene.add(torusKnot1)

	params.scissorWidth = webgl.value.offsetWidth / 2
	web.addGUI()
	web.gui.add(params, "scissorWidth", 0, webgl.value.offsetWidth)

	render()
})

onUnmounted(() => {
	web.remove()
})

const clock = new THREE.Clock()
const render = () => {
	if (!webgl.value) {
		return
	}
	const t = clock.getDelta()
	web.controls.update(t)
	requestAnimationFrame(render)
	web.webGlRender.setScissorTest(true)
	web.webGlRender.setScissor(0, 0, params.scissorWidth, webgl.value.offsetHeight)
	web.webGlRender.render(web.scene, web.activeCamera)
	web.webGlRender.setScissor(params.scissorWidth, 0, webgl.value.offsetWidth - params.scissorWidth, webgl.value.offsetHeight)
	web.webGlRender.render(newScene, web.activeCamera)
	web.webGlRender.setScissorTest(false)
}
</script>

<style lang="scss">
.webgl {
	top: 0;
	left: 0;
	z-index: 100;
	display: flex;
	width: 100vw;
	height: 100vh;
}
</style>
