<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let hemisphereLight: THREE.HemisphereLight
let controlsData = reactive({
	groundColor: 0x00ff00,
	skyColor: 0x0000ff,
	intensity: 1
})

onMounted(() => {
	init()
})

// 创建地面
const textureGrass = new THREE.TextureLoader().load("./threejs/light/grasslight-big.jpg")
textureGrass.wrapS = THREE.RepeatWrapping
textureGrass.wrapT = THREE.RepeatWrapping
textureGrass.repeat.set(10, 10)
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20)
const planeMaterial = new THREE.MeshLambertMaterial({
	map: textureGrass
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.receiveShadow = true
plane.rotation.x = -0.5 * Math.PI
plane.position.x = 15
plane.position.y = 0
plane.position.z = 0

// 创建球
const sphereGeometry = new THREE.SphereGeometry(4, 25, 25)
const sphereMaterial = new THREE.MeshPhongMaterial({
	color: 0x7777ff
})
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.x = 10
sphere.position.y = 5
sphere.position.z = 10
sphere.castShadow = true

// 创建立方体
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
const cubeMaterial = new THREE.MeshLambertMaterial({
	color: 0xff3333
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.castShadow = true
cube.position.x = -4
cube.position.y = 3
cube.position.z = 0

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(20, 20, 60)

	const spotLight = web.addSpotLight(-40, 60, -10, 0xcccccc)
	spotLight.lookAt(plane.position)
	web.addDirectionalLight(30, 10, -50, "#ffffff")
	hemisphereLight = web.addHemisphereLight(controlsData.skyColor, controlsData.groundColor, controlsData.intensity)

	web.scene.add(plane)
	web.scene.add(sphere)
	web.scene.add(cube)

	addGui()

	renderScene()
}

const addGui = () => {
	let gui = web.addGUI()
	gui.add(controlsData, "intensity", 0, 3, 0.01)
}

watch(controlsData, val => {
	hemisphereLight.intensity = val.intensity
})

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
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
