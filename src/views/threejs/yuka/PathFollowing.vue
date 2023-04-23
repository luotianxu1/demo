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

// 创建yuka的车辆
const vehicle = new YUKA.Vehicle()
vehicle.maxSpeed = 5

// 创建yuka的路径
const path = new YUKA.Path()
path.add(new YUKA.Vector3(0, 0, 0))
path.add(new YUKA.Vector3(0, 0, 10))
path.add(new YUKA.Vector3(10, 0, 10))
path.add(new YUKA.Vector3(10, 0, 0))
path.add(new YUKA.Vector3(0, 0, 0))
// 设置路径的循环模式
path.loop = true

// 将路径当前的位置设置为车辆的位置
vehicle.position.copy(path.current())

// 跟随路径的行为
const followPathBehavior = new YUKA.FollowPathBehavior(path)
vehicle.steering.add(followPathBehavior)

// 保持在路径中行为
const onPathBehavior = new YUKA.OnPathBehavior(path, 0.1)
onPathBehavior.weight = 10
vehicle.steering.add(onPathBehavior)

// 创建对实体管理对象
entityManager = new YUKA.EntityManager()
entityManager.add(vehicle)

showPathLine(path)
function showPathLine(path: any) {
	const positions = []
	for (let i = 0; i < path._waypoints.length; i++) {
		positions.push(path._waypoints[i].x, path._waypoints[i].y, path._waypoints[i].z)
	}
	const geometry = new THREE.BufferGeometry()
	geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
	const material = new THREE.LineBasicMaterial({ color: 0x0000ff })
	const line = new THREE.Line(geometry, material)
	scene.add(line)
}

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

	animate()
}

const play = (car: THREE.Group) => {
	console.log(123)

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
