<template>
	<div id="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils"
import * as dat from "dat.gui"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

onMounted(() => {
	init()
})

let gui

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-30, 40, 30)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)

const form = reactive({
	numberOfObjects: 500,
	combined: false
})

const cubeMaterial = new THREE.MeshNormalMaterial({
	transparent: true,
	opacity: 0.5
})

const addcube = () => {
	let cubeSize = 1.0
	let cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
	let cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
	cube.castShadow = true
	cube.position.x = -60 + Math.round(Math.random() * 100)
	cube.position.y = Math.round(Math.random() * 10)
	cube.position.z = -150 + Math.round(Math.random() * 175)
	return cube
}

const generate = () => {
	scene.traverse(function (e) {
		if (e instanceof THREE.Mesh) {
			scene.remove(e)
		}
	})

	if (form.combined) {
		let geometryArray: any = []
		for (let i = 0; i < form.numberOfObjects; i++) {
			let cubeMesh = addcube()
			cubeMesh.updateMatrix()
			const newGeometry = cubeMesh.geometry.applyMatrix4(cubeMesh.matrix)
			geometryArray.push(newGeometry)
		}

		// 合并模型
		let merged = mergeBufferGeometries(geometryArray)
		let mergeMesh = new THREE.Mesh(merged, cubeMaterial)
		scene.add(mergeMesh)
	} else {
		for (let i = 0; i < form.numberOfObjects; i++) {
			let cubeMesh = addcube()
			scene.add(cubeMesh)
		}
	}
}

generate()

const init = () => {
	const body = document.getElementById("webgl")
	if (!body) {
		return
	}

	addGui()
	body.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	controls.update()
	renderer.render(scene, camera)
}

const addGui = () => {
	gui = new dat.GUI()
	gui.add(form, "numberOfObjects").min(0).max(30000).step(1).name("数量")
	gui.add(form, "combined")
}

watch(form, () => {
	generate()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
