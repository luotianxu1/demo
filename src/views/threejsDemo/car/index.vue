<template>
	<div
		ref="webgl"
		class="webgl"
		v-loading="loading"
		:element-loading-text="loadingText"
		element-loading-background="rgba(0, 0, 0, 1.0)"
	></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { gsap } from "gsap"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = function () {
	loading.value = false
}

// 车身材质
let bodyMaterial = new THREE.MeshPhysicalMaterial({
	color: "#6e2121",
	metalness: 1,
	roughness: 0.5,
	clearcoat: 1.0,
	clearcoatRoughness: 0.03
})
// 玻璃材质
let glassMaterial = new THREE.MeshPhysicalMaterial({
	color: "#793e3e",
	metalness: 0.25,
	roughness: 0,
	transmission: 1.0 //透光性.transmission属性可以让一些很薄的透明表面，例如玻璃，变得更真实一些。
})

let webgl = ref()
let web: WebGl
onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value, true, false, false, {
		render: { antialias: true, logarithmicDepthBuffer: true }
	})
	web.webGlRender.outputEncoding = THREE.sRGBEncoding
	web.webGlRender.toneMapping = THREE.ACESFilmicToneMapping
	web.activeCamera.position.set(4.25, 1.4, -4.5)

	if (web.controls && web.controls instanceof OrbitControls) {
		web.controls.maxDistance = 9
		web.controls.minDistance = 1
		web.controls.minPolarAngle = 0
		web.controls.maxPolarAngle = (80 / 360) * 2 * Math.PI
	}

	web.addAmbientLight("#fff", 0.5)
	initSpotLight()

	initFloor()
	initModel()
	initCylinder()
	initGui()

	render()
})

let doors: any = []
const initModel = () => {
	web.addGltf("./model/glb/car.glb").then(gltf => {
		const carModel = gltf.scene
		console.log(carModel)

		carModel.rotation.y = Math.PI
		carModel.traverse(obj => {
			if (obj.name === "Object_103" || obj.name === "Object_64" || obj.name === "Object_77") {
				// 车身
				;(obj as THREE.Mesh).material = bodyMaterial
			} else if (obj.name === "Object_90") {
				// 玻璃
				;(obj as THREE.Mesh).material = glassMaterial
			} else if (obj.name === "Empty001_16" || obj.name === "Empty002_20") {
				// 门
				doors.push(obj)
			}
			obj.castShadow = true
		})
		web.scene.add(carModel)
	})
}

const initFloor = () => {
	const floorGeometry = new THREE.PlaneGeometry(20, 20)
	const material = new THREE.MeshPhysicalMaterial({
		side: THREE.DoubleSide,
		color: 0x808080,
		metalness: 0,
		roughness: 0.1
	})

	const floorMesh = new THREE.Mesh(floorGeometry, material)
	floorMesh.rotation.x = Math.PI / 2
	floorMesh.receiveShadow = true
	web.scene.add(floorMesh)
}

const initSpotLight = () => {
	// 添加头顶聚光灯
	const bigSpotLight = web.addSpotLight(-5, 10, 1, "#fff", 0.5, true)

	bigSpotLight.angle = Math.PI / 8 //散射角度，跟水平线的家教
	bigSpotLight.penumbra = 0.2 // 聚光锥的半影衰减百分比
	bigSpotLight.decay = 2 // 纵向：沿着光照距离的衰减量。
	bigSpotLight.distance = 30
	bigSpotLight.shadow.radius = 10
	// 阴影映射宽度，阴影映射高度
	bigSpotLight.shadow.mapSize.set(4096, 4096)

	bigSpotLight.position.set(-5, 10, 1)
	// 光照射的方向
	bigSpotLight.target.position.set(0, 0, 0)
	web.scene.add(bigSpotLight)
}

const initCylinder = () => {
	const geometry = new THREE.CylinderGeometry(10, 10, 20, 20)
	const material = new THREE.MeshPhysicalMaterial({
		color: 0x6c6c6c,
		side: THREE.DoubleSide
	})

	const cylinder = new THREE.Mesh(geometry, material)
	web.scene.add(cylinder)
}

const initGui = () => {
	web.addGUI()
	let obj = {
		bodyColor: "#6e2121",
		glassColor: "#aaaaaa",
		carOpen,
		carClose,
		carIn,
		carOut
	}

	if (!web.gui) {
		return
	}
	web.gui
		.addColor(obj, "bodyColor")
		.name("车身颜色")
		.onChange((value: THREE.ColorRepresentation) => {
			bodyMaterial.color.set(value)
		})

	web.gui
		.addColor(obj, "glassColor")
		.name("玻璃颜色")
		.onChange(value => {
			glassMaterial.color.set(value)
		})

	web.gui.add(obj, "carOpen").name("打开车门")
	web.gui.add(obj, "carClose").name("关门车门")

	web.gui.add(obj, "carIn").name("车内视角")
	web.gui.add(obj, "carOut").name("车外视角")
}

const carOpen = () => {
	for (let i = 0; i < doors.length; i++) {
		gsap.to(doors[i].rotation, {
			x: Math.PI / 3,
			duration: 1,
			ease: "none"
		})
	}
}
const carClose = () => {
	for (let i = 0; i < doors.length; i++) {
		gsap.to(doors[i].rotation, {
			x: 0,
			duration: 1,
			ease: "none"
		})
	}
}
const carIn = () => {
	gsap.to(web.activeCamera.position, {
		x: -0.27,
		z: 0.83,
		y: 0.6,
		duration: 1,
		ease: "none",
		onUpdate() {
			console.log(web.activeCamera.position.x)
		}
	})
}
const carOut = () => {}

onUnmounted(() => {
	web.remove()
})

const render = () => {
	web.update()
	requestAnimationFrame(render)
}
</script>

<style lang="scss">
.webgl {
	width: 100vw;
	height: 100vh;
	display: flex;
	left: 0;
	top: 0;
	z-index: 100;
}
</style>
