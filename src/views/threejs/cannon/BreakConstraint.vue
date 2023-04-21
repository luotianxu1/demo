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

// 创建15个距离约束的小球
for (let i = 0; i < 15; i++) {
	const sphereShape = new CANNON.Sphere(0.45)
	const sphereBody = new CANNON.Body({
		mass: i === 0 ? 0 : 1,
		shape: sphereShape,
		position: new CANNON.Vec3(0, 15 - i * 0.9, 0)
	})
	world.addBody(sphereBody)
	phyMeshes.push(sphereBody)

	const sphereGeometry = new THREE.SphereGeometry(0.45, 32, 32)
	const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
	const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
	sphereMesh.position.copy(sphereBody.position as any as THREE.Vector3)
	meshes.push(sphereMesh)
	scene.add(sphereMesh)

	// 创建距离约束
	if (i > 0) {
		const constraint = new CANNON.DistanceConstraint(sphereBody, phyMeshes[i - 1], 0.9)
		world.addConstraint(constraint)
	}
}

window.addEventListener("click", () => {
	// 创建一个球体
	const sphereShape = new CANNON.Sphere(0.45)
	const sphereBody = new CANNON.Body({
		mass: 1,
		shape: sphereShape,
		position: new CANNON.Vec3(5, 10, 0)
	})
	world.addBody(sphereBody)
	phyMeshes.push(sphereBody)
	sphereBody.velocity.set(-50, 0, 0)

	const sphereGeometry = new THREE.SphereGeometry(0.45, 32, 32)
	const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
	const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
	sphereMesh.position.copy(sphereBody.position as any as THREE.Vector3)
	meshes.push(sphereMesh)
	scene.add(sphereMesh)
})

// 在每次世界模拟完一个时间步之后，判断约束力度的绝对值大小，如果大于1000，就删除约束
world.addEventListener("postStep", () => {
	// 循环判断世界约束
	for (let i = 0; i < world.constraints.length; i++) {
		const constraint = world.constraints[i]
		// 获取约束力度的绝对值大小
		let multiplier = Math.abs(constraint.equations[0].multiplier)
		if (multiplier > 1000) {
			// 删除约束
			world.removeConstraint(constraint)
		}
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
