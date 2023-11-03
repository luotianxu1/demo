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
	web.camera.position.set(0, 0, 3)
	web.addAxesHelper()

	web.addAmbientLight(0xffffff, 0.5)
	web.addDirectionalLight(10, 10, 10, 0xffffff, 0.5)

	// 导入纹理
	const textLoader = new THREE.TextureLoader()
	const mapTexture = textLoader.load("./threejs/texture/minecraft.png")
	// 纹理显示设置
	mapTexture.minFilter = THREE.NearestFilter
	mapTexture.magFilter = THREE.NearestFilter
	// mapTexture.minFilter = THREE.LinearFilter
	// mapTexture.magFilter = THREE.LinearFilter

	const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
	const basicMaterial = new THREE.MeshBasicMaterial({
		color: "#ffff00",
		map: mapTexture
	})
	const cube = new THREE.Mesh(cubeGeometry, basicMaterial)
	web.scene.add(cube)

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
