<template>
	<div class="home">
		<div ref="webgl" class="canvas-container"></div>
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
import WebGl from "@utils/three/webGl"
import { gsap } from "gsap"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let pages = ref()
let glb1: THREE.Object3D | THREE.Group
let glb2: THREE.Object3D | THREE.Group
let glb3: THREE.Object3D | THREE.Group
let moon: THREE.Mesh
let moonGroup: THREE.Object3D | THREE.Group

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value, {
		controls: {
			type: false
		},
		loading: {
			show: true,
			html: true
		}
	})
	web.webGlRender.outputColorSpace = THREE.SRGBColorSpace
	web.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
	web.camera.position.set(0, 0, 10)
	web.camera.lookAt(0, 0, 0)
	web.addDirectionalLight(0, 0, 1, 0xffffff, 1)
	web.addDirectionalLight(0, 0, -1, 0xffffff, 0.5)
	web.addAmbientLight(0xffffff, 0.5)

	web.addGltf("./threejsDemo/website/xz.glb").then(glb => {
		glb1 = glb.scene
		glb1.scale.set(0.1, 0.1, 0.1)
		glb1.position.set(3, 0, 0)
		web.scene.add(glb1)
	})
	web.addGltf("./threejsDemo/website/xq6.glb").then(glb => {
		glb2 = glb.scene
		glb2.scale.set(0.06, 0.06, 0.06)
		glb2.position.set(3, -8, 0)
		web.scene.add(glb2)
	})
	web.addGltf("./threejsDemo/website/gr75.glb").then(glb => {
		glb3 = glb.scene
		glb3.scale.set(0.8, 0.8, 0.8)
		glb3.position.set(3, -16, 0)
		web.scene.add(glb3)
	})
	web.addGltf("./threejsDemo/website/moon.glb").then(glb => {
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
			web.scene.add(moonGroup)
			gsap.to(moonGroup.position, {
				duration: Math.random() * 10 + 2,
				z: -1000,
				ease: "linear",
				repeat: -1
			})
		}
	})

	window.addEventListener("mousemove", e => mouseMove(e))
	window.addEventListener("mousewheel", (e: any) => mousewheel(e))

	renderScene()
}

// 监听鼠标移动，改变模型位置
const mouseMove = (e: { clientX: number; clientY: number }) => {
	if (!glb1 || !glb2 || !glb3) return
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
		timeline2.to(web.camera.position, {
			duration: 0.5,
			y: page * -8
		})
		gsap.to(pages.value, {
			duration: 1,
			y: -page * window.innerHeight
		})
	}
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	web.update()
}

onUnmounted(() => {
	web.destroy()
	window.removeEventListener("mousemove", mouseMove)
	window.removeEventListener("mousewheel", mousewheel)
})
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
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	flex-direction: column;
}

.pages .page {
	display: flex;
	width: 100vw;
	height: 100vh;
	padding: 15%;
	color: #fff;
	box-sizing: border-box;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}

.pages .page .title {
	margin-bottom: 20px;
	font-size: 50px;
	font-weight: 900;
}

.pages .page p {
	font-size: 25px;
}

::-webkit-scrollbar {
	display: none;
}
</style>
