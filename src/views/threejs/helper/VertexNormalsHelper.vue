<template>
	<div class="main">
		<div ref="webgl" class="webgl"></div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { VertexNormalsHelper } from "three/addons/helpers/VertexNormalsHelper"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(30, 30, 30)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	const geometry = new THREE.BoxGeometry(10, 10, 10, 2, 2, 2)
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const box = new THREE.Mesh(geometry, material)

	const helper = new VertexNormalsHelper(box, 2, 0x00ff00, 1)

	scene.add(box)
	scene.add(helper)

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	renderer.render(scene, camera)
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
	}

	.webgl {
		flex: 1;
		width: 100%;
	}
}
</style>
