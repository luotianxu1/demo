<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let gui: dat.GUI

let controlsData = {
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

let controlsFunction = {
	dispose: () => {
		controls.dispose()
	},
	getAzimuthalAngle: () => {
		window.alert("当前的水平旋转" + controls.getAzimuthalAngle())
	},
	getPolarAngle: () => {
		window.alert("当前的垂直旋转" + controls.getPolarAngle())
	},
	getDistance: () => {
		window.alert("相机到目标的距离" + controls.getDistance())
	},
	saveState: () => {
		controls.saveState()
	},
	reset: () => {
		controls.reset()
	}
}

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xcccccc)

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(400, 200, 0)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	const geometry = new THREE.CylinderGeometry(0, 10, 30, 4, 1)
	const material = new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true })
	for (let i = 0; i < 500; i++) {
		const mesh = new THREE.Mesh(geometry, material)
		mesh.position.x = Math.random() * 1600 - 800
		mesh.position.y = 0
		mesh.position.z = Math.random() * 1600 - 800
		mesh.updateMatrix()
		mesh.matrixAutoUpdate = false
		scene.add(mesh)
	}

	const dirLight1 = new THREE.DirectionalLight(0xffffff)
	dirLight1.position.set(1, 1, 1)
	scene.add(dirLight1)

	const dirLight2 = new THREE.DirectionalLight(0x002288)
	dirLight2.position.set(-1, -1, -1)
	scene.add(dirLight2)

	const ambientLight = new THREE.AmbientLight(0x222222)
	scene.add(ambientLight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)
	for (let item in controlsData) {
		;(controls as any)[item] = controlsData[item as keyof typeof controlsData]
	}

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.add(controlsData, "autoRotate").onChange((value: boolean) => {
		controls.autoRotate = value
	})
	gui
		.add(controlsData, "autoRotateSpeed")
		.min(0)
		.max(5)
		.onChange((value: number) => {
			controls.autoRotateSpeed = value
		})
	gui.add(controlsData, "enableDamping").onChange((value: boolean) => {
		controls.enableDamping = value
	})
	gui
		.add(controlsData, "dampingFactor")
		.min(0)
		.max(0.5)
		.onChange((value: number) => {
			controls.dampingFactor = value
		})
	gui.add(controlsData, "enabled").onChange((value: boolean) => {
		controls.enabled = value
	})
	gui.add(controlsData, "enablePan").onChange((value: boolean) => {
		controls.enablePan = value
	})
	gui.add(controlsData, "enableRotate").onChange((value: boolean) => {
		controls.enableRotate = value
	})
	gui.add(controlsData, "enableZoom").onChange((value: boolean) => {
		controls.enableZoom = value
	})
	gui
		.add(controlsData, "maxDistance")
		.min(800)
		.max(2000)
		.onChange((value: number) => {
			controls.maxDistance = value
		})
	gui
		.add(controlsData, "minDistance")
		.min(50)
		.max(800)
		.onChange((value: number) => {
			controls.minDistance = value
		})
	gui
		.add(controlsData, "maxPolarAngle")
		.min(0)
		.max(Math.PI)
		.onChange((value: number) => {
			controls.maxPolarAngle = value
		})
	gui
		.add(controlsData, "minPolarAngle")
		.min(0)
		.max(Math.PI)
		.onChange((value: number) => {
			controls.minPolarAngle = value
		})
	gui
		.add(controlsData, "maxZoom")
		.min(0)
		.max(600)
		.onChange((value: number) => {
			controls.maxZoom = value
		})
	gui
		.add(controlsData, "minZoom")
		.min(0)
		.max(600)
		.onChange((value: number) => {
			controls.minZoom = value
		})
	gui
		.add(controlsData, "panSpeed")
		.min(0)
		.max(5)
		.onChange((value: number) => {
			controls.panSpeed = value
		})
	gui
		.add(controlsData, "rotateSpeed")
		.min(0)
		.max(5)
		.onChange((value: number) => {
			controls.rotateSpeed = value
		})
	gui.add(controlsData, "screenSpacePanning").onChange((value: boolean) => {
		controls.screenSpacePanning = value
	})
	gui.add(controlsFunction, "dispose")
	gui.add(controlsFunction, "getAzimuthalAngle")
	gui.add(controlsFunction, "getPolarAngle")
	gui.add(controlsFunction, "getDistance")
	gui.add(controlsFunction, "reset")
	gui.add(controlsFunction, "saveState")
}

onUnmounted(() => {
	gui.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
