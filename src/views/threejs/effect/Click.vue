<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js"

let webgl = ref()
let webGl: WebGl
onMounted(() => {
	if (!webgl.value) {
		return
	}
	webGl = new WebGl(webgl.value, true, true, true)
	webGl.activeCamera.position.set(0, 0, 20)

	// 创建一个正方体
	const geometry2 = new THREE.BoxGeometry(1, 1, 1)
	const material2 = new THREE.MeshStandardMaterial({
		emissive: 0x33ff33
	})
	const cube = new THREE.Mesh(geometry2, material2)
	cube.position.set(5, 0, 0)
	webGl.scene.add(cube)

	// 创建一个纽结体
	const geometry3 = new THREE.TorusKnotGeometry(1, 0.3, 100, 16)
	const material3 = new THREE.MeshStandardMaterial({
		emissive: 0x33ff33
	})
	const torusKnot = new THREE.Mesh(geometry3, material3)
	torusKnot.position.set(0, 0, 0)
	webGl.scene.add(torusKnot)

	// 创建一个金属球添加到场景中
	const geometry = new THREE.SphereGeometry(1, 32, 32)
	const material1 = new THREE.MeshStandardMaterial({
		emissive: 0x33ff33
	})
	const sphere = new THREE.Mesh(geometry, material1)
	sphere.position.set(-5, 0, 0)
	webGl.scene.add(sphere)

	const outLinePass = new OutlinePass(
		new THREE.Vector2(webGl.domElement.offsetWidth, webGl.domElement.offsetHeight),
		webGl.scene,
		webGl.activeCamera
	)
	outLinePass.edgeStrength = 3
	outLinePass.edgeGlow = 2
	outLinePass.edgeThickness = 3
	outLinePass.pulsePeriod = 2
	if (!webGl.composer) return
	webGl.composer.addPass(outLinePass)

	const mouse = new THREE.Vector2()
	const raycaster = new THREE.Raycaster()
	// 事件监听
	window.addEventListener("click", event => {
		if (!mouse) return
		mouse.x = (event.clientX / webGl.domElement.offsetWidth) * 2 - 1
		mouse.y = -((event.clientY / webGl.domElement.offsetHeight) * 2 - 1)
		raycaster?.setFromCamera(mouse, webGl.activeCamera)
		const intersects = raycaster?.intersectObject(webGl.scene)

		if (intersects && intersects.length > 0) {
			outLinePass.selectedObjects = [intersects[0].object]
		}
	})

	render()
})

onUnmounted(() => {
	webGl.remove()
})

const render = () => {
	webGl.update()
	requestAnimationFrame(render)
}
</script>

<style lang="scss">
.webgl {
	width: 100vw;
	height: 100vh;
	display: flex;
	left: 0;
	top: 0;
	z-index: 100;
	position: relative;
}
</style>
