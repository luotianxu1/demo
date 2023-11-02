<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

let webgl = ref<HTMLDivElement>()
let web: WebGl

let active = 1
const api = {
	changeCamera: function () {
		if (active === 1) {
			active = 2
		} else {
			active = 1
		}
		web.switchCamera(active)
	}
}

onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.camera.position.set(15, 20, 25)

	const geometry = new THREE.BoxGeometry(2, 2, 2)
	const material = new THREE.MeshBasicMaterial({ color: "#ffffff" })
	const cube = new THREE.Mesh(geometry, material)
	web.scene.add(cube)

	web.createPerspectiveCamera(15, 20, 25)

	web.addGUI()
	web.gui?.add(api, "changeCamera").name("更换相机")

	render()
})

onUnmounted(() => {
	web.destroy()
})

const render = () => {
	web.update()
	requestAnimationFrame(render)
}
</script>

<style lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
