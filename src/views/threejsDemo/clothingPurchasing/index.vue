<template>
	<div class="home" v-loading="loading" :element-loading-text="loadingText" element-loading-background="rgba(0, 0, 0, 1.0)">
		<div ref="webgl" class="webgl"></div>
		<div class="pannel">
			<h1>服装3D</h1>
			<h2>T恤选择</h2>
			<div class="select-box">
				<div class="select-item" v-for="(item, index) in data.shirtList" @click="chooseTexture('shirt', index)" :key="index">
					<img :src="item.value" :alt="item.name" />
				</div>
			</div>
			<h2>短裤选择</h2>
			<div class="select-box">
				<div class="select-item" v-for="(item, index) in data.shortsList" @click="chooseTexture('shorts', index)" :key="index">
					<img :src="item.value" :alt="item.name" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import WebGl from "@utils/three/webGl"
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js"

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = function () {
	loading.value = false
}

// 纹理
let textureArr: THREE.Texture[] = []
let shirtTexture0: THREE.Texture
let shirtTexture1: THREE.Texture
let shirtTexture2: THREE.Texture

let data = reactive({
	shirtList: [
		{
			name: "蓝色",
			value: "./textures/map/shirt01.png"
		},
		{
			name: "深蓝色",
			value: "./textures/map/shirt02.png"
		},
		{
			name: "紫色",
			value: "./textures/map/shirt03.png"
		}
	],
	shortsList: [
		{
			name: "蓝色",
			value: "./textures/map/shorts01.png"
		},
		{
			name: "深蓝色",
			value: "./textures/map/shorts02.png"
		},
		{
			name: "紫色",
			value: "./textures/map/shorts03.png"
		}
	]
})

let webgl = ref()
let web: WebGl
let shorts: THREE.Mesh
let shirt: THREE.Mesh
onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.activeCamera.position.set(0, 0, 2)
	web.addDirectionalLight(0, 0, -10, 0xffffff)

	const pmremGenerator = new THREE.PMREMGenerator(web.webGlRender)
	web.scene.background = new THREE.Color(0xeeeeee)
	web.scene.environment = pmremGenerator.fromScene(new RoomEnvironment()).texture
	web.scene.fog = new THREE.Fog(0xeeeeee, 10, 50)

	web.loaderMap("./textures/map/0.jpg").then(map => {
		shirtTexture0 = map
		shirtTexture0.flipY = false
		textureArr.push(shirtTexture0)
	})
	web.loaderMap("./textures/map/1.jpg").then(map => {
		shirtTexture1 = map
		shirtTexture1.flipY = false
		textureArr.push(shirtTexture1)
	})
	web.loaderMap("./textures/map/2.jpg").then(map => {
		shirtTexture2 = map
		shirtTexture2.flipY = false
		textureArr.push(shirtTexture2)
	})

	web.addGltf("./model/glb/shorts-min01.glb").then(gltf => {
		shorts = gltf.scene.children[0] as THREE.Mesh
		;(shorts.material as THREE.MeshBasicMaterial).map = textureArr[0]
		web.scene.add(shorts)
	})

	web.addGltf("./model/glb/shirt-min01.glb").then(gltf => {
		shirt = gltf.scene.children[0] as THREE.Mesh
		shirt.position.set(0, 0.3, 0)
		;(shirt.material as THREE.MeshBasicMaterial).map = textureArr[0]
		web.scene.add(shirt)
	})

	render()
})

const chooseTexture = (type: string, index: number) => {
	if (type === "shirt") {
		;(shirt.material as THREE.MeshBasicMaterial).map = textureArr[index]
	} else if (type === "shorts") {
		;(shorts.material as THREE.MeshBasicMaterial).map = textureArr[index]
	}
}

onUnmounted(() => {
	web.remove()
})

const render = () => {
	web.update()
	requestAnimationFrame(render)
}
</script>

<style lang="scss" scoped>
.home {
	width: 100vw;
	height: 100vh;
	transform-origin: 0 0;
	background-color: #1e1a20;
}
.webgl {
	width: 100%;
	height: 100%;
	display: flex;
	left: 0;
	top: 0;
	z-index: 100;
}

.pannel {
	position: absolute;
	top: 0;
	right: 0;
	width: 400px;
	height: 800px;
	display: flex;
	justify-content: center;
	align-items: flex-start;
	z-index: 100;
	flex-direction: column;
	padding: 0 20px;
}
.pannel h2 {
	margin: 20px 0 10px;
}
.select-box {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.select-item {
	width: 100px;
	height: 100px;
	border-radius: 10px;
	overflow: hidden;
}
.select-item img {
	width: 100%;
	height: 100%;
	border-radius: 10px;
}
.select-item.btns {
	width: 100px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	border-radius: 10px;
	border: 1px solid #ccc;
	background-color: rgba(255, 255, 255, 0.9);
}
</style>
