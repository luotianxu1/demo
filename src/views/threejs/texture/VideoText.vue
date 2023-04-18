<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls

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

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 0, 10)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	scene.add(plane)

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	drawVideoText()
	renderer.render(scene, camera)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
