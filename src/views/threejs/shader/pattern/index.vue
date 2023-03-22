<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import basicVertexShader from "./shader/vertex.glsl?raw"
import basicFragmentShader from "./shader/fragment.glsl?raw"

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

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// 创建着色器材质
const rowShaderMaterial = new THREE.RawShaderMaterial({
	vertexShader: basicVertexShader,
	fragmentShader: basicFragmentShader,
	side: THREE.DoubleSide
	// wireframe: true
})
const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), rowShaderMaterial)
scene.add(floor)

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
