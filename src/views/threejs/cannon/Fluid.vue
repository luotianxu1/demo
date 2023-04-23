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
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshBasicMaterial({
		color: 0x666666
	})
)
groundMesh.rotation.x = -Math.PI / 2
scene.add(groundMesh)
meshes.push(groundMesh)

// 创建前后左右四个平面
const planeShape = new CANNON.Plane()
const planeBody1 = new CANNON.Body({
	mass: 0,
	shape: planeShape,
	material: new CANNON.Material()
})
planeBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
planeBody1.position.set(5, 5, 0)
world.addBody(planeBody1)
phyMeshes.push(planeBody1)

const planeMesh1 = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshBasicMaterial({
		color: 0x666666,
		wireframe: true
	})
)
planeMesh1.position.copy(planeBody1.position as any as THREE.Vector3)
planeMesh1.quaternion.copy(planeBody1.quaternion as any as THREE.Quaternion)
scene.add(planeMesh1)
meshes.push(planeMesh1)

const planeBody2 = new CANNON.Body({
	mass: 0,
	shape: planeShape,
	material: new CANNON.Material()
})
planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), Math.PI / 2)
planeBody2.position.set(-5, 5, 0)
world.addBody(planeBody2)
phyMeshes.push(planeBody2)

const planeMesh2 = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshBasicMaterial({
		color: 0x666666,
		wireframe: true
	})
)
planeMesh2.position.copy(planeBody2.position as any as THREE.Vector3)
planeMesh2.quaternion.copy(planeBody2.quaternion as any as THREE.Quaternion)
scene.add(planeMesh2)
meshes.push(planeMesh2)

const planeBody3 = new CANNON.Body({
	mass: 0,
	shape: planeShape,
	material: new CANNON.Material()
})
planeBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI)
planeBody3.position.set(0, 5, 5)
world.addBody(planeBody3)
phyMeshes.push(planeBody3)

const planeMesh3 = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshBasicMaterial({
		color: 0x666666,
		wireframe: true
	})
)
planeMesh3.position.copy(planeBody3.position as any as THREE.Vector3)
planeMesh3.quaternion.copy(planeBody3.quaternion as any as THREE.Quaternion)
scene.add(planeMesh3)
meshes.push(planeMesh3)

const planeBody4 = new CANNON.Body({
	mass: 0,
	shape: planeShape,
	material: new CANNON.Material()
})
planeBody4.position.set(0, 5, -5)

world.addBody(planeBody4)
phyMeshes.push(planeBody4)

const planeMesh4 = new THREE.Mesh(
	new THREE.PlaneGeometry(10, 10),
	new THREE.MeshBasicMaterial({
		color: 0x666666,
		wireframe: true
	})
)
planeMesh4.position.copy(planeBody4.position as any as THREE.Vector3)
planeMesh4.quaternion.copy(planeBody4.quaternion as any as THREE.Quaternion)
scene.add(planeMesh4)
meshes.push(planeMesh4)

// 创建SPH流体系统
const sphSystem = new CANNON.SPHSystem()
// 流体密度
sphSystem.density = 1
// 流体粘度
sphSystem.viscosity = 0.01
// 流体交互距离
sphSystem.smoothingRadius = 1
// 将流体系统添加到世界中
world.subsystems.push(sphSystem)

// 创建流体粒子
const particleShape = new CANNON.Particle()
const sphereGeometry = new THREE.SphereGeometry(0.1, 10, 10)
const sphereMaterial = new THREE.MeshBasicMaterial({
	color: 0xff0000
})
const particleMaterial = new CANNON.Material()
for (let i = 0; i < 400; i++) {
	const particleBody = new CANNON.Body({
		mass: 0.01,
		shape: particleShape,
		material: particleMaterial
	})
	particleBody.position.set(Math.random() * -0.5, 10 + i, Math.random() * -0.5)
	world.addBody(particleBody)
	phyMeshes.push(particleBody)
	// 将粒子添加到流体系统中
	// sphSystem.particles.push(particleBody);
	sphSystem.add(particleBody)

	// threejs小球
	const particleMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
	particleMesh.position.copy(particleBody.position as any as THREE.Vector3)
	scene.add(particleMesh)
	meshes.push(particleMesh)
}

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
