<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import * as dat from "dat.gui"
import gsap from "gsap"

const webgl = ref()
onMounted(() => {
	init()
})

let scene: THREE.Scene
let renderer: THREE.WebGLRenderer
let camera: THREE.PerspectiveCamera
let cube: THREE.Mesh
let gui: dat.GUI

const init = () => {
	if (!webgl.value) {
		return
	}

	// 创建场景
	scene = new THREE.Scene()
	// 创建相机
	camera = new THREE.PerspectiveCamera(75, webgl.value.offsetWidth / webgl.value.offsetHeight, 0.1, 1000)
	camera.position.z = 5

	// 创建渲染器
	renderer = new THREE.WebGLRenderer()
	renderer.setSize(webgl.value.offsetWidth, webgl.value.offsetHeight)

	// 创建几何体
	const geometry = new THREE.BoxGeometry(1, 1, 1)
	// 创建材质
	const material = new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffff00") })
	// 根据材质和几何体创建物体
	cube = new THREE.Mesh(geometry, material)
	// 添加物体
	scene.add(cube)

	gui = new dat.GUI({
		name: "gui",
		autoPlace: true,
		closed: true,
		hideable: true,
		closeOnTop: true
	})
	console.log(gui)

	gui
		.add(cube.position, "x")
		.min(0)
		.max(5)
		.step(0.01)
		.name("移动x轴")
		.onChange(value => {
			console.log("值被修改", value)
		})
		.onFinishChange(value => {
			console.log("完全停下来", value)
		})

	let params = {
		color: "#ffff00",
		fn: () => {
			// 让立方体运动起来
			gsap.to(cube.position, { x: 5, duration: 2, yoyo: true, repeat: -1 })
		}
	}
	// 添加颜色
	gui.addColor(params, "color").onChange(value => {
		;(cube.material as THREE.MeshBasicMaterial).color = new THREE.Color(value)
	})
	// 添加选项框
	gui.add(cube, "visible").name("是否显示")
	// 添加函数
	gui.add(params, "fn").name("立方体运动")
	// 添加文件夹
	let folder = gui.addFolder("设置立方体")
	folder.add(cube.material, "wireframe").name("设置线框")

	webgl.value.appendChild(renderer.domElement)
	renderScene()
}

const renderScene = () => {
	requestAnimationFrame(renderScene)
	renderer.render(scene, camera)
}

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
