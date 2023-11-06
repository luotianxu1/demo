<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { Water } from "three/examples/jsm/objects/Water2"
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
	web.camera.position.set(0, 5, 5)
	web.addDirectionalLight(10, 10, 10, 0xffffff)
	web.setBgHdr("./textures/hdr/050.hdr")

	web.addGlb("./threejs/shader/yugang.glb").then(glb => {
		const yugang = glb.scene.children[0] as any
		yugang.material.side = THREE.DoubleSide

		const waterGeometry = (glb.scene.children[1] as any).geometry
		const water = new Water(waterGeometry, {
			color: "#fff",
			scale: 1,
			flowDirection: new THREE.Vector2(1, 1),
			textureHeight: 1024,
			textureWidth: 1024
		})
		web.scene.add(glb.scene)
		web.scene.add(water)
	})

	renderScene()
}

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
}
</script>

<style lang="scss" scoped>
.webgl {
	width: 100%;
	height: 100%;
}

.label {
	display: none;
	font-size: 0.2rem;
	color: #fff;
}

.visible {
	display: block;
}
</style>
