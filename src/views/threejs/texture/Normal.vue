<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { addLargeGroundPlane } from "@utils/threejsShape"

const webgl = ref<HTMLDivElement>()
let web: WebGl
let pointLight: THREE.PointLight
let sphereLightMesh

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(0, 15, 60)

	web.addAmbientLight(0x343434)
	web.addSpotLight(-10, 30, 40, 0xffffff, 1, 0)
	pointLight = web.addPointLight(0, 0, 0, "#ff5808", 1)

	const textureLoader = new THREE.TextureLoader()
	const cubeMap = textureLoader.load("./textures/map/stone.jpg")
	const cubeMaterial = new THREE.MeshStandardMaterial({
		map: cubeMap,
		metalness: 0.2,
		roughness: 0.07
	})

	// 法向贴图
	const cubeMaterialWithNormalMap = cubeMaterial.clone()
	cubeMaterialWithNormalMap.normalMap = textureLoader.load("./threejs/texture/stone-bump.jpg")

	const cube = new THREE.BoxGeometry(16, 16, 16)

	const cube1 = new THREE.Mesh(cube, cubeMaterial)
	cube1.castShadow = true
	cube1.position.x = -17
	cube1.rotation.y = (1 / 3) * Math.PI
	web.scene.add(cube1)

	const cube2 = new THREE.Mesh(cube, cubeMaterialWithNormalMap)
	cube2.castShadow = true
	cube2.position.x = 17
	cube2.rotation.y = (1 / 3) * Math.PI
	web.scene.add(cube2)

	// 点
	const sphereLight = new THREE.SphereGeometry(0.2)
	const sphereLightMaterial = new THREE.MeshStandardMaterial({
		color: 0xff5808
	})
	sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)

	web.scene.add(sphereLightMesh)

	const groundPlane = addLargeGroundPlane(web.scene, true)
	groundPlane.position.y = -10

	renderScene()
}

let invert = 1
let phase = 0
const clock = new THREE.Clock()
const renderScene = () => {
	const time = clock.getDelta()
	if (phase > 2 * Math.PI) {
		invert = invert * -1
		phase -= 2 * Math.PI
	} else {
		phase += time
	}
	sphereLightMesh.position.z = Number(21 * Math.sin(phase))
	sphereLightMesh.position.x = -14 + 14 * Math.cos(phase)
	sphereLightMesh.position.y = 5
	if (invert < 0) {
		let pivot = 0
		sphereLightMesh.position.x = invert * (sphereLightMesh.position.x - pivot) + pivot
	}
	pointLight.position.copy(sphereLightMesh.position)

	web.update()
	requestAnimationFrame(renderScene)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
