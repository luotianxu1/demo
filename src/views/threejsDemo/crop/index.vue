<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"

let webgl = ref()
let web: WebGl
onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.activeCamera.position.set(2, 24, 50)

	web.addAxesHelper(5)
	web.setBgHdr("./textures/hdr/Alex_Hart-Nature_Lab_Bones_2k.hdr")

	const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
	const material = new THREE.MeshPhysicalMaterial({
		side: THREE.FrontSide
	})
	const torusKnot = new THREE.Mesh(geometry, material)
	web.scene.add(torusKnot)

	const material1 = new THREE.MeshBasicMaterial({
		side: THREE.BackSide,
		color: 0xffcccc,
		stencilWrite: true,
		stencilRef: 1,
		stencilWriteMask: 0xff,
		stencilZPass: THREE.ReplaceStencilOp
	})
	const torusKnot1 = new THREE.Mesh(geometry, material1)
	web.scene.add(torusKnot1)

	// 创建裁剪平面
	const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0)
	material.clippingPlanes = [plane]
	material1.clippingPlanes = [plane]
	web.webGlRender.localClippingEnabled = true

	// 创建平面
	let planeGeometry = new THREE.PlaneGeometry(60, 60, 80, 80)
	let planeMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xccccff,
		metalness: 0.95,
		roughness: 0.1,
		stencilWrite: true,
		stencilRef: 1,
		stencilFunc: THREE.EqualStencilFunc
	})
	let planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
	planeMesh.rotation.x = -Math.PI / 2
	planeMesh.position.y = 1
	web.scene.add(planeMesh)

	web.addGUI()
	const folder = web.gui.addFolder("裁剪平面")
	// 添加一个滑块
	folder
		.add(plane, "constant", -10, 10)
		.name("位置")
		.onChange(val => {
			planeMesh.position.y = val
		})

	render()
})

onUnmounted(() => {
	web.remove()
})

const render = () => {
	web.update()
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
}
</style>
