<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
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
camera.position.set(0, 0, 10)

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)

const geometry = new THREE.BufferGeometry()
const positions = new Float32Array([0, 0, 0])
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("./threejs/shader/10.png")
const material = new THREE.ShaderMaterial({
	uniforms: {
		uTexture: {
			value: texture
		}
	},
	vertexShader: vertexShader,
	fragmentShader: fragmentShader,
	transparent: true
})

const points = new THREE.Points(geometry, material)
scene.add(points)

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
	display: none;
	font-size: 0.2rem;
	color: #fff;
}

.visible {
	display: block;
}
</style>
