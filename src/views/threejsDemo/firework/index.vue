<template>
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
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import vertexShader from "./shader/light/vertex.glsl?raw"
import fragmentShader from "./shader/light/fragment.glsl?raw"
import Fireworks from "./fireworks"
import { Water } from "three/examples/jsm/objects/Water2"

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-20, 10, -20)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.toneMappingExposure = 0.2
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping

const controls = new OrbitControls(camera, renderer.domElement)
// controls.autoRotate = true
// controls.autoRotateSpeed = 0.5
controls.enableDamping = true

// 创建纹理加载器对象
const rgbeLoader = new RGBELoader()
rgbeLoader.loadAsync("./textures/hdr/2k.hdr").then(texture => {
	texture.mapping = THREE.EquirectangularReflectionMapping
	scene.background = texture
	scene.environment = texture
})

const shaderMaterial = new THREE.ShaderMaterial({
	vertexShader: vertexShader,
	fragmentShader: fragmentShader,
	side: THREE.DoubleSide
})

// 加载孔明灯
let lightBox: THREE.Mesh
const gltfLoader = new GLTFLoader()
gltfLoader.load("./threejsDemo/firework/flyLight.glb", gltf => {
	lightBox = gltf.scene.children[0] as THREE.Mesh
	lightBox.material = shaderMaterial
	for (let i = 0; i < 150; i++) {
		let flyLight = gltf.scene.clone(true)
		let x = (Math.random() - 0.5) * 300
		let z = (Math.random() - 0.5) * 300
		let y = Math.random() * 60 + 5
		flyLight.position.set(x, y, z)

		gsap.to(flyLight.rotation, {
			y: 2 * Math.PI,
			duration: 10 + Math.random() * 30,
			repeat: -1
		})

		gsap.to(flyLight.position, {
			x: "+=" + Math.random() * 5,
			y: "+=" + Math.random() * 20,
			yoyo: true,
			duration: 5 + Math.random() * 10,
			repeat: -1
		})
		scene.add(flyLight)
	}
})

// 加载场景
gltfLoader.load("./threejsDemo/firework/newyears_min.glb", gltf => {
	scene.add(gltf.scene)
	// 创建水面
	const waterGeometry = new THREE.PlaneGeometry(100, 100)
	let water = new Water(waterGeometry, {
		scale: 4,
		textureHeight: 1024,
		textureWidth: 1024
	})
	water.rotation.x = -Math.PI / 2
	water.position.y = 1
	scene.add(water)
})

// 管理烟花
let fireworks: Fireworks[] = []
// 设置创建烟花函数
let createFireworks = () => {
	let color = `hsl(${Math.random() * 360},100%,80%)`
	let position = {
		x: (Math.random() - 0.5) * 40,
		z: (Math.random() - 0.5) * 40,
		y: 7 + Math.random() * 15
	}
	// 随机生成颜色和烟花放的位置
	let firework = new Fireworks(color, position)
	firework.addScene(scene)
	fireworks.push(firework)
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

onUnmounted(() => {
	window.removeEventListener("click", createFireworks)
})

const init = () => {
	if (!webgl.value) {
		return
	}

	webgl.value.appendChild(renderer.domElement)
	window.addEventListener("click", createFireworks)
	renderScene()
}

const renderScene = () => {
	fireworks.forEach((item, i) => {
		const type = item.update()
		if (type === "remove") {
			fireworks.splice(i, 1)
		}
	})
	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}
</script>

<style lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}

.label {
	display: none;
	font-size: 0.2rem;
	color: #fff;
}

.visible {
	display: block;
}
</style>
