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
camera.position.y = 3
camera.position.z = 8
camera.position.x = 3
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

// 创建地面
const groundShape = new CANNON.Plane()
const groundBody = new CANNON.Body({
	mass: 0,
	shape: groundShape,
	material: new CANNON.Material()
})
groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(groundBody)
phyMeshes.push(groundBody)

const groundMesh = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100),
	new THREE.MeshBasicMaterial({
		color: 0x666666
	})
)
groundMesh.rotation.x = -Math.PI / 2
scene.add(groundMesh)
meshes.push(groundMesh)

// 创建车身
const chassisShape = new CANNON.Box(new CANNON.Vec3(5, 0.5, 2))
const chassisBody = new CANNON.Body({
	mass: 100,
	shape: chassisShape
})
chassisBody.position.set(0, 5, 0)
// world.addBody(chassisBody);
phyMeshes.push(chassisBody)

// three.js的车身
const chassisMesh = new THREE.Mesh(
	new THREE.BoxGeometry(10, 1, 4),
	new THREE.MeshBasicMaterial({
		color: 0x660066
	})
)
scene.add(chassisMesh)
meshes.push(chassisMesh)

// 创建刚性车子
const vehicle = new CANNON.RigidVehicle({
	chassisBody
})

// 创建轮子1
const wheelShape = new CANNON.Sphere(1.5)
const wheelBody1 = new CANNON.Body({
	mass: 1,
	shape: wheelShape
})
vehicle.addWheel({
	body: wheelBody1,
	// 轮子位置
	position: new CANNON.Vec3(-4, -0.5, 3.5),
	// 旋转轴
	axis: new CANNON.Vec3(0, 0, -1),
	direction: new CANNON.Vec3(0, -1, 0)
})
// world.addBody(wheelBody1);
phyMeshes.push(wheelBody1)

// three.js的车轮1
const wheelMaterial = new THREE.MeshBasicMaterial({
	color: 0x660000,
	wireframe: true
})
const wheelMesh1 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), wheelMaterial)
scene.add(wheelMesh1)
meshes.push(wheelMesh1)

// 创建轮子2
const wheelBody2 = new CANNON.Body({
	mass: 1,
	shape: wheelShape
})
vehicle.addWheel({
	body: wheelBody2,
	// 轮子位置
	position: new CANNON.Vec3(4, -0.5, 3.5),
	// 旋转轴
	axis: new CANNON.Vec3(0, 0, -1),
	direction: new CANNON.Vec3(0, -1, 0)
})
// world.addBody(wheelBody2);
phyMeshes.push(wheelBody2)

// three.js的车轮2
const wheelMesh2 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), wheelMaterial)
scene.add(wheelMesh2)
meshes.push(wheelMesh2)

// 创建车轮3
const wheelBody3 = new CANNON.Body({
	mass: 1,
	shape: wheelShape
})
vehicle.addWheel({
	body: wheelBody3,
	// 轮子位置
	position: new CANNON.Vec3(-4, -0.5, -3.5),
	// 旋转轴
	axis: new CANNON.Vec3(0, 0, -1),
	direction: new CANNON.Vec3(0, -1, 0)
})
// world.addBody(wheelBody3);
phyMeshes.push(wheelBody3)

// three.js的车轮
const wheelMesh3 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), wheelMaterial)
scene.add(wheelMesh3)
meshes.push(wheelMesh3)

// 创建车轮4
const wheelBody4 = new CANNON.Body({
	mass: 1,
	shape: wheelShape
})
vehicle.addWheel({
	body: wheelBody4,
	// 轮子位置
	position: new CANNON.Vec3(4, -0.5, -3.5),
	// 旋转轴
	axis: new CANNON.Vec3(0, 0, -1),
	direction: new CANNON.Vec3(0, -1, 0)
})
// world.addBody(wheelBody4);
phyMeshes.push(wheelBody4)

// three.js的车轮
const wheelMesh4 = new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), wheelMaterial)
scene.add(wheelMesh4)
meshes.push(wheelMesh4)

// 设置完毕之后，将车子添加到世界中
vehicle.addToWorld(world)

// 控制车子
window.addEventListener("keydown", event => {
	console.log(event.key)
	if (event.key === "w") {
		// setWheelForce(力，轮子编号)
		vehicle.setWheelForce(-100, 0)
		vehicle.setWheelForce(-100, 2)
	}
	if (event.key === "s") {
		vehicle.setWheelForce(100, 0)
		vehicle.setWheelForce(100, 2)
	}
	if (event.key === "a") {
		vehicle.setSteeringValue(Math.PI / 4, 0)
		vehicle.setSteeringValue(Math.PI / 4, 2)
	}
	if (event.key === "d") {
		vehicle.setSteeringValue(-Math.PI / 4, 0)
		vehicle.setSteeringValue(-Math.PI / 4, 2)
	}
})
window.addEventListener("keyup", event => {
	if (event.key === "w") {
		vehicle.setWheelForce(0, 0)
		vehicle.setWheelForce(0, 2)
	}
	if (event.key === "s") {
		vehicle.setWheelForce(0, 0)
		vehicle.setWheelForce(0, 2)
	}
	if (event.key === "a") {
		vehicle.setSteeringValue(0, 0)
		vehicle.setSteeringValue(0, 2)
	}
	if (event.key === "d") {
		vehicle.setSteeringValue(0, 0)
		vehicle.setSteeringValue(0, 2)
	}
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
