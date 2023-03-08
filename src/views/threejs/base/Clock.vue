<template>
	<div id="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"

onMounted(() => {
	init()
})

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// 根据材质和几何体创建物体
const cube = new THREE.Mesh(geometry, material)
// 添加物体
scene.add(cube)

// 设置时钟
const clock = new THREE.Clock()

const init = () => {
	const body = document.getElementById("webgl")
	if (!body) {
		return
	}
	body.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	// 获取时钟运行总时长
	// let time = clock.getElapsedTime()

	// 时间间隔
	let deltaTime = clock.getDelta()
	// console.log(deltaTime, "间隔时间")

	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
