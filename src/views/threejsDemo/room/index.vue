<template>
	<div class="btn">
		<el-button type="primary" @click="changeRoom">切换房间</el-button>
	</div>
	<div
		ref="webgl"
		class="webgl"
		v-loading="loading"
		:element-loading-text="loadingText"
		element-loading-background="rgba(0, 0, 0, 1.0)"
	></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import data from "./data/data"
import RoomShapeMesh from "./threeMesh/RoomShapeMesh"
import Wall from "./threeMesh/Wall"
import WallShaderMaterial from "./threeMesh/WallShaderMaterial"
import gsap from "gsap"

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0, 2, 5.5)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 加载全景图
const loader = new THREE.TextureLoader()
const texture = loader.load("./textures/env/HdrSkyCloudy004_JPG_2K.jpg")
texture.mapping = THREE.EquirectangularReflectionMapping
scene.background = texture
scene.environment = texture

// 循环创建房间
let idToPanorama: any = {}
for (let i = 0; i < data.objData.roomList.length; i++) {
	// 获取房间数据
	const room = data.objData.roomList[i]
	let roomMesh = new RoomShapeMesh(room, false)
	let roomMesh2 = new RoomShapeMesh(room, true)
	scene.add(roomMesh, roomMesh2)

	// 房间到全景图的映射
	for (let j = 0; j < data.panoramaLocation.length; j++) {
		const panorama: any = data.panoramaLocation[j]
		if (panorama.roomId === room.roomId) {
			let material: THREE.ShaderMaterial = WallShaderMaterial(panorama)
			panorama.material = material
			idToPanorama[room.roomId] = panorama
		}
	}
	roomMesh.material = idToPanorama[room.roomId].material
	roomMesh.material.side = THREE.DoubleSide
	roomMesh2.material = idToPanorama[room.roomId].material.clone()
	roomMesh2.material.side = THREE.FrontSide
}

// 创建墙
for (let i = 0; i < data.wallRelation.length; i++) {
	let wallPoints = data.wallRelation[i].wallPoints
	let faceRelation = data.wallRelation[i].faceRelation

	faceRelation.forEach(item => {
		;(item as any).panorama = idToPanorama[item.roomId]
	})

	let mesh = new Wall(wallPoints, faceRelation)
	scene.add(mesh)
}

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = () => {
	loading.value = false
}

const webgl = ref()
onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}

let roomIndex = 0
let timeLine = gsap.timeline()
let dir = new THREE.Vector3()
let panoramaLocation = data.panoramaLocation
const changeRoom = () => {
	let room = panoramaLocation[roomIndex]
	dir = camera.position
		.clone()
		.sub(new THREE.Vector3(room.point[0].x / 100, room.point[0].z / 100, room.point[0].y / 100))
		.normalize()
	timeLine.to(camera.position, {
		duration: 1,
		x: room.point[0].x / 100 + dir.x * 0.01,
		y: room.point[0].z / 100,
		z: room.point[0].y / 100 + dir.z * 0.01
	})
	camera.lookAt(room.point[0].x / 100, room.point[0].z / 100, room.point[0].y / 100)
	controls.target.set(room.point[0].x / 100, room.point[0].z / 100, room.point[0].y / 100)
	roomIndex++
	if (roomIndex > panoramaLocation.length) {
		roomIndex = 0
	}
}
</script>

<style lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}

.btn {
	position: fixed;
	top: 50px;
	left: 50px;
}
</style>
