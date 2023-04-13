<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { Octree } from "three/examples/jsm/math/Octree"
// import { OctreeHelper } from "three/examples/jsm/helpers/OctreeHelper.js"
import { Capsule } from "three/examples/jsm/math/Capsule.js"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0x88ccee)

	// 创建相机
	camera = new THREE.PerspectiveCamera(70, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.001, 1000)
	camera.position.set(3, 3, 3)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = THREE.VSMShadowMap
	renderer.outputEncoding = THREE.sRGBEncoding
	renderer.toneMapping = THREE.ACESFilmicToneMapping

	const clock = new THREE.Clock()

	// 创建一个平面
	const planeGeometry = new THREE.PlaneGeometry(20, 20, 1, 1)
	const planeMaterial = new THREE.MeshBasicMaterial({
		color: 0xffffff,
		side: THREE.DoubleSide
	})
	const plane = new THREE.Mesh(planeGeometry, planeMaterial)
	plane.receiveShadow = true
	plane.rotation.x = -Math.PI / 2
	// 创建立方体叠楼梯的效果
	for (let i = 0; i < 10; i++) {
		const boxGeometry = new THREE.BoxGeometry(1, 1, 0.15)
		const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
		const box = new THREE.Mesh(boxGeometry, boxMaterial)
		box.position.y = 0.15 + i * 0.15
		box.position.z = i * 0.3
		plane.add(box)
	}

	const group = new THREE.Group()
	group.add(plane)
	scene.add(group)

	// 创建一个octree
	const worldOctree = new Octree()
	worldOctree.fromGraphNode(group)

	// 创建一个octreeHelper
	// const octreeHelper = new OctreeHelper(worldOctree, "red")
	// scene.add(octreeHelper)

	// 创建一个人的碰撞体
	const playerCollider = new Capsule(new THREE.Vector3(0, 0.35, 0), new THREE.Vector3(0, 1.35, 0), 0.35)

	// 创建一个平面
	const capsuleBodyGeometry = new THREE.PlaneGeometry(1, 0.5, 1, 1)
	const capsuleBodyMaterial = new THREE.MeshBasicMaterial({
		color: 0x0000ff,
		side: THREE.DoubleSide
	})
	const capsuleBody = new THREE.Mesh(capsuleBodyGeometry, capsuleBodyMaterial)
	capsuleBody.position.set(0, 0.5, 0)
	// 创建一个胶囊物体
	const capsuleGeometry = new THREE.CapsuleGeometry(0.35, 1, 32)
	const capsuleMaterial = new THREE.MeshBasicMaterial({
		color: 0xff0000,
		side: THREE.DoubleSide
	})
	const capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial)
	capsule.position.set(0, 0.85, 0)

	// 将相机作为胶囊的子元素，就可以实现跟随
	camera.position.set(0, 2, -5)
	camera.lookAt(capsule.position)
	// 控制旋转上下的空3d对象
	const capsuleBodyControl = new THREE.Object3D()
	capsuleBodyControl.add(camera)
	capsule.add(capsuleBodyControl)
	capsule.add(capsuleBody)

	scene.add(capsule)

	// 设置重力
	const gravity = -9.8
	// 玩家的速度
	const playerVelocity = new THREE.Vector3(0, 0, 0)
	// 方向向量
	const playerDirection = new THREE.Vector3(0, 0, 0)
	// 玩家是否在地面上
	let playerOnFloor = false
	// 键盘按下事件
	const keyStates = {
		KeyW: false,
		KeyA: false,
		KeyS: false,
		KeyD: false,
		Space: false,
		isDown: false
	}

	webgl.value.appendChild(renderer.domElement)
	renderScene()

	function updatePlayer(deltaTime: number) {
		let damping = -0.05
		if (playerOnFloor) {
			playerVelocity.y = 0
			keyStates.isDown || playerVelocity.addScaledVector(playerVelocity, damping)
		} else {
			playerVelocity.y += gravity * deltaTime
		}
		// 计算玩家移动的距离
		const playerMoveDistance = playerVelocity.clone().multiplyScalar(deltaTime)
		playerCollider.translate(playerMoveDistance)
		// 将胶囊的位置进行设置
		playerCollider.getCenter(capsule.position)
		// 进行碰撞检测
		playerCollisions()
	}

	// 人物碰撞检测
	function playerCollisions() {
		const result = worldOctree.capsuleIntersect(playerCollider)
		playerOnFloor = false
		if (result) {
			playerOnFloor = result.normal.y > 0
			playerCollider.translate(result.normal.multiplyScalar(result.depth))
		}
	}

	function resetPlayer() {
		if (capsule.position.y < -20) {
			playerCollider.start.set(0, 2.35, 0)
			playerCollider.end.set(0, 3.35, 0)
			playerCollider.radius = 0.35
			playerVelocity.set(0, 0, 0)
			playerDirection.set(0, 0, 0)
		}
	}

	// 根据键盘按下的键来更新键盘的状态
	document.addEventListener(
		"keydown",
		event => {
			keyStates[event.code as keyof typeof keyStates] = true
			keyStates.isDown = true
		},
		false
	)
	document.addEventListener(
		"keyup",
		event => {
			keyStates[event.code as keyof typeof keyStates] = false
			keyStates.isDown = false
		},
		false
	)
	document.addEventListener(
		"mousedown",
		() => {
			// 锁定鼠标指针
			document.body.requestPointerLock()
		},
		false
	)
	// 根据鼠标在屏幕移动，来旋转胶囊
	window.addEventListener(
		"mousemove",
		event => {
			capsule.rotation.y -= event.movementX * 0.003
			capsuleBodyControl.rotation.x += event.movementY * 0.003
			if (capsuleBodyControl.rotation.x > Math.PI / 8) {
				capsuleBodyControl.rotation.x = Math.PI / 8
			} else if (capsuleBodyControl.rotation.x < -Math.PI / 8) {
				capsuleBodyControl.rotation.x = -Math.PI / 8
			}
		},
		false
	)

	// 根据键盘状态更新玩家速度
	function controlPlayer(delta: number) {
		//获取胶囊的正前面方向
		const capsuleFront = new THREE.Vector3(0, 0, 0)
		capsule.getWorldDirection(capsuleFront)
		if (keyStates["KeyW"]) {
			playerDirection.z = 1
			// 计算玩家的速度
			playerVelocity.add(capsuleFront.multiplyScalar(delta))
		}
		if (keyStates["KeyS"]) {
			playerDirection.z = 1
			// 计算玩家的速度
			playerVelocity.add(capsuleFront.multiplyScalar(-delta))
		}
		if (keyStates["KeyA"]) {
			playerDirection.x = 1
			// 侧方的方向，正前面的方向和胶囊的正上方求叉积，求出侧方的方向
			capsuleFront.cross(capsule.up)
			// 计算玩家的速度
			playerVelocity.add(capsuleFront.multiplyScalar(-delta))
		}
		if (keyStates["KeyD"]) {
			playerDirection.x = 1
			// 侧方的方向，正前面的方向和胶囊的正上方求叉积，求出侧方的方向
			capsuleFront.cross(capsule.up)
			// 计算玩家的速度
			playerVelocity.add(capsuleFront.multiplyScalar(delta))
		}
		if (keyStates["Space"]) {
			playerVelocity.y = 15
		}
	}

	// 多层次细节展示
	const material = new THREE.MeshBasicMaterial({
		color: 0xff0000,
		wireframe: true
	})
	let lod = new THREE.LOD()
	for (let i = 0; i < 5; i++) {
		const geometry = new THREE.SphereGeometry(1, 22 - i * 5, 22 - i * 5)
		const mesh = new THREE.Mesh(geometry, material)
		lod.addLevel(mesh, i * 5)
	}
	lod.position.set(10, 0, 10)
	scene.add(lod)

	function renderScene() {
		let delta = clock.getDelta()
		updatePlayer(delta)
		controlPlayer(delta)
		resetPlayer()
		renderer.render(scene, camera)
		requestAnimationFrame(renderScene)
	}
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
