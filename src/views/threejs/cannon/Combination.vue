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
boxMaterialCon.friction = 0.2
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

// 创建一个平面
const planeGeometry = new THREE.BoxGeometry(10, 0.2, 10)
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xfff000, side: THREE.DoubleSide })
const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(planeMesh)

// 创建由2个球加1个圆柱体组成的胶囊
// 创建body
const capsuleBody = new CANNON.Body({
	mass: 1,
	position: new CANNON.Vec3(0, 5, 0),
	material: boxMaterialCon,
	collisionFilterGroup: GROUP2,
	collisionFilterMask: GROUP1 | GROUP2 | GROUP3
})
const sphereShape = new CANNON.Sphere(0.5)
const cylinderShape = new CANNON.Cylinder(0.5, 0.5, 1.5, 20)
capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, 0.75, 0))
capsuleBody.addShape(cylinderShape, new CANNON.Vec3(0, 0, 0))
capsuleBody.addShape(sphereShape, new CANNON.Vec3(0, -0.75, 0))
capsuleBody.velocity.set(2, 0, 0)
world.addBody(capsuleBody)
phyMeshes.push(capsuleBody)

// 创建胶囊体网络
const capsuleGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1.5, 20)
const capsuleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial)
capsuleMesh.position.copy(capsuleBody.position as any as THREE.Vector3)
capsuleMesh.quaternion.copy(capsuleBody.quaternion as any as THREE.Quaternion)
scene.add(capsuleMesh)
meshes.push(capsuleMesh)

// 创建一个球体
const sphereGeometry = new THREE.SphereGeometry(0.5, 20, 20)
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh.position.set(0, 0.75, 0)
capsuleMesh.add(sphereMesh)
const sphereMesh2 = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphereMesh2.position.set(0, -0.75, 0)
capsuleMesh.add(sphereMesh2)

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
