<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

onMounted(() => {
	init()
})

const webgl = ref<HTMLDivElement>()
let web: WebGl

const init = () => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.scene.background = new THREE.Color(0xcccccc)
	web.camera.position.set(400, 200, 0)

	web.addDirectionalLight(1, 1, 1, 0xffffff)
	web.addDirectionalLight(-1, -1, -1, 0x002288)
	web.addAmbientLight(0x222222)

	for (let item in controlsData) {
		web.orbitControls[item] = controlsData[item]
	}

	const geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1)
	const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true })
	for (let i = 0; i < 500; i++) {
		const mesh = new THREE.Mesh(geometry, material)
		mesh.position.x = Math.random() * 1600 - 800
		mesh.position.y = 0
		mesh.position.z = Math.random() * 1600 - 800
		mesh.updateMatrix()
		mesh.matrixAutoUpdate = false
		web.scene.add(mesh)
	}

	addGui()

	renderScene()
}

const controlsData = {
	autoRotate: true, // 自动围绕目标旋转
	autoRotateSpeed: 2.0, // 围绕目标旋转的速度
	enableDamping: true, // 启用阻尼
	dampingFactor: 0.05, // 阻尼惯性有多大
	enabled: true, // 响应用户操作
	enablePan: true, // 启用或禁用摄像机平移
	enableRotate: true, // 启用或禁用摄像机水平或垂直旋转
	enableZoom: true, // 启用或禁用摄像机的缩放
	maxDistance: 2000, // 你能够将相机向外移动多少（仅适用于 PerspectiveCamera）
	minDistance: 100, //能够将相机向内移动多（仅适用于 PerspectiveCamera）
	maxPolarAngle: Math.PI, // 能够垂直旋转的角度的上限
	minPolarAngle: 0, // 能够垂直旋转的角度的下限
	maxZoom: 100, //能够将相机缩小多少（仅适用于 OrthographicCamera
	minZoom: 0, // 能够将相机放大多少（仅适用于 OrthographicCamera）
	panSpeed: 1, // 位移的速度
	rotateSpeed: 1, // 旋转的速度
	screenSpacePanning: false //定义当平移的时候摄像机的位置将如何移动,
}
const eventObj = {
	getAzimuthalAngle: function () {
		let angle = web.orbitControls.getAzimuthalAngle()
		alert(angle)
	},
	getPolarAngle: function () {
		let angle = web.orbitControls.getPolarAngle()
		alert(angle)
	},
	getDistance: function () {
		let distance = web.orbitControls.getDistance()
		alert(distance)
	},
	saveState: function () {
		web.orbitControls.saveState()
	},
	reset: function () {
		web.orbitControls.reset()
	}
}

const addGui = () => {
	const gui = web.addGUI()
	gui
		.add(controlsData, "autoRotate")
		.name("自动围绕目标旋转(autoRotate)")
		.onChange((value: boolean) => {
			web.orbitControls.autoRotate = value
		})
	gui
		.add(controlsData, "autoRotateSpeed")
		.name("旋转速度(autoRotateSpeed)")
		.min(0)
		.max(5)
		.onChange((value: number) => {
			web.orbitControls.autoRotateSpeed = value
		})
	gui
		.add(controlsData, "enableDamping")
		.name("阻尼惯性(enableDamping)")
		.onChange((value: boolean) => {
			web.orbitControls.enableDamping = value
		})
	gui
		.add(controlsData, "dampingFactor")
		.name("阻尼惯性大小(dampingFactor)")
		.min(0)
		.max(0.1)
		.onChange((value: number) => {
			web.orbitControls.dampingFactor = value
		})
	gui
		.add(controlsData, "enabled")
		.name("响应操作enabled)")
		.onChange((value: boolean) => {
			web.orbitControls.enabled = value
		})
	gui
		.add(controlsData, "enablePan")
		.name("摄像机平移(enablePan)")
		.onChange((value: boolean) => {
			web.orbitControls.enablePan = value
		})
	gui
		.add(controlsData, "enableRotate")
		.name("摄像机旋转(enableRotate)")
		.onChange((value: boolean) => {
			web.orbitControls.enableRotate = value
		})
	gui
		.add(controlsData, "enableZoom")
		.name("摄像机缩放('enableZoom')")
		.onChange((value: boolean) => {
			web.orbitControls.enableZoom = value
		})
	gui
		.add(controlsData, "maxDistance")
		.name("相机最远距离(maxDistance)")
		.min(800)
		.max(2000)
		.onChange((value: number) => {
			web.orbitControls.maxDistance = value
		})
	gui
		.add(controlsData, "minDistance")
		.name("相机最近距离(minDistance)")
		.min(50)
		.max(800)
		.onChange((value: number) => {
			web.orbitControls.minDistance = value
		})
	gui
		.add(controlsData, "maxPolarAngle")
		.name("最大垂直角度(maxPolarAngle)")
		.min(0)
		.max(Math.PI)
		.onChange((value: number) => {
			web.orbitControls.maxPolarAngle = value
		})
	gui
		.add(controlsData, "minPolarAngle")
		.name("最小垂直角度(maxPolarAngle)")
		.min(0)
		.max(Math.PI)
		.onChange((value: number) => {
			web.orbitControls.minPolarAngle = value
		})
	gui
		.add(controlsData, "maxZoom")
		.name("相机缩小多少(maxZoom)")
		.min(0)
		.max(600)
		.onChange((value: number) => {
			web.orbitControls.maxZoom = value
		})
	gui
		.add(controlsData, "minZoom")
		.name("相机放大多少(minZoom)")
		.min(0)
		.max(600)
		.onChange((value: number) => {
			web.orbitControls.minZoom = value
		})
	gui
		.add(controlsData, "panSpeed")
		.name("位移速度(panSpeed)")
		.min(0)
		.max(5)
		.onChange((value: number) => {
			web.orbitControls.panSpeed = value
		})
	gui
		.add(controlsData, "rotateSpeed")
		.name("旋转速度(rotateSpeed)")
		.min(0)
		.max(5)
		.onChange((value: number) => {
			web.orbitControls.rotateSpeed = value
		})
	gui
		.add(controlsData, "screenSpacePanning")
		.name("移动方向(screenSpacePanning)")
		.onChange((value: boolean) => {
			web.orbitControls.screenSpacePanning = value
		})
	gui.add(eventObj, "getAzimuthalAngle").name("当前水平旋转角度(getAzimuthalAngle)")
	gui.add(eventObj, "getPolarAngle").name("当前垂直旋转角度(getPolarAngle)")
	gui.add(eventObj, "getDistance").name("当前距离(getDistance)")
	gui.add(eventObj, "saveState").name("保存状态(saveState)")
	gui.add(eventObj, "reset").name("恢复状态(reset)")
}

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
