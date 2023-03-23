<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import gsap from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import vertexShader from "./shader/vertex.glsl?raw"
import fragmentShader from "./shader/fragment.glsl?raw"

const webgl = ref()
onMounted(() => {
	init()
})

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-20, -10, -20)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.toneMappingExposure = 0.2
renderer.outputEncoding = THREE.sRGBEncoding
renderer.toneMapping = THREE.ACESFilmicToneMapping

const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true
controls.autoRotateSpeed = 0.5
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
	uniforms: {},
	side: THREE.DoubleSide
	// transparent: true
})

// 加载孔明灯
let lightBox: THREE.Mesh
const gltfLoader = new GLTFLoader()
gltfLoader.load("./model/glb/flyLight.glb", gltf => {
	lightBox = gltf.scene.children[0] as THREE.Mesh
	lightBox.material = shaderMaterial
	for (let i = 0; i < 150; i++) {
		let flyLight = gltf.scene.clone(true)
		let x = (Math.random() - 0.5) * 300
		let z = (Math.random() - 0.5) * 300
		let y = Math.random() * 60 + 25
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
</script>

<style lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}

.label {
	color: #fff;
	display: none;
	font-size: 0.2rem;
}

.visible {
	display: block;
}
</style>
