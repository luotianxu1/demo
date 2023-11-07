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
import WebGl from "@utils/three/webGl"
import modifyCityMaterial from "../modify/modifyCityMaterial"
import FlyLineShader from "@utils/three/mesh/flyLineShader"
import MeshLine from "@utils/three/mesh/meshLine/meshLine"
import LightWall from "@utils/three/mesh/lightWall/lightWall"
import LightRadar from "@utils/three/mesh/lightRadar/lightRadar"
import FlyLineTexture from "@/utils/three/mesh/flyLineTexture/flyLineTexture"
import SpriteIcon from "@/utils/three/mesh/spriteIcon/spriteIcon"

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = function () {
	loading.value = false
}

let webgl = ref()
let web: WebGl
onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value, {
		render: { antialias: true, logarithmicDepthBuffer: false }
	})
	web.camera.position.set(15, 20, 25)
	web.setBgCube([
		"./textures/env/4/1.jpg",
		"./textures/env/4/2.jpg",
		"./textures/env/4/3.jpg",
		"./textures/env/4/4.jpg",
		"./textures/env/4/5.jpg",
		"./textures/env/4/6.jpg"
	])

	web.addGlb("./threejsDemo/smartCity/city.glb").then(gltf => {
		gltf.scene.traverse(item => {
			const mesh = item as THREE.Mesh
			if (mesh.type === "Mesh") {
				const cityMaterial = new THREE.MeshBasicMaterial({
					color: new THREE.Color(0x0c0e33)
				})
				mesh.material = cityMaterial
				modifyCityMaterial(mesh)
				if (mesh.name === "Layerbuildings") {
					const meshLine = new MeshLine(mesh)
					const size = mesh.scale.x * 1.001
					meshLine.mesh.scale.set(size, size, size)
					web.scene.add(meshLine.mesh)
				}
			}
		})
		web.scene.add(gltf.scene)

		// 添加飞线
		const flyLine = new FlyLineTexture({
			source: {
				x: 0,
				y: 0,
				z: 0
			},
			target: {
				x: 8,
				y: 0,
				z: 0
			},
			url: "./threejsDemo/smartCity/z_11.png",
			heignt: 4,
			radius: 0.4
		})
		web.scene.add(flyLine.mesh)

		// 添加着色器飞线
		const flyLineShader = new FlyLineShader()
		web.scene.add(flyLineShader.mesh)

		// 添加光墙
		const lightWall = new LightWall({ position: { x: 0, y: 0, z: 0 }, height: 5, radius: 1, maxRadius: 2, color: "#efad35" })
		web.scene.add(lightWall.mesh)

		// 添加雷达
		const lightRadar = new LightRadar({
			position: {
				x: 10,
				y: 0,
				z: 0
			},
			radius: 2
		})
		web.scene.add(lightRadar.mesh)

		// 添加警告标识
		const alarmSprite = new SpriteIcon({
			position: {
				x: -4.2,
				y: 3.5,
				z: -1
			},
			url: "./threejsDemo/smartCity/warning.png",
			scale: 1,
			max: 1.2,
			camera: web.camera
		})
		web.scene.add(alarmSprite.mesh)
		alarmSprite.onClick(function (e) {
			console.log("警告", e)
		})
	})

	render()
})

onUnmounted(() => {
	web.destroy()
})

const render = () => {
	web.update()
	requestAnimationFrame(render)
}
</script>

<style lang="scss" scoped>
.webgl {
	top: 0;
	left: 0;
	z-index: 100;
	display: flex;
	width: 100vw;
	height: 100vh;
}
</style>
@/utils/three/mesh/lightWall/lightWall @/utils/three/mesh/lightRadar/lightRadar
