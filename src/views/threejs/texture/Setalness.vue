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

let pointLight: THREE.PointLight

// 点
const sphereLight = new THREE.SphereGeometry(0.2)
const sphereLightMaterial = new THREE.MeshStandardMaterial({
	color: 0xff5808
})
const sphereLightMesh = new THREE.Mesh(sphereLight, sphereLightMaterial)

const init = () => {
	if (!webgl.value) {
		return
	}

	web = new WebGl(webgl.value)
	web.camera.position.set(0, 5, 40)
	web.addAmbientLight(0x888888)
	web.addSpotLight(-10, 30, 40, 0xffffff, 1, 0)
	pointLight = web.addPointLight(0, 0, 0, "#ff5808", 1)

	web.scene.add(sphereLightMesh)

	web.hdrLoader("./textures/hdr/050.hdr").then(texture => {
		texture.mapping = THREE.EquirectangularReflectionMapping
		texture.format = THREE.RGBAFormat
		web.scene.background = texture
		web.scene.environment = texture
	})

	const cubeMaterial = new THREE.MeshStandardMaterial({
		color: 0xffffff,
		metalness: 1,
		roughness: 0.5
	})

	const textureLoader = new THREE.TextureLoader()
	const cubeMaterialWithMetalMap = cubeMaterial.clone()
	cubeMaterialWithMetalMap.metalnessMap = textureLoader.load("./threejs/texture/roughness-map.jpg")
	const cubeMaterialWithRoughnessMap = cubeMaterial.clone()
	cubeMaterialWithRoughnessMap.roughnessMap = textureLoader.load("./threejs/texture/roughness-map.jpg")

	const sphere = new THREE.SphereGeometry(8, 50, 50)
	const cube1 = new THREE.Mesh(sphere, cubeMaterialWithMetalMap)
	cube1.castShadow = true
	cube1.position.x = -10
	cube1.rotation.y = (1 / 3) * Math.PI
	web.scene.add(cube1)

	const cube2 = new THREE.Mesh(sphere, cubeMaterialWithRoughnessMap)
	cube2.castShadow = true
	cube2.position.x = 10
	cube2.rotation.y = (-1 / 3) * Math.PI
	web.scene.add(cube2)

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
