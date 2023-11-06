<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import vertexShader from "./shader/vertex.glsl?raw"
import fragmentShader from "./shader/fragment.glsl?raw"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.camera.position.set(0, 0, 10)

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
	web.scene.add(points)

	renderScene()
}

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
}
</script>

<style lang="scss" scoped>
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
