<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
const AMOUNT = 6
let camera
let mesh

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.scene.background = new THREE.Color(0x444444)

	web.addAmbientLight(0x222244)
	web.addDirectionalLight(0.5, 0.5, 1)

	const WIDTH = (webgl.value.offsetWidth / AMOUNT) * window.devicePixelRatio
	const HEIGHT = (webgl.value.offsetHeight / AMOUNT) * window.devicePixelRatio

	const geometryBackground = new THREE.PlaneGeometry(100, 100)
	const materialBackground = new THREE.MeshPhongMaterial({ color: 0x000066 })
	const background = new THREE.Mesh(geometryBackground, materialBackground)
	background.receiveShadow = true
	background.position.set(0, 0, -1)
	web.scene.add(background)

	const geometryCylinder = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
	const materialCylinder = new THREE.MeshPhongMaterial({ color: 0xff0000 })
	mesh = new THREE.Mesh(geometryCylinder, materialCylinder)
	mesh.castShadow = true
	mesh.receiveShadow = true
	web.scene.add(mesh)

	const cameras = []
	for (let y = 0; y < AMOUNT; y++) {
		for (let x = 0; x < AMOUNT; x++) {
			let positionX = x / AMOUNT - 0.5
			let positionY = 0.5 - y / AMOUNT
			let positionZ = 1.5
			let subcamera = web.createPerspectiveCamera(positionX, positionY, positionZ)
			;(subcamera as any).viewport = new THREE.Vector4(
				Math.floor(x * WIDTH),
				Math.floor(y * HEIGHT),
				Math.ceil(WIDTH),
				Math.ceil(HEIGHT)
			)

			subcamera.position.multiplyScalar(2)
			subcamera.lookAt(0, 0, 0)
			subcamera.updateMatrixWorld()
			cameras.push(subcamera)
		}
	}

	camera = new THREE.ArrayCamera(cameras)
	camera.position.z = 3

	renderScene()
}

const renderScene = () => {
	mesh.rotation.x += 0.005
	mesh.rotation.z += 0.01
	web.webGlRender.render(web.scene, camera)
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
