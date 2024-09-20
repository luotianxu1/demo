<template>
	<div id="container" class="css3d-container"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import { CSS3DRenderer, CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
import * as TWEEN from "three/examples/jsm/libs/tween.module.js"

const table = [
	["H", "Hydrogen", "1.00794", 1, 1],
	["He", "Helium", "4.002602", 18, 1],
	["Li", "Lithium", "6.941", 1, 2],
	["Be", "Beryllium", "9.012182", 2, 2],
	["B", "Boron", "10.811", 13, 2],
	["C", "Carbon", "12.0107", 14, 2],
	["N", "Nitrogen", "14.0067", 15, 2],
	["O", "Oxygen", "15.9994", 16, 2],
	["F", "Fluorine", "18.9984032", 17, 2],
	["Ne", "Neon", "20.1797", 18, 2]
]

let scene, camera, renderer, controls
const objects = []
const targets = { circle: [] }

onMounted(() => {
	init()
	animation()
})

const init = () => {
	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000)
	camera.position.z = 3000

	scene = new THREE.Scene()

	for (let i = 0; i < table.length; i += 1) {
		const element = document.createElement("div")
		element.className = "element"
		element.style.backgroundColor = "rgba(0,127,127," + (Math.random() * 0.5 + 0.25) + ")"

		const number = document.createElement("div")
		number.className = "number"
		number.textContent = (i + 1).toString()
		element.appendChild(number)

		const symbol = document.createElement("div")
		symbol.className = "symbol"
		symbol.textContent = table[i][0].toString()
		element.appendChild(symbol)

		const details = document.createElement("div")
		details.className = "details"
		details.innerHTML = table[i][1] + "<br>" + table[i][2]
		element.appendChild(details)

		const objectCSS = new CSS3DObject(element)
		objectCSS.position.x = Math.random() * 4000 - 2000
		objectCSS.position.y = Math.random() * 4000 - 2000
		objectCSS.position.z = Math.random() * 4000 - 2000
		scene.add(objectCSS)

		objects.push(objectCSS)
	}

	const radius = 400 // 设置圆形布局的半径
	const vector = new THREE.Vector3(20, 20, 20)

	for (let i = 0, l = objects.length; i < l; i++) {
		const phi = (i / l) * 2 * Math.PI // 分配每个对象在圆上的角度

		const object = new THREE.Object3D()
		object.position.x = radius * Math.cos(phi)
		object.position.y = 0
		object.position.z = radius * Math.sin(phi)

		// 设置对象朝向圆心
		vector.x = object.position.x
		vector.y = object.position.y
		vector.z = object.position.z
		object.lookAt(vector)

		targets.circle.push(object)
	}

	transform(targets.circle, 0)
	camera.position.z = 1100

	renderer = new CSS3DRenderer()
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.getElementById("container").appendChild(renderer.domElement)

	controls = new TrackballControls(camera, renderer.domElement)
	controls.minDistance = 500
	controls.maxDistance = 6000
	controls.noPan = true
	controls.addEventListener("change", render)

	window.addEventListener("resize", onWindowResize, false)

	render()
}

const animation = () => {
	scene.rotation.y += 0.001 // 旋转速度
	objects.forEach(object => {
		object.lookAt(camera.position) //卡片取消翻转
	})
	TWEEN.update()
	controls.update()
	render()
	requestAnimationFrame(animation)
}

const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
	renderer.setSize(window.innerWidth, window.innerHeight)
	render()
}

const render = () => {
	renderer.render(scene, camera)
}

const transform = (targets, duration) => {
	TWEEN.removeAll()

	for (let i = 0; i < objects.length; i++) {
		const object = objects[i]
		const target = targets[i]

		new TWEEN.Tween(object.position)
			.to({ x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start()

		new TWEEN.Tween(object.rotation)
			.to({ x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration)
			.easing(TWEEN.Easing.Exponential.InOut)
			.start()
	}

	new TWEEN.Tween(this)
		.to({}, duration * 2)
		.onUpdate(render)
		.start()
}
</script>

<style lang="scss" scoped>
#container {
	height: 100vh;
	margin: 0;
	overflow: hidden;
	font-family: Helvetica, sans-serif;
	background-color: #000;
}

a {
	color: #8ff;
}

#menu {
	position: absolute;
	bottom: 20px;
	z-index: 999;
	width: 100%;
	text-align: center;
}
</style>
