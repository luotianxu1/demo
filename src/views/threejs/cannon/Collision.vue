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
const GROUP4 = 8

// 初始化物理世界
const world = new CANNON.World()
// 设置重力
world.gravity.set(0, -9.82, 0)

// 设置物理世界允许休眠
world.allowSleep = true

// 设置立方体材质
const boxMaterialCon = new CANNON.Material("boxMaterial")
boxMaterialCon.friction = 0.01

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

// 创建一个平面
const planeGeometry = new THREE.BoxGeometry(10, 0.2, 10)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xfff000, side: THREE.DoubleSide })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

// 创建物理立方体
const boxShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
// 创建一个刚体
const boxBody = new CANNON.Body({
	shape: boxShape,
	position: new CANNON.Vec3(-2, 5, 0),
	mass: 1,
	material: boxMaterialCon,
	collisionFilterGroup: GROUP1,
	collisionFilterMask: GROUP1 | GROUP2 | GROUP3 | GROUP4
})
// 将刚体添加到物理世界
world.addBody(boxBody)
phyMeshes.push(boxBody)

// 设置刚体允许休眠
boxBody.allowSleep = true
// 速度如果小于0.1休眠
boxBody.sleepSpeedLimit = 0.1
// 1s之后休眠
boxBody.sleepTimeLimit = 1

boxBody.addEventListener("collide", (e: any) => {
	console.log("碰撞了", e)
	let impactStrength = e.contact.getImpactVelocityAlongNormal()
	console.log("impactStrength", impactStrength)
})
boxBody.addEventListener("sleepy", (e: any) => {
	console.log("即将进入休眠", e)
})
boxBody.addEventListener("sleep", (e: any) => {
	console.log("进入休眠", e)
})

// 创建立方体几何体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(boxMesh)
meshes.push(boxMesh)

// 创建物理球
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
	shape: sphereShape,
	position: new CANNON.Vec3(0, 0.5, 0),
	mass: 1,
	material: boxMaterialCon,
	collisionFilterGroup: GROUP2,
	collisionFilterMask: GROUP1 | GROUP4
})
world.addBody(sphereBody)
phyMeshes.push(sphereBody)

// 创建球几何体
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)
meshes.push(sphereMesh)

// 创建物理圆柱体
const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1, 32)
const cylinderBody = new CANNON.Body({
	shape: cylinderShape,
	position: new CANNON.Vec3(2, 0.5, 0),
	mass: 1,
	material: boxMaterialCon,
	collisionFilterGroup: GROUP3,
	collisionFilterMask: GROUP1 | GROUP4
})
world.addBody(cylinderBody)
phyMeshes.push(cylinderBody)

// 创建几何圆柱体
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32)
const cylinderMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
scene.add(cylinderMesh)
meshes.push(cylinderMesh)

// 设置立方体初始速度
boxBody.velocity.set(2, 0, 0)

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
