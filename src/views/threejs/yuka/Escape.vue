<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script setup lang="ts">
import * as THREE from "three"
import * as YUKA from "yuka"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js"

let scene = new THREE.Scene()
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let entityManager: YUKA.EntityManager

// 创建地面
const planeGeometry = new THREE.PlaneGeometry(50, 50)
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x999999 })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true
plane.rotation.x = -Math.PI / 2
plane.position.y = -0.5
scene.add(plane)

// 创建灯光
const light = new THREE.SpotLight(0xffffff, 3, 100, Math.PI / 6, 0.5)
light.position.set(10, 40, 10)
light.castShadow = true
scene.add(light)

// 创建目标小球
const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32)
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff })
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.receiveShadow = true
sphere.castShadow = true
scene.add(sphere)

// 创建yuka的车辆
const vehicle = new YUKA.Vehicle()
vehicle.maxSpeed = 5

// 创建目标
const target = new YUKA.GameEntity()
target.setRenderComponent(sphere, callback)
target.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10)

// 创建对实体管理对象
entityManager = new YUKA.EntityManager()
entityManager.add(vehicle)
entityManager.add(target)

// 创建障碍物
const obstacles = []

for (let i = 0; i < 5; i++) {
	const boxGeometry = new THREE.BoxGeometry(3, 3, 3)
	const boxMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
	const box = new THREE.Mesh(boxGeometry, boxMaterial)
	box.position.set(Math.random() * 30 - 15, 0, Math.random() * 30 - 5)
	box.receiveShadow = true
	box.castShadow = true
	scene.add(box)
	// 创建障碍物
	const obstacle = new YUKA.GameEntity()
	obstacle.position.copy(box.position as any as YUKA.Vector3)

	// 设置障碍物半径
	boxGeometry.computeBoundingSphere()
	obstacle.boundingRadius = boxGeometry.boundingSphere!.radius
	obstacles.push(obstacle)

	entityManager.add(obstacle)
}

// 避障行为
const obstacleAvoidanceBehavior = new YUKA.ObstacleAvoidanceBehavior(obstacles)
vehicle.steering.add(obstacleAvoidanceBehavior)
vehicle.smoother = new YUKA.Smoother(30)

// 逃离行为
const fleeBehavior = new YUKA.FleeBehavior(target.position, 3)
vehicle.steering.add(fleeBehavior)

const webgl = ref()
onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 10, 20)
	camera.lookAt(0, 0, 0)

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.shadowMap.enabled = true
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	webgl.value.appendChild(renderer.domElement)

	controls = new OrbitControls(camera, renderer.domElement)
	controls.enableDamping = true

	// 加载模型
	const loader = new GLTFLoader()
	const dracoLoader = new DRACOLoader()
	dracoLoader.setDecoderPath("./draco/")
	loader.setDRACOLoader(dracoLoader)
	loader.load("./model/gltf/car.gltf", function (gltf) {
		const car = gltf.scene
		car.children[0].rotation.y = Math.PI / 2
		car.children[0].scale.set(0.2, 0.2, 0.2)
		scene.add(car)
		// 设置车辆的渲染对象
		play(car)
	})

	// 点击将目标移动到点击的位置
	const ndc = new THREE.Vector2()
	const raycaster = new THREE.Raycaster()
	window.addEventListener("pointerdown", event => {
		ndc.x = (event.clientX / webgl.value.offsetWidth) * 2 - 1
		ndc.y = -(event.clientY / webgl.value.offsetHeight) * 2 + 1
		raycaster.setFromCamera(ndc, camera)
		const intersects = raycaster.intersectObject(plane)
		if (intersects.length > 0) {
			const point = intersects[0].point
			target.position.set(point.x, 0, point.z)
		}
	})

	animate()
}

const play = (car: THREE.Group) => {
	vehicle.setRenderComponent(car, callback)
}

function callback(entity: any, renderComponent: any) {
	renderComponent.position.copy(entity.position)
	renderComponent.quaternion.copy(entity.rotation)
}

const time = new YUKA.Time()
function animate() {
	const delta = time.update().getDelta()
	controls.update()
	entityManager.update(delta)
	renderer.render(scene, camera)
	requestAnimationFrame(animate)
}
</script>

<style>
.webgl {
	width: 100%;
	height: 100%;
}
</style>
