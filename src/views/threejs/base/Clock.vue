<template>
	<div class="main">
		<div class="btnList">
			<div class="time">默认开启{{ autoStart }}</div>
			<div class="time">存储时钟最后一次调用 start 方法的时间{{ startTime }}</div>
			<div class="time">存储时钟最后一次调用 start, .getElapsedTime() 或 .getDelta() 方法的时间{{ oldTime }}</div>
			<div class="time">保存时钟运行的总时长{{ elapsedTime }}</div>
			<div class="time">时钟启动后时间{{ allTime }}</div>
			<div class="time">间隔时间{{ time }}</div>
			<el-button type="primary" @click="stop">停止时钟</el-button>
			<el-button type="primary" @click="start">开启时钟</el-button>
		</div>
		<div ref="webgl" class="webgl"></div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let clock: THREE.Clock

const allTime = ref(0)
const time = ref(0)
const autoStart = ref(false)
const startTime = ref(0)
const oldTime = ref(0)
const elapsedTime = ref(0)

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.z = 5

	// 创建渲染器
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建几何体
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	// 创建材质
	const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	// 根据材质和几何体创建物体
	const cube = new THREE.Mesh(geometry, material)
	// 添加物体
	scene.add(cube)

	clock = new THREE.Clock()
	autoStart.value = clock.autoStart
	startTime.value = clock.startTime
	oldTime.value = clock.oldTime

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	time.value = clock.getDelta()
	allTime.value = clock.getElapsedTime()
	startTime.value = clock.startTime
	oldTime.value = clock.oldTime
	elapsedTime.value = clock.elapsedTime
	requestAnimationFrame(renderScene)
	renderer.render(scene, camera)
}

const stop = () => {
	clock.stop()
}

const start = () => {
	clock.start()
}
</script>

<style scoped lang="scss">
.main {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	.btnList {
		padding: 10px 0;
		display: flex;

		.time {
			width: 250px;
		}
	}

	.webgl {
		flex: 1;
		width: 100%;
	}
}
</style>
