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

const rows = 15
const cols = 15
const bodies: any = {}
const boxGeometry = new THREE.SphereGeometry(0.3, 8, 8)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const particleShape = new CANNON.Particle()
for (let i = 0; i < cols; i++) {
	for (let j = 0; j < rows; j++) {
		const body = new CANNON.Body({
			mass: 0.5,
			shape: particleShape,
			position: new CANNON.Vec3(i - cols * 0.5, 10, j - rows * 0.5)
		})
		world.addBody(body)
		bodies[`${i}-${j}`] = body
		phyMeshes.push(body)

		const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
		boxMesh.position.set(i - cols * 0.5, 10, j - rows * 0.5)
		meshes.push(boxMesh)
		scene.add(boxMesh)
	}
}

for (let i = 0; i < cols; i++) {
	for (let j = 0; j < rows; j++) {
		const body = bodies[`${i}-${j}`]
		if (i > 0) {
			const body2 = bodies[`${i - 1}-${j}`]
			const constraint = new CANNON.DistanceConstraint(body, body2, 1)
			world.addConstraint(constraint)
		}
		if (j > 0) {
			const body2 = bodies[`${i}-${j - 1}`]
			const constraint = new CANNON.DistanceConstraint(body, body2, 1)
			world.addConstraint(constraint)
		}
	}
}

// 创建物理球体
const sphereShape = new CANNON.Sphere(5)
const sphereBody = new CANNON.Body({
	mass: 0,
	shape: sphereShape,
	position: new CANNON.Vec3(0, 0, 0),
	material: boxMaterialCon,
	collisionFilterGroup: GROUP2,
	collisionFilterMask: GROUP1 | GROUP2 | GROUP3
})
world.addBody(sphereBody)
phyMeshes.push(sphereBody)

// 创建球体几何体
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh.position.set(0, 0, 0)
meshes.push(sphereMesh)
scene.add(sphereMesh)

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
