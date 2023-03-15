<template>
	<div id="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"

onMounted(() => {
	init()
})
let raycaster: THREE.Raycaster
const pointer = new THREE.Vector2()
const radius = 100
let theta = 0
let intersected: THREE.Mesh | null
let color: number

// 创建场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xf0f0f0)

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 5

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

const init = () => {
	const body = document.getElementById("webgl")
	if (!body) {
		return
	}

	const light = new THREE.DirectionalLight(0xffffff, 1)
	light.position.set(1, 1, 1).normalize()
	scene.add(light)

	const geometry = new THREE.BoxGeometry(20, 20, 20)
	for (let i = 0; i < 2000; i++) {
		const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))

		object.position.x = Math.random() * 800 - 400
		object.position.y = Math.random() * 800 - 400
		object.position.z = Math.random() * 800 - 400

		object.rotation.x = Math.random() * 2 * Math.PI
		object.rotation.y = Math.random() * 2 * Math.PI
		object.rotation.z = Math.random() * 2 * Math.PI

		object.scale.x = Math.random() + 0.5
		object.scale.y = Math.random() + 0.5
		object.scale.z = Math.random() + 0.5

		scene.add(object)
	}

	raycaster = new THREE.Raycaster()

	document.addEventListener("mousemove", onPointerMove)

	body.appendChild(renderer.domElement)
	renderScene()
}

const onPointerMove = (event: { clientX: number; clientY: number }) => {
	pointer.x = (event.clientX / window.innerWidth) * 2 - 1
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
}

const renderScene = () => {
	theta += 0.1
	camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta))
	camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta))
	camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta))
	camera.lookAt(scene.position)
	camera.updateMatrixWorld()

	raycaster.setFromCamera(pointer, camera)
	const intersects = raycaster.intersectObjects(scene.children, false)
	if (intersects.length > 0) {
		let obj = intersects[0].object as THREE.Mesh
		if (intersected !== obj) {
			if (intersected) (intersected.material as THREE.MeshLambertMaterial).emissive.setHex(color)

			intersected = obj
			color = (intersected.material as THREE.MeshLambertMaterial).emissive.getHex()
			;(intersected.material as THREE.MeshLambertMaterial).emissive.setHex(0xff0000)
		}
	} else {
		if (intersected) (intersected.material as THREE.MeshLambertMaterial).emissive.setHex(color)
		intersected = null
	}

	requestAnimationFrame(renderScene)
	renderer.render(scene, camera)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
