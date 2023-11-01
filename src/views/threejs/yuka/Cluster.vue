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

entityManager = new YUKA.EntityManager()

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
	controls.enableDamping = true // 加载模型

	const loader = new GLTFLoader()
	const dracoLoader = new DRACOLoader()
	dracoLoader.setDecoderPath("./draco/")
	loader.setDRACOLoader(dracoLoader)
	loader.load("./threejs/yuka/car.gltf", function (gltf) {
		// 创建群体随机行走行为
		const wanderBehavior = new YUKA.WanderBehavior(3)

		// 设置整齐群体转向
		const alignmentBehavior = new YUKA.AlignmentBehavior()
		alignmentBehavior.weight = 5

		// 设置聚集行为
		const cohesionBehavior = new YUKA.CohesionBehavior()
		cohesionBehavior.weight = 5

		// 设置分离行为
		const separationBehavior = new YUKA.SeparationBehavior()
		separationBehavior.weight = 0.5

		for (let i = 0; i < 40; i++) {
			// 创建yuka的车辆
			const vehicle = new YUKA.Vehicle()
			vehicle.position.set(Math.random() * 20 - 10, 0, Math.random() * 20 - 10)
			vehicle.rotation.fromEuler(0, Math.random() * Math.PI, 0)
			vehicle.maxSpeed = 3
			const car = gltf.scene.clone()
			car.children[0].rotation.y = Math.PI / 2
			car.children[0].scale.set(0.2, 0.2, 0.2)
			scene.add(car)
			vehicle.setRenderComponent(car, callback)
			entityManager.add(vehicle)

			vehicle.steering.add(wanderBehavior)
			vehicle.steering.add(alignmentBehavior)
			vehicle.steering.add(cohesionBehavior)
			vehicle.steering.add(separationBehavior)
		}
	})

	animate()
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
