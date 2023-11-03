<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { TransformControls } from "three/addons/controls/TransformControls"

let webgl = ref<HTMLDivElement>()
let web: WebGl
let tControls
let basicScene

let meshList = [
	{
		name: "盆栽",
		path: "./threejsDemo/furnitureEditor/plants-min.glb",
		addMesh: function () {}
	},
	{
		name: "单人沙发",
		path: "./threejsDemo/furnitureEditor/sofa_chair_min.glb",
		addMesh: function () {}
	},
	{
		name: "单人沙发1",
		path: "./threejsDemo/furnitureEditor/sofa_lowpoly.glb",
		addMesh: function () {}
	},
	{
		name: "单人沙发2",
		path: "./threejsDemo/furnitureEditor/safa.glb",
		addMesh: function () {}
	}
]
let sceneMeshes = []
let meshesNum = {}
let eventObj = {
	addScene: function () {
		web.scene.add(basicScene)
	},
	setTranslate: function () {
		tControls.setMode("translate")
	},
	setRotate: function () {
		tControls.setMode("rotate")
	},
	setScale: function () {
		tControls.setMode("scale")
	},
	toggleSpace: function () {
		tControls.setSpace(tControls.space === "local" ? "world" : "local")
	},
	cancelMesh: function () {
		tControls.detach()
	},
	translateSnapNum: null,
	rotateSnapNum: 0,
	scaleSnapNum: 0,
	isClampGroup: false,
	isLight: true
}

onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.webGlRender.toneMapping = THREE.ReinhardToneMapping
	web.webGlRender.toneMappingExposure = 1
	web.camera.position.set(3, 3.5, 8)
	web.camera.lookAt(0, 1.2, 0)
	web.addAxesHelper()
	let gridHelper = web.addGridHelper()
	gridHelper.material.opacity = 0.3
	gridHelper.material.transparent = true

	web.addGltf("./threejsDemo/furnitureEditor/house-scene-min.glb").then(gltf => {
		basicScene = gltf.scene
	})

	web.hdrLoader("./textures/hdr/Alex_Hart-Nature_Lab_Bones_2k.hdr").then(envMap => {
		envMap.mapping = THREE.EquirectangularRefractionMapping
		web.scene.background = new THREE.Color(0xcccccc)
		web.scene.environment = envMap
	})

	tControls = new TransformControls(web.camera, web.webGlRender.domElement)
	tControls.addEventListener("dragging-changed", function (event) {
		web.orbitControls.enabled = !event.value
	})
	tControls.addEventListener("change", () => {
		if (eventObj.isClampGroup) {
			tControls.object.position.y = 0
		}
	})
	web.scene.add(tControls)

	web.addGUI()
	web.gui.add(eventObj, "addScene").name("添加户型基础模型")
	web.gui.add(eventObj, "setTranslate").name("位移模式")
	web.gui.add(eventObj, "setRotate").name("旋转模式")
	web.gui.add(eventObj, "setScale").name("缩放模式")
	web.gui.add(eventObj, "toggleSpace").name("切换空间模式")
	web.gui.add(eventObj, "cancelMesh").name("取消选择")
	web.gui
		.add(eventObj, "isLight")
		.name("是否开启灯光")
		.onChange(value => {
			if (value) {
				web.webGlRender.toneMappingExposure = 1
			} else {
				web.webGlRender.toneMappingExposure = 0.1
			}
		})

	let folderAddMehs = web.gui.addFolder("添加物体")
	let meshesFolder = web.gui.addFolder("家居列表")

	meshList.forEach(item => {
		item.addMesh = function () {
			web.addGltf(item.path).then(gltf => {
				sceneMeshes.push({
					...item,
					object3d: gltf.scene
				})
				let object3d = gltf.scene
				web.scene.add(object3d)
				tControlSelect(object3d)
				let meshOpt = {
					toggleMesh: function () {
						tControlSelect(object3d)
					}
				}
				meshesNum[item.name] = meshesNum[item.name] ? meshesNum[item.name] + 1 : 1
				meshesFolder.add(meshOpt, "toggleMesh").name(item.name + meshesNum[item.name])
			})
		}
		folderAddMehs.add(item, "addMesh").name(item.name)
	})

	let snapFolder = web.gui.addFolder("固定设置")
	snapFolder
		.add(eventObj, "translateSnapNum", {
			不固定: null,
			1: 1,
			0.1: 0.1,
			10: 10
		})
		.name("固定位移设置")
		.onChange(() => {
			tControls.setTranslationSnap(eventObj.translateSnapNum)
		})
	snapFolder
		.add(eventObj, "rotateSnapNum", 0, 1)
		.step(0.01)
		.name("旋转")
		.onChange(() => {
			tControls.setRotationSnap(eventObj.rotateSnapNum * Math.PI * 2)
		})
	snapFolder
		.add(eventObj, "scaleSnapNum", 0, 2)
		.step(0.1)
		.name("缩放")
		.onChange(() => {
			tControls.setScaleSnap(eventObj.scaleSnapNum)
		})
	snapFolder.add(eventObj, "isClampGroup").name("是否吸附到地面")

	render()
})

const tControlSelect = mesh => {
	tControls.attach(mesh)
}

onUnmounted(() => {
	web.destroy()
})

const render = () => {
	web.update()
	requestAnimationFrame(render)
}
</script>

<style lang="scss" scoped>
.webgl {
	top: 0;
	left: 0;
	z-index: 100;
	display: flex;
	width: 100vw;
	height: 100vh;
}
</style>
