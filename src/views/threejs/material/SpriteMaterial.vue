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
	web.camera.position.set(25, 25, 25)

	for (let x = -15; x < 15; x++) {
		for (let y = -10; y < 10; y++) {
			let material = new THREE.SpriteMaterial({
				color: Math.random() * 0xffffff
			})
			let sprite = new THREE.Sprite(material)
			sprite.position.set(x * 4, y * 4, 0)
			web.scene.add(sprite)
		}
	}

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
