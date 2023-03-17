<template>
	<div class="home" v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 1.0)">
		<div ref="screenDom" class="canvas-container"></div>
		<div ref="pages" class="pages">
			<div class="page">
				<h2 class="title">前端</h2>
				<p>轻松、好玩、有趣掌握前沿硬核前端技术</p>
			</div>
			<div class="page">
				<h2 class="title">WEB 3D可视化</h2>
				<p>领略WEB 3D的魅力,让页面无比酷炫</p>
			</div>
			<div class="page">
				<h2 class="title">ThreeJS框架</h2>
				<p>让前端开发3D效果更方便</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { gsap } from "gsap"
import { ElMessage } from "element-plus"

let screenDom = ref()
let pages = ref()
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let directionalLight1: THREE.DirectionalLight
let directionalLight2: THREE.DirectionalLight
let ambientLight: THREE.AmbientLight
const loading = ref(true)
const loadingText = ref("加载中")
let glb1: THREE.Object3D<THREE.Event> | THREE.Group
let glb2: THREE.Object3D<THREE.Event> | THREE.Group
let glb3: THREE.Object3D<THREE.Event> | THREE.Group
let moon: THREE.Mesh
let moonGroup: THREE.Object3D<THREE.Event> | THREE.Group

let event = {
	onLoad: () => {
		init()
		loading.value = false
	},
	onProgress: (url: any, num: number, total: number) => {
		console.log((Number(num / total) * 100).toFixed(2) + "%")
	},
	onError: (e: any) => {
		console.log(e)
		ElMessage.error("加载出现错误")
	}
}
const loadingManager = new THREE.LoadingManager(event.onLoad, event.onProgress, event.onError)
const gltfLoader = new GLTFLoader(loadingManager)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("./draco/gltf/")
dracoLoader.setDecoderConfig({ type: "js" })
dracoLoader.preload()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load("./model/glb/xz.glb", glb => {
	glb1 = glb.scene
	glb1.scale.set(0.1, 0.1, 0.1)
	glb1.position.set(3, 0, 0)
})
gltfLoader.load("./model/glb/xq6.glb", glb => {
	glb2 = glb.scene
	glb2.scale.set(0.06, 0.06, 0.06)
	glb2.position.set(3, -8, 0)
})
gltfLoader.load("./model/glb/gr75.glb", glb => {
	glb3 = glb.scene
	glb3.scale.set(0.8, 0.8, 0.8)
	glb3.position.set(3, -16, 0)
})
gltfLoader.load("./model/glb/moon.glb", glb => {
	moon = glb.scene.children[0] as THREE.Mesh
	moonGroup = new THREE.Group()
	for (let j = 0; j < 10; j++) {
		let moonInstance = new THREE.InstancedMesh(moon.geometry, moon.material, 100)

		for (let i = 0; i < 100; i++) {
			let x = Math.random() * 1000 - 500
			let y = Math.random() * 1000 - 500
			let z = Math.random() * 1000 - 500

			let matrix = new THREE.Matrix4()
			let size = Math.random() * 20 - 8
			matrix.makeScale(size, size, size)
			matrix.makeTranslation(x, y, z)
			moonInstance.setMatrixAt(i, matrix)
		}
		moonGroup.add(moonInstance)
	}
})

const init = () => {
	loading.value = true
	// 创建场景
	scene = new THREE.Scene()
	// 创建相机
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.set(0, 0, 10)
	// 创建等该功能
	directionalLight1 = new THREE.DirectionalLight(0xffffff, 1)
	directionalLight1.position.set(0, 0, 1)
	scene.add(directionalLight1)
	directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5)
	directionalLight2.position.set(0, 0, -1)
	scene.add(directionalLight2)
	ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
	scene.add(ambientLight)
	// 创建渲染器
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)
	renderer.render(scene, camera)
	renderer.toneMapping = THREE.ACESFilmicToneMapping
	screenDom.value.appendChild(renderer.domElement)
	// 添加模型
	scene.add(glb1)
	scene.add(glb2)
	scene.add(glb3)
	scene.add(moonGroup)
	// 添加事件监听
	window.addEventListener("mousemove", e => mouseMove(e))
	window.addEventListener("mousewheel", (e: any) => mousewheel(e))

	gsap.to(moonGroup.position, {
		duration: Math.random() * 10 + 2,
		z: -1000,
		ease: "linear",
		repeat: -1
	})

	render()
}

const render = () => {
	requestAnimationFrame(render)
	renderer.render(scene, camera)
}

// 监听鼠标移动，改变模型位置
const mouseMove = (e: { clientX: number; clientY: number }) => {
	let x = (e.clientX / window.innerWidth) * 2 - 1
	let y = (e.clientY / window.innerHeight) * 2 - 1

	gsap.to(glb1.rotation, {
		duration: 0.5,
		x: y,
		y: x
	})
	gsap.to(glb2.rotation, {
		duration: 0.5,
		x: y,
		y: x
	})
	gsap.to(glb3.rotation, {
		duration: 0.5,
		x: y,
		y: x
	})
}

// 监听鼠标滚轮，改变页面
let page = 0
let timeline2 = gsap.timeline()
const mousewheel = (e: any) => {
	if (e.wheelDelta < 0) {
		page++
		if (page > 2) {
			page = 2
		}
	}
	if (e.wheelDelta > 0) {
		page--
		if (page < 0) {
			page = 0
		}
	}
	if (!timeline2.isActive()) {
		timeline2.to(camera.position, {
			duration: 0.5,
			y: page * -8
		})
		gsap.to(pages.value, {
			duration: 1,
			y: -page * window.innerHeight
		})
	}
}

onUnmounted(() => {
	clear()
})

const clear = () => {
	window.removeEventListener("mousemove", mouseMove)
	window.removeEventListener("mousewheel", mousewheel)
	scene.remove(glb1)
	scene.remove(glb2)
	scene.remove(glb3)
	glb1.clear()
	glb2.clear()
	glb3.clear()
	moon.clear()
	moonGroup.traverse(obj => {
		obj.clear()
	})
	scene.remove(moonGroup)
	scene.clear()
	renderer.forceContextLoss()
	renderer.dispose()
}
</script>

<style lang="scss" scoped>
.home {
	width: 100vw;
	height: 100vh;
	transform-origin: 0 0;
}
.canvas-container {
	width: 100%;
	height: 100%;
}

.pages {
	display: flex;
	flex-direction: column;
	position: fixed;
	top: 0;
	left: 0;
}
.pages .page {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	color: #fff;
	padding: 15%;
	box-sizing: border-box;
}
.pages .page .title {
	font-size: 50px;
	font-weight: 900;
	margin-bottom: 20px;
}
.pages .page p {
	font-size: 25px;
}

::-webkit-scrollbar {
	display: none;
}
</style>
