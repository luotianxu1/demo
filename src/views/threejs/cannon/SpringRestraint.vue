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
camera.position.y = 10
camera.position.z = 10
camera.position.x = 10
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

let phyMeshes: any = []
let meshes: any = []

// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)

// 创建1个固定的静态球体
const sphereShape = new CANNON.Sphere(0.2)
const sphereBody = new CANNON.Body({
	mass: 0,
	shape: sphereShape,
	position: new CANNON.Vec3(0, 10, 0),
	type: CANNON.Body.STATIC
})
world.addBody(sphereBody)
phyMeshes.push(sphereBody)

const sphereGeometry = new THREE.SphereGeometry(0.2, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh.position.copy(sphereBody.position as any as THREE.Vector3)
meshes.push(sphereMesh)
scene.add(sphereMesh)

// 创建1个立方体
const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 0.3))
const boxBody = new CANNON.Body({
	mass: 1,
	shape: boxShape,
	position: new CANNON.Vec3(0, 6, 0)
})
world.addBody(boxBody)
phyMeshes.push(boxBody)

const boxGeometry = new THREE.BoxGeometry(2, 2, 0.6)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
boxMesh.position.copy(boxBody.position as any as THREE.Vector3)
meshes.push(boxMesh)
scene.add(boxMesh)

// 创建1个弹簧拉住立方体
const spring = new CANNON.Spring(sphereBody, boxBody, {
	// 弹簧的长度
	restLength: 5,
	// 弹簧的刚度
	stiffness: 100,
	// 弹簧的阻尼
	damping: 1,
	// 弹簧的锚点
	localAnchorA: new CANNON.Vec3(0, 0, 0),
	localAnchorB: new CANNON.Vec3(-1, 1, 0)
})

// 通过计算每一step之前获取弹簧的作用力，并且应用弹簧的作用力
world.addEventListener("preStep", () => {
	// 应用弹簧的作用力
	spring.applyForce()
})

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
	controls.update()
	for (let i = 0; i < phyMeshes.length; i++) {
		meshes[i].position.copy(phyMeshes[i].position)
		meshes[i].quaternion.copy(phyMeshes[i].quaternion)
	}
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
