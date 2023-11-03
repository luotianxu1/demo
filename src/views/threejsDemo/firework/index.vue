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
import vertexShader from "./shader/light/vertex.glsl?raw"
import fragmentShader from "./shader/light/fragment.glsl?raw"
import Fireworks from "./fireworks"
import { Water } from "three/examples/jsm/objects/Water2"
import WebGl from "@utils/three/webGl"
import gsap from "gsap"

const webgl = ref<HTMLDivElement>()
let web: WebGl

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = () => {
	loading.value = false
}

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
	firework.addScene(web.scene)
	fireworks.push(firework)
}

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(-40, 20, -40)
	web.webGlRender.toneMappingExposure = 0.2
	web.webGlRender.outputColorSpace = THREE.SRGBColorSpace
	web.webGlRender.toneMapping = THREE.ACESFilmicToneMapping

	web.setBgHdr("./textures/hdr/2k.hdr")

	const shaderMaterial = new THREE.ShaderMaterial({
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		side: THREE.DoubleSide
	})

	// 加载孔明灯
	web.addGlb("./threejsDemo/firework/flyLight.glb").then(glb => {
		const lightBox = glb.scene.children[0] as THREE.Mesh
		lightBox.material = shaderMaterial
		for (let i = 0; i < 150; i++) {
			let flyLight = glb.scene.clone(true)
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
			web.scene.add(flyLight)
		}
	})

	// 加载场景
	web.addGlb("./threejsDemo/firework/newyears_min.glb").then(glb => {
		web.scene.add(glb.scene)
		// 创建水面
		const waterGeometry = new THREE.PlaneGeometry(100, 100)
		let water = new Water(waterGeometry, {
			scale: 4,
			textureHeight: 1024,
			textureWidth: 1024
		})
		water.rotation.x = -Math.PI / 2
		water.position.y = 1
		web.scene.add(water)
	})

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
	web.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	window.removeEventListener("click", createFireworks)
})
</script>

<style lang="scss" scoped>
.webgl {
	width: 100%;
	height: 100%;
}
</style>
