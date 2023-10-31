<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { ElMessage } from "element-plus"

const webgl = ref()
let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let loading = ref(true)
let duck: GLTF
let duckBox
let boxHelper

let event = {
	onLoad: () => {
		init()
		loading.value = false
	},
	onProgress: (url: any, num: number, total: number) => {
		console.log(Number((num / total).toFixed(2)) * 100 + "%")
	},
	onError: (e: any) => {
		console.log(e)
		ElMessage.error("加载出现错误")
	}
}
const loadingManager = new THREE.LoadingManager(event.onLoad, event.onProgress, event.onError)
const gltfLoader = new GLTFLoader(loadingManager)
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath("./draco/gltf/")
dracoLoader.setDecoderConfig({ type: "js" })
dracoLoader.preload()
gltfLoader.setDRACOLoader(dracoLoader)

gltfLoader.load("./model/glb/Duck.glb", glb => {
	duck = glb
	let duckMesh = glb.scene.getObjectByName("LOD3spShape") as THREE.Mesh
	let duckGeometry = duckMesh.geometry
	// 计算包围盒
	duckGeometry.computeBoundingBox()
	// 设置几何体居中
	duckGeometry.center()
	duckBox = duckGeometry.boundingBox
	// 更新世界矩阵
	duckMesh.updateWorldMatrix(true, true)
	// 更新包围盒
	duckBox.applyMatrix4(duckMesh.matrixWorld)
	let center = duckBox.getCenter(new THREE.Vector3())
	console.log(center)

	console.log(duckMesh)
	console.log(duckBox)
})

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xe0e0e0)
	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.set(3, 1, 3)
	camera.lookAt(0, 0, 0)
	// 创建渲染器
	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)
	renderer.outputColorSpace = THREE.SRGBColorSpace
	renderer.shadowMap.enabled = true
	// 灯光
	const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
	hemiLight.position.set(0, 20, 0)
	scene.add(hemiLight)

	// 创建轨道控制器
	controls = new OrbitControls(camera, renderer.domElement)

	boxHelper = new THREE.Box3Helper(duckBox, new THREE.Color(0xffff00))
	scene.add(boxHelper)

	scene.add(duck.scene)

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
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
