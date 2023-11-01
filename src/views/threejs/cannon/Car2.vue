<template>
	<div></div>
</template>

<script setup lang="ts">
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as CANNON from "cannon-es"
// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)

// Sweep and prune broadphase
world.broadphase = new CANNON.SAPBroadphase(world)

// Disable friction by default
world.defaultContactMaterial.friction = 0

// 初始化3D场景
const scene = new THREE.Scene()
// 初始化相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 10, 20)
camera.lookAt(0, 0, 0)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

let phyMeshes: any = []
let meshes: any = []

// 创建地面
let groundShape = new CANNON.Box(new CANNON.Vec3(50, 0.5, 50))
let groundBody = new CANNON.Body({
	mass: 0,
	shape: groundShape
})
world.addBody(groundBody)

// 创建threejs地面
let groundMesh = new THREE.Mesh(new THREE.BoxGeometry(100, 1, 100), new THREE.MeshBasicMaterial({ color: 0x888888 }))
scene.add(groundMesh)

// 创建车身
let chassisShape = new CANNON.Box(new CANNON.Vec3(2, 0.5, 1))
let chassisBody = new CANNON.Body({
	mass: 150,
	shape: chassisShape
})
chassisBody.position.set(0, 5, 0)
world.addBody(chassisBody)
phyMeshes.push(chassisBody)

// 创建threejs车身
let chassisMesh = new THREE.Mesh(new THREE.BoxGeometry(4, 1, 2), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
scene.add(chassisMesh)
meshes.push(chassisMesh)

// 创建拥有悬架的车辆
const vehicle = new CANNON.RaycastVehicle({
	chassisBody: chassisBody
})

// 设置车轮配置
const wheelOptions = {
	// 车轮半径
	radius: 0.5,
	directionLocal: new CANNON.Vec3(0, -1, 0),
	// 设置悬架的刚度
	suspensionStiffness: 30,
	// 设置悬架的休息长度
	suspensionRestLength: 0.3,
	// 设置车轮的滑动摩擦力
	frictionSlip: 1.4,
	// 设置拉伸的阻尼
	dampingRelaxation: 2.3,
	// 设置压缩的阻尼
	dampingCompression: 4.4,
	// 最大的悬架力
	maxSuspensionForce: 100000,
	// 设置最大的悬架行程
	maxSuspensionTravel: 0.2,
	// 车轮的转向轴
	axleLocal: new CANNON.Vec3(0, 0, 1)
}

// 添加车轮
vehicle.addWheel({
	...wheelOptions,
	// 设置车轮的位置
	chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1)
})

vehicle.addWheel({
	...wheelOptions,
	// 设置车轮的位置
	chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, -1)
})

vehicle.addWheel({
	...wheelOptions,
	// 设置车轮的位置
	chassisConnectionPointLocal: new CANNON.Vec3(1, 0, 1)
})

vehicle.addWheel({
	...wheelOptions,
	// 设置车轮的位置
	chassisConnectionPointLocal: new CANNON.Vec3(1, 0, -1)
})

vehicle.addToWorld(world)

// 创建threejs车轮
const wheelBodies: any = []

// 车轮形状
const wheelShape = new CANNON.Cylinder(0.5, 0.5, 0.2, 20)
const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 20)
const wheelMaterial = new THREE.MeshBasicMaterial({
	color: 0xff0000,
	wireframe: true
})

for (let i = 0; i < vehicle.wheelInfos.length; i++) {
	const cylinderBody = new CANNON.Body({
		mass: 0,
		shape: wheelShape
	})
	cylinderBody.addShape(wheelShape)
	// world.addBody(cylinderBody);
	phyMeshes.push(cylinderBody)
	wheelBodies.push(cylinderBody)

	const cylinderMesh = new THREE.Mesh(wheelGeometry, wheelMaterial)
	cylinderMesh.rotation.x = -Math.PI / 2
	const wheelObj = new THREE.Object3D()
	wheelObj.add(cylinderMesh)
	scene.add(wheelObj)
	meshes.push(wheelObj)
}

world.addEventListener("postStep", () => {
	for (let i = 0; i < vehicle.wheelInfos.length; i++) {
		vehicle.updateWheelTransform(i)
		const t = vehicle.wheelInfos[i].worldTransform
		const wheelBody = wheelBodies[i]
		wheelBody.position.copy(t.position)
		wheelBody.quaternion.copy(t.quaternion)
	}
})

window.addEventListener("keydown", event => {
	if (event.key === "w") {
		vehicle.applyEngineForce(1000, 2)
		vehicle.applyEngineForce(1000, 3)
	}
	if (event.key === "s") {
		vehicle.applyEngineForce(-1000, 2)
		vehicle.applyEngineForce(-1000, 3)
	}
	if (event.key === "a") {
		vehicle.setSteeringValue(Math.PI / 4, 2)
		vehicle.setSteeringValue(Math.PI / 4, 3)
	}
	if (event.key === "d") {
		vehicle.setSteeringValue(-Math.PI / 4, 2)
		vehicle.setSteeringValue(-Math.PI / 4, 3)
	}
	// 按下r重置车辆
	if (event.key === "r") {
		chassisBody.velocity.set(0, 0, 0)
		chassisBody.angularVelocity.set(0, 0, 0)
		chassisBody.position.set(0, 10, 0)
	}
	// 空格刹车
	if (event.key === " ") {
		vehicle.setBrake(100, 0)
		vehicle.setBrake(100, 1)
	}
})

window.addEventListener("keyup", event => {
	if (event.key === "w" || event.key === "s") {
		vehicle.applyEngineForce(0, 2)
		vehicle.applyEngineForce(0, 3)
	}
	if (event.key === "a" || event.key === "d") {
		vehicle.setSteeringValue(0, 2)
		vehicle.setSteeringValue(0, 3)
	}
	if (event.key === " ") {
		vehicle.setBrake(0, 0)
		vehicle.setBrake(0, 1)
	}
})

// 渲染
let clock = new THREE.Clock()
function animate() {
	let delta = clock.getDelta()
	world.step(1 / 60, delta)

	for (let i = 0; i < phyMeshes.length; i++) {
		meshes[i].position.copy(phyMeshes[i].position)
		meshes[i].quaternion.copy(phyMeshes[i].quaternion)
	}

	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}

animate()
</script>

<style>
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
}

canvas {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
}
</style>
