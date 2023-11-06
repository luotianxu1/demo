<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import basicVertexShader from "./shader/vertex.glsl?raw"
import basicFragmentShader from "./shader/fragment.glsl?raw"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl

onMounted(() => {
	init()
})

// 加载纹理
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load("./threejs/shader/ca.jpeg")

// 创建着色器材质
const rowShaderMaterial = new THREE.RawShaderMaterial({
	vertexShader: basicVertexShader,
	fragmentShader: basicFragmentShader,
	side: THREE.DoubleSide,
	uniforms: {
		uTime: {
			value: 0
		},
		uTexture: {
			value: texture
		}
	}
})
const floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 64, 64), rowShaderMaterial)

const init = () => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.camera.position.set(0, 0, 10)

	web.scene.add(floor)

	renderScene()
}

const renderScene = () => {
	rowShaderMaterial.uniforms.uTime.value = web.clock.getElapsedTime()
	web.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	web.destroy()
})
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
