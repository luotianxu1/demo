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
	web.camera.position.set(0, 0, 10)

	// 创建一个平面
	const planeGeometry = new THREE.PlaneGeometry(5, 5, 1, 1)
	const planeMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide,
		transparent: true,
		depthWrite: false
	})
	const plane = new THREE.Mesh(planeGeometry, planeMaterial)
	web.scene.add(plane)

	// 创建canvas
	const canvas = document.createElement("canvas")
	canvas.width = 1080
	canvas.height = 1080
	canvas.style.position = "absolute"
	canvas.style.top = "0px"
	canvas.style.left = "0px"
	canvas.style.zIndex = "1"
	canvas.style.transform = "scale(0.1)"
	const context = canvas.getContext("2d")

	if (!context) {
		return
	}
	let image = new Image()
	image.src = "./threejs/texture/chat.png"
	image.onload = function () {
		context.drawImage(image, 0, 0, 1080, 1080)
		context.textAlign = "center"
		context.textBaseline = "middle"
		context.font = "bold 100px Arial"
		context.fillStyle = "rgba(0,255,255,1)"
		context.fillText("Hello World", canvas.width / 2, canvas.height / 2)
		let texture = new THREE.CanvasTexture(canvas)
		plane.material.map = texture
		plane.material.alphaMap = texture
		plane.material.needsUpdate = true
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
