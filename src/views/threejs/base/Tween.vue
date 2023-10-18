<template>
	<div class="main">
		<div ref="webgl" class="webgl"></div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import * as TWEEN from "three/examples/jsm/libs/tween.module.js"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.z = 10

	// 创建渲染器
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	const sphere1 = new THREE.Mesh(
		new THREE.SphereGeometry(1, 32, 32),
		new THREE.MeshBasicMaterial({
			color: 0x00ff00
		})
	)
	sphere1.position.x = -4
	scene.add(sphere1)

	let tween = new TWEEN.Tween(sphere1.position)
	tween.to({ x: 4 }, 1000)
	tween.onUpdate(() => {
		// console.log(sphere1.position.x)
	})
	// 设置循环无数次
	// tween.repeat(Infinity)
	// 循环往复
	// tween.yoyo(true)
	// 延迟
	tween.delay(1000)
	// 缓动动画
	tween.easing(TWEEN.Easing.Quartic.InOut)
	let tween2 = new TWEEN.Tween(sphere1.position)
	tween2.to({ x: -4 }, 1000)
	tween.chain(tween2)
	tween2.chain(tween)
	// 开启动画
	tween.start()

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	renderer.render(scene, camera)
	TWEEN.update()
}
</script>

<style scoped lang="scss">
.main {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;

	.webgl {
		flex: 1;
		width: 100%;
	}
}
</style>
