<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl

onMounted(() => {
	init()
})

let directionalLight: THREE.DirectionalLight

let controlsData = reactive({
	radius: 20,
	mapSize: 2048,
	near: 0.5,
	far: 500,
	top: 5,
	bottom: -5,
	left: -5,
	right: 5
})

/**
 * 1、材质要满足能够对光照有反应
 * 2、设置渲染器开启阴影的计算 renderer.shadowMap.enabled = true
 * 3、设置光照投射阴影 directionalLight.castShadow = true
 * 4、设置物体投射阴影 sphere.castShadow = true
 * 5、设置物体接受阴影 plane.receiveShadow = true
 */

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const material = new THREE.MeshStandardMaterial()
const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.castShadow = true

const planeGeometry = new THREE.PlaneGeometry(10, 10)
const plane = new THREE.Mesh(planeGeometry, material)
plane.position.set(0, -1, 0)
plane.rotation.x = -Math.PI / 2
// 接受阴影
plane.receiveShadow = true

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(10, 10, -10)
	web.addAmbientLight(0xffffff, 0.5)
	directionalLight = web.addDirectionalLight(10, 10, 10, 0xffffff, 0.5)

	directionalLight.castShadow = true
	directionalLight.shadow.radius = controlsData.radius
	directionalLight.shadow.mapSize.set(4096, 4096)
	directionalLight.shadow.camera.near = controlsData.near
	directionalLight.shadow.camera.far = controlsData.far
	directionalLight.shadow.camera.top = controlsData.top
	directionalLight.shadow.camera.bottom = controlsData.bottom
	directionalLight.shadow.camera.right = controlsData.right
	directionalLight.shadow.camera.left = controlsData.left

	web.scene.add(sphere)
	web.scene.add(plane)

	addGui()
	renderScene()
}

const addGui = () => {
	const gui = web.addGUI()
	gui.add(controlsData, "radius", 0, 100)
	gui.add(controlsData, "near", 0, 10, 0.1)
	gui.add(controlsData, "far", 0, 1000)
	gui.add(controlsData, "top", -10, 10)
	gui.add(controlsData, "bottom", -10, 10)
	gui.add(controlsData, "left", -10, 10)
	gui.add(controlsData, "right", -10, 10)
}

watch(controlsData, val => {
	directionalLight.shadow.radius = val.radius
	directionalLight.shadow.camera.near = val.near
	directionalLight.shadow.camera.far = val.far
	directionalLight.shadow.camera.top = val.top
	directionalLight.shadow.camera.bottom = val.bottom
	directionalLight.shadow.camera.right = val.right
	directionalLight.shadow.camera.left = val.left

	directionalLight.shadow.camera.updateProjectionMatrix()
})

const renderScene = () => {
	requestAnimationFrame(renderScene)
	web.update()
}

onUnmounted(() => {
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
