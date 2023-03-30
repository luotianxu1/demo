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
import FlyLine from "@utils/three/mesh/flyLine"
import FlyLineShader from "@utils/three/mesh/flyLineShader"
import MeshLine from "@utils/three/mesh/meshLine"
import LightWall from "@utils/three/mesh/lightWall"
import LightRadar from "@utils/three/mesh/lightRadar"
import AlarmSprite from "@utils/three/mesh/AlarmSprite"

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
	web = new WebGl(webgl.value)
	web.activeCamera.position.set(15, 20, 25)
	web.setBgCube([
		"./textures/env/4/1.jpg",
		"./textures/env/4/2.jpg",
		"./textures/env/4/3.jpg",
		"./textures/env/4/4.jpg",
		"./textures/env/4/5.jpg",
		"./textures/env/4/6.jpg"
	])

	web.addGlb("./model/glb/city.glb").then(gltf => {
		gltf.scene.traverse(item => {
			const mesh = item as THREE.Mesh
			if (mesh.type === "Mesh") {
				const cityMaterial = new THREE.MeshBasicMaterial({
					color: new THREE.Color(0x0c0e33)
				})
				mesh.material = cityMaterial
				modifyCityMaterial(mesh)
				if (mesh.name === "Layerbuildings") {
					const meshLine = new MeshLine(mesh.geometry)
					const size = mesh.scale.x * 1.001
					meshLine.mesh.scale.set(size, size, size)
					web.scene.add(meshLine.mesh)
				}
			}
		})
		web.scene.add(gltf.scene)

		// 添加飞线
		const flyLine = new FlyLine()
		web.scene.add(flyLine.mesh)

		// 添加着色器飞线
		const flyLineShader = new FlyLineShader()
		web.scene.add(flyLineShader.mesh)

		// 添加光墙
		const lineWall = new LightWall()
		web.scene.add(lineWall.mesh)

		// 添加雷达
		const lightRadar = new LightRadar()
		web.scene.add(lightRadar.mesh)

		// 添加警告标识
		const alarmSprite = new AlarmSprite(web.activeCamera)
		web.scene.add(alarmSprite.mesh)
		alarmSprite.onClick(function (e) {
			console.log("警告", e)
		})
	})

	render()
})

onUnmounted(() => {
	web.remove()
})

const render = () => {
	web.update()
	requestAnimationFrame(render)
}
</script>

<style lang="scss">
.webgl {
	width: 100vw;
	height: 100vh;
	display: flex;
	left: 0;
	top: 0;
	z-index: 100;
}
</style>
