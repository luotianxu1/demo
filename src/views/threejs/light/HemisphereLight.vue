<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let gui: dat.GUI
let plane: THREE.Mesh
let sphere: THREE.Mesh
let cube: THREE.Mesh
let spotLight: THREE.SpotLight
let directionalLight: THREE.DirectionalLight
let hemisphereLight: THREE.HemisphereLight

// 创建地面
const textureGrass = new THREE.TextureLoader().load("./textures/map/grasslight-big.jpg")
textureGrass.wrapS = THREE.RepeatWrapping
textureGrass.wrapT = THREE.RepeatWrapping
textureGrass.repeat.set(10, 10)
const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 20, 20)
const planeMaterial = new THREE.MeshLambertMaterial({
	map: textureGrass
})
plane = new THREE.Mesh(planeGeometry, planeMaterial)
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
sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
sphere.position.x = 10
sphere.position.y = 5
sphere.position.z = 10
sphere.castShadow = true

// 创建立方体
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
const cubeMaterial = new THREE.MeshLambertMaterial({
	color: 0xff3333
})
cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.castShadow = true
cube.position.x = -4
cube.position.y = 3
cube.position.z = 0

let controlsData = reactive({
	groundColor: 0x00ff00,
	skyColor: 0x0000ff,
	intensity: 1
})

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()

	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(20, 20, 60)

	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	spotLight = new THREE.SpotLight(0xcccccc)
	spotLight.position.set(-40, 60, -10)
	spotLight.lookAt(plane.position)
	scene.add(spotLight)

	directionalLight = new THREE.DirectionalLight("#ffffff")
	directionalLight.position.set(30, 10, -50)
	scene.add(directionalLight)

	hemisphereLight = new THREE.HemisphereLight(controlsData.skyColor, controlsData.groundColor, controlsData.intensity)
	scene.add(hemisphereLight)

	scene.add(plane)
	scene.add(sphere)
	scene.add(cube)

	addGui()
	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.add(controlsData, "intensity", 0, 3, 0.01)
}

watch(controlsData, val => {
	hemisphereLight.intensity = val.intensity
})

onUnmounted(() => {
	gui.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
