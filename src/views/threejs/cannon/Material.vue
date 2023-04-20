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

// 设置立方体材质
const boxMaterialCon = new CANNON.Material("boxMaterial")
boxMaterialCon.friction = 0.7
boxMaterialCon.restitution = 1

// 创建一个物理世界平面
const planeShape = new CANNON.Box(new CANNON.Vec3(5, 0.1, 5))
// 创建一个刚体
const planeBody = new CANNON.Body({
	// mass: 0,
	shape: planeShape,
	position: new CANNON.Vec3(0, 0, 0),
	type: CANNON.Body.STATIC, // 设置为静态的
	material: boxMaterialCon
})
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0.1)
world.addBody(planeBody)

// 创建一个平面
const planeGeometry = new THREE.BoxGeometry(10, 0.2, 10)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xfff000, side: THREE.DoubleSide })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
planeMesh.rotation.x = 0.1
scene.add(planeMesh)

// 粗糙立方体
// 创建物理立方体
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
// 创建一个刚体
const boxBody = new CANNON.Body({
	shape: boxShape,
	position: new CANNON.Vec3(0, 5, 0),
	mass: 1,
	material: boxMaterialCon
})
// 将刚体添加到物理世界
world.addBody(boxBody)
phyMeshes.push(boxBody)

// 创建立方体几何体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh)
meshes.push(boxMesh)

// 光滑立方体
const boxMaterialCon2 = new CANNON.Material("boxSlipperyMaterial")
boxMaterialCon2.friction = 0
const boxBody2 = new CANNON.Body({
	shape: boxShape,
	position: new CANNON.Vec3(1, 5, 0),
	mass: 1,
	material: boxMaterialCon2
})
world.addBody(boxBody2)
phyMeshes.push(boxBody2)

const boxMesh2 = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh2)
meshes.push(boxMesh2)

// 反弹效果
const boxBouncyMaterial = new CANNON.Material("boxBouncyMaterial")
// boxBouncyMaterial.friction = 0.1
// boxBouncyMaterial.restitution = 1

const boxBody3 = new CANNON.Body({
	shape: boxShape,
	position: new CANNON.Vec3(2, 5, 0),
	mass: 1,
	material: boxBouncyMaterial
})
world.addBody(boxBody3)
phyMeshes.push(boxBody3)

const boxMesh3 = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh3)
meshes.push(boxMesh3)

// 定义接触材质
const Material3ToGround = new CANNON.ContactMaterial(boxMaterialCon, boxBouncyMaterial, {
	friction: 0,
	restitution: 1
})
world.addContactMaterial(Material3ToGround)

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
