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

// 添加视频纹理
const video = document.createElement("video")
video.src = "./video/ui_chat.mp4"
video.muted = true
video.loop = true
video.play()

const texture = new THREE.CanvasTexture(canvas)

// 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(10, 10, 1, 1)
const planeMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
	side: THREE.DoubleSide,
	transparent: true,
	depthWrite: false,
	blending: THREE.AdditiveBlending,
	map: texture,
	alphaMap: texture
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)

function drawVideoText() {
	if (!context) return
	context.clearRect(0, 0, canvas.width, canvas.height)
	context.drawImage(video, 0, 0, canvas.width, canvas.height)
	context.textAlign = "center"
	context.textBaseline = "middle"
	context.font = "bold 100px Arial"
	context.fillStyle = "rgba(255,255,255,1)"
	context.fillText("Hello World", canvas.width / 2, canvas.height / 2)
	texture.needsUpdate = true
	planeMaterial.needsUpdate = true
}

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(0, 0, 20)

	web.scene.add(plane)

	renderScene()
}

const renderScene = () => {
	web.update()
	drawVideoText()
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
