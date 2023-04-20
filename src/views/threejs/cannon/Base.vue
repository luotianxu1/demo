<template>
	<div id="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as CANNON from "cannon-es"

onMounted(() => {
	init()
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.y = 0.5
camera.position.z = 4
camera.position.x = 1
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)

// 创建一个球体
const sphereShape = new CANNON.Sphere(0.5)
// 创建一个刚体
const sphereBody = new CANNON.Body({
	mass: 1,
	shape: sphereShape,
	position: new CANNON.Vec3(0, 5, 0)
})
// 将刚体添加到物理世界
world.addBody(sphereBody)
// 创建一个物理世界平面
// const planeShape = new CANNON.Plane()
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))
// 创建一个刚体
const planeBody = new CANNON.Body({
	// mass: 0,
	shape: planeShape,
	position: new CANNON.Vec3(0, 0, 0),
	type: CANNON.Body.STATIC // 设置为静态的
})
// planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1)
world.addBody(planeBody)

// 创建一个球体
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)
// 创建一个平面
// const planeGeometry = new THREE.PlaneGeometry(10, 10)
const planeGeometry = new THREE.BoxGeometry(10, 0.2, 10)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xfff000, side: THREE.DoubleSide })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
// planeMesh.rotation.x = -Math.PI / 2
planeMesh.rotation.x = 0.1
scene.add(planeMesh)

const init = () => {
	const body = document.getElementById("webgl")
	if (!body) {
		return
	}
	body.appendChild(renderer.domElement)
	renderScene()
}
const clock = new THREE.Clock()
const renderScene = () => {
	const delta = clock.getDelta()
	world.step(1 / 60, delta)
	sphereMesh.position.copy(sphereBody.position as any as THREE.Vector3)
	sphereMesh.quaternion.copy(sphereBody.quaternion as any as THREE.Quaternion)
	controls.update()
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
