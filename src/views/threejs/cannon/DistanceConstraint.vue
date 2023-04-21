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

// 设置碰撞组,数值要用2的幂
const GROUP1 = 1
const GROUP2 = 2
const GROUP3 = 4

// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)

// 设置立方体材质
const boxMaterialCon = new CANNON.Material("boxMaterial")
boxMaterialCon.friction = 0
boxMaterialCon.restitution = 0.1

// 创建一个物理世界平面
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))
// 创建一个刚体
const planeBody = new CANNON.Body({
	// mass: 0,
	shape: planeShape,
	position: new CANNON.Vec3(0, -0.1, 0),
	type: CANNON.Body.STATIC, // 设置为静态的
	material: boxMaterialCon,
	collisionFilterGroup: GROUP1,
	collisionFilterMask: GROUP1 | GROUP2 | GROUP3
})
world.addBody(planeBody)

// 创建一个球形
const sphereShape = new CANNON.Sphere(0.5)
let previousBody
for (let i = 0; i < 10; i++) {
	let sphereBody = new CANNON.Body({
		mass: i === 0 ? 0 : 1,
		type: i === 0 ? CANNON.Body.STATIC : CANNON.Body.DYNAMIC,
		shape: sphereShape,
		position: new CANNON.Vec3(0, 15 - i * 1.2, 0),
		material: boxMaterialCon,
		collisionFilterGroup: GROUP2,
		collisionFilterMask: GROUP1 | GROUP2 | GROUP3
	})
	world.addBody(sphereBody)
	phyMeshes.push(sphereBody)

	const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
	const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
	sphereMesh.position.y = 15 - i * 1.2
	scene.add(sphereMesh)
	meshes.push(sphereMesh)

	if (i > 0) {
		// 创建距离约束
		let constraint = new CANNON.DistanceConstraint(previousBody as any, sphereBody, 1.2)
		world.addConstraint(constraint)
	}
	previousBody = sphereBody
}

window.addEventListener("click", () => {
	// 创建一个球体
	const sphereShape = new CANNON.Sphere(0.5)
	const sphereBody = new CANNON.Body({
		mass: 1,
		shape: sphereShape,
		position: new CANNON.Vec3(0, 8, 3),
		material: boxMaterialCon,
		collisionFilterGroup: GROUP3,
		collisionFilterMask: GROUP1 | GROUP2 | GROUP3
	})
	sphereBody.velocity.set(0, 0, -10)
	world.addBody(sphereBody)
	phyMeshes.push(sphereBody)

	const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
	const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
	const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
	sphereMesh.position.y = 8
	scene.add(sphereMesh)
	meshes.push(sphereMesh)
})

// 创建一个平面
const planeGeometry = new THREE.BoxGeometry(10, 0.2, 10)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xfff000, side: THREE.DoubleSide })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.position.y = -0.1
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
