<template>
	<div class="main">
		<div class="item">
			<span>GPU draw calls {{ calls }}</span>
			<span>GPU memory: {{ memory }}</span>
		</div>
		<div ref="webgl" class="webgl"></div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import * as dat from "dat.gui"
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils"

let gui: dat.GUI
let camera: THREE.PerspectiveCamera
let controls: OrbitControls
let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let material: THREE.MeshNormalMaterial

const calls = ref(0)
const memory = ref("")

const Method = {
	INSTANCED: "INSTANCED",
	MERGED: "MERGED",
	NAIVE: "NAIVE"
}

const api = {
	method: Method.INSTANCED,
	count: 1000
}

const webgl = ref()
onMounted(() => {
	init()
	initMesh()
})

onUnmounted(() => {
	gui.destroy()
})

const init = () => {
	if (!webgl.value) {
		return
	}
	const width = webgl.value.offsetWidth
	const height = webgl.value.offsetHeight

	camera = new THREE.PerspectiveCamera(70, width / height, 1, 100)
	camera.position.z = 30

	renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(width, height)
	renderer.outputEncoding = THREE.sRGBEncoding

	webgl.value.appendChild(renderer.domElement)

	scene = new THREE.Scene()
	scene.background = new THREE.Color(0xffffff)

	controls = new OrbitControls(camera, renderer.domElement)
	controls.autoRotate = true

	gui = new dat.GUI()
	gui.add(api, "method", Method).onChange(initMesh)
	gui.add(api, "count", 1, 10000).step(1).onChange(initMesh)

	renderScene()
}

const renderScene = () => {
	controls.update()
	renderer.render(scene, camera)
	requestAnimationFrame(renderScene)
}

function clean() {
	const meshes: any[] = []
	scene.traverse(function (object) {
		if (object instanceof THREE.Mesh) meshes.push(object)
	})
	for (let i = 0; i < meshes.length; i++) {
		const mesh = meshes[i]
		mesh.material.dispose()
		mesh.geometry.dispose()
		scene.remove(mesh)
	}
}

function initMesh() {
	clean()
	new THREE.BufferGeometryLoader().setPath("threejs/other/").load("suzanne_buffergeometry.json", function (geometry) {
		material = new THREE.MeshNormalMaterial()
		geometry.computeVertexNormals()
		switch (api.method) {
			case Method.INSTANCED:
				makeInstanced(geometry)
				break
			case Method.MERGED:
				makeMerged(geometry)
				break
			case Method.NAIVE:
				makeNaive(geometry)
				break
		}
	})
}

function makeNaive(geometry: THREE.BufferGeometry) {
	const matrix = new THREE.Matrix4()
	for (let i = 0; i < api.count; i++) {
		randomizeMatrix(matrix)
		const mesh = new THREE.Mesh(geometry, material)
		mesh.applyMatrix4(matrix)
		scene.add(mesh)
	}
	const geometryByteLength = getGeometryByteLength(geometry)
	calls.value = api.count
	memory.value = formatBytes(api.count * 16 + geometryByteLength, 2)
}

function makeInstanced(geometry: THREE.BufferGeometry) {
	const matrix = new THREE.Matrix4()
	const mesh = new THREE.InstancedMesh(geometry, material, api.count)
	for (let i = 0; i < api.count; i++) {
		randomizeMatrix(matrix)
		mesh.setMatrixAt(i, matrix)
	}
	scene.add(mesh)
	const geometryByteLength = getGeometryByteLength(geometry)
	calls.value = 1
	memory.value = formatBytes(api.count * 16 + geometryByteLength, 2)
}

function makeMerged(geometry: THREE.BufferGeometry) {
	const geometries = []
	const matrix = new THREE.Matrix4()
	for (let i = 0; i < api.count; i++) {
		randomizeMatrix(matrix)
		const instanceGeometry = geometry.clone()
		instanceGeometry.applyMatrix4(matrix)
		geometries.push(instanceGeometry)
	}
	const mergedGeometry = mergeBufferGeometries(geometries)
	scene.add(new THREE.Mesh(mergedGeometry, material))
	calls.value = 1
	memory.value = formatBytes(getGeometryByteLength(mergedGeometry), 2)
}

const randomizeMatrix = (function () {
	const position = new THREE.Vector3()
	const rotation = new THREE.Euler()
	const quaternion = new THREE.Quaternion()
	const scale = new THREE.Vector3()
	return function (matrix: { compose: (arg0: THREE.Vector3, arg1: THREE.Quaternion, arg2: THREE.Vector3) => void }) {
		position.x = Math.random() * 40 - 20
		position.y = Math.random() * 40 - 20
		position.z = Math.random() * 40 - 20
		rotation.x = Math.random() * 2 * Math.PI
		rotation.y = Math.random() * 2 * Math.PI
		rotation.z = Math.random() * 2 * Math.PI
		quaternion.setFromEuler(rotation)
		scale.x = scale.y = scale.z = Math.random() * 1
		matrix.compose(position, quaternion, scale)
	}
})()

function getGeometryByteLength(geometry: THREE.InstancedBufferGeometry | THREE.BufferGeometry) {
	let total = 0
	if (geometry.index) total += (geometry.index.array as any).byteLength
	for (const name in geometry.attributes) {
		total += (geometry.attributes[name] as any).array.byteLength
	}
	return total
}

function formatBytes(bytes: number, decimals: number) {
	if (bytes === 0) return "0 bytes"
	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ["bytes", "KB", "MB"]
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
}
</script>

<style lang="scss">
.main {
	width: 100%;
	height: 100%;

	.item {
		width: 100%;
		height: 50px;
		text-align: center;

		span {
			margin-left: 10px;
		}
	}

	.webgl {
		width: 100%;
		height: calc(100% - 50px);
	}
}
</style>
