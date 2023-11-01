<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { addLargeGroundPlane } from "@utils/threejsShape"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let pointLight: THREE.PointLight

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

const cube2 = new THREE.Mesh(cube, cubeMaterialWithNormalMap)
cube2.castShadow = true
cube2.position.x = 17
cube2.rotation.y = (1 / 3) * Math.PI

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

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(0, 5, 40)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.shadowMap.enabled = true

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	const ambientLight = new THREE.AmbientLight(0x343434)
	scene.add(ambientLight)
	const light = new THREE.SpotLight(0xffffff, 1, 0)
	light.position.set(-10, 30, 40)
	light.castShadow = true
	scene.add(light)

	// 点光源
	pointLight = new THREE.PointLight("#ff5808", 1)
	pointLight.position.set(0, 0, 0)
	scene.add(pointLight)

	scene.add(sphereLightMesh)

	const groundPlane = addLargeGroundPlane(scene, true)
	groundPlane.position.y = -10

	scene.add(cube1)
	scene.add(cube2)

	webgl.value.appendChild(renderer.domElement)
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
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
