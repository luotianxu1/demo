<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let cube: THREE.Mesh
let curve

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.addAxesHelper()

	web.camera.position.set(20, 20, 20)

	curve = new THREE.CatmullRomCurve3(
		[
			new THREE.Vector3(-10, 0, 10),
			new THREE.Vector3(-5, 5, 5),
			new THREE.Vector3(0, 0, 0),
			new THREE.Vector3(5, -5, 5),
			new THREE.Vector3(10, 0, 10)
		],
		true
	)
	const points = curve.getPoints(50)
	const geometry = new THREE.BufferGeometry().setFromPoints(points)
	const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
	const curveObject = new THREE.Line(geometry, material)
	web.scene.add(curveObject)

	const boxGeometry = new THREE.BoxGeometry(2, 2, 2)
	cube = new THREE.Mesh(boxGeometry, material)
	web.scene.add(cube)

	renderScene()
}

const clock = new THREE.Clock()
const renderScene = () => {
	requestAnimationFrame(renderScene)
	const elapsed = clock.getElapsedTime()
	const time = (elapsed * 0.1) % 1
	const point = curve.getPoint(time)
	cube.position.copy(point)
	web.update()
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
