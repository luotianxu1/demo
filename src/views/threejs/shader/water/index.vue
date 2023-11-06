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

const params = {
	uWaresFrequency: 14,
	uScale: 0.03,
	uxzScale: 1.5,
	uNoiseFrequency: 10,
	uNoiseScale: 1.5,
	uTime: 0,
	uLowColor: "#ff0000",
	uHeighColor: "#ffff00",
	uXspeed: 1,
	uZspeed: 1,
	uNoiseSpeed: 1,
	uOpacity: 1
}

const shaderMaterial = new THREE.ShaderMaterial({
	vertexShader: vertexShader,
	fragmentShader: fragmentShader,
	side: THREE.DoubleSide,
	transparent: true,
	uniforms: {
		uWaresFrequency: {
			value: params.uWaresFrequency
		},
		uScale: {
			value: params.uScale
		},
		uNoiseFrequency: {
			value: params.uNoiseFrequency
		},
		uNoiseScale: {
			value: params.uNoiseScale
		},
		uxzScale: {
			value: params.uxzScale
		},
		uTime: {
			value: params.uTime
		},
		uLowColor: {
			value: new THREE.Color(params.uLowColor)
		},
		uHeighColor: {
			value: new THREE.Color(params.uHeighColor)
		},
		uXspeed: {
			value: params.uXspeed
		},
		uZspeed: {
			value: params.uZspeed
		},
		uNoiseSpeed: {
			value: params.uNoiseSpeed
		},
		uOpacity: {
			value: params.uOpacity
		}
	}
})

const init = () => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.camera.position.set(2, 2, 2)

	const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1024, 1024), shaderMaterial)
	plane.rotation.x = -Math.PI / 2
	web.scene.add(plane)

	addGui()

	renderScene()
}

const addGui = () => {
	const gui = web.addGUI()
	gui.add(params, "uWaresFrequency", 1, 100, 0.1).onChange(value => (shaderMaterial.uniforms.uWaresFrequency.value = value))
	gui.add(params, "uScale", 0, 0.2, 0.001).onChange(value => (shaderMaterial.uniforms.uScale.value = value))
	gui.add(params, "uNoiseFrequency", 0, 100, 1).onChange(value => (shaderMaterial.uniforms.uNoiseFrequency.value = value))
	gui.add(params, "uNoiseScale", 0, 5, 0.01).onChange(value => (shaderMaterial.uniforms.uNoiseScale.value = value))
	gui.add(params, "uxzScale", 0, 5, 0.1).onChange(value => (shaderMaterial.uniforms.uxzScale.value = value))
	gui.addColor(params, "uLowColor").onFinishChange(value => {
		shaderMaterial.uniforms.uLowColor.value = new THREE.Color(value)
	})
	gui.addColor(params, "uHeighColor").onFinishChange(value => {
		shaderMaterial.uniforms.uHeighColor.value = new THREE.Color(value)
	})
	gui.add(params, "uXspeed", 0, 5, 0.1).onChange(value => (shaderMaterial.uniforms.uXspeed.value = value))
	gui.add(params, "uZspeed", 0, 5, 0.1).onChange(value => (shaderMaterial.uniforms.uZspeed.value = value))
	gui.add(params, "uNoiseSpeed", 0, 5, 0.1).onChange(value => (shaderMaterial.uniforms.uNoiseSpeed.value = value))
	gui.add(params, "uOpacity", 0, 1, 0.01).onChange(value => (shaderMaterial.uniforms.uOpacity.value = value))
}

const renderScene = () => {
	shaderMaterial.uniforms.uTime.value = web.clock.getElapsedTime()
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
