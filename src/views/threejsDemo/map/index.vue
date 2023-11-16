<template>
	<div><el-button @click="back" :disabled="activeLevel === 'level1' || !activeLevel">返回</el-button></div>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import Map from "./model/map"

type TMapLevel = "level1" | "level2" | "level3" | null

const webgl = ref<HTMLDivElement>()
let web: Map
const mapLevel = reactive({
	level1: 100000,
	level2: "",
	level3: ""
})
let activeLevel = ref<TMapLevel>()

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}
	web = new Map(webgl.value, {
		render: {
			antialias: true,
			logarithmicDepthBuffer: true
		},
		css2DRender: true,
		loading: {
			show: true,
			html: false,
			callback: () => {
				nextMap(mapLevel.level1)
			}
		}
	})

	web.domElement.addEventListener("click", click)

	renderScene()
}

const click = event => {
	const mouse = new THREE.Vector2()
	mouse.x = (event.clientX / web.domElement.offsetWidth) * 2 - 1
	mouse.y = -(event.clientY / web.domElement.offsetHeight) * 2 + 1
	web.raycaster.setFromCamera(mouse, web.camera)
	const intersects = web.raycaster.intersectObjects(web.cityMeshList, true)
	if (intersects && intersects.length > 0) {
		const mesh = intersects[0].object
		nextMap(mesh.name)
	}
}

const nextMap = async code => {
	if (activeLevel.value === "level3") return
	const res = await web.loadMap(code)
	if (res) {
		const levelList = Object.keys(mapLevel)
		const index = levelList.indexOf(activeLevel.value)
		activeLevel.value = levelList[index + 1] as TMapLevel
		mapLevel[activeLevel.value as keyof typeof activeLevel] = code
	}
}

const back = async () => {
	const levelList = Object.keys(mapLevel)
	const index = levelList.indexOf(activeLevel.value)
	const lastLevel = levelList[index - 1]
	const code = mapLevel[lastLevel]
	const res = await web.loadMap(code)
	if (res) {
		activeLevel.value = lastLevel as TMapLevel
	}
}

const renderScene = () => {
	web.updateMap()
	web.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	web.domElement.removeEventListener("click", click)
	web.mapDestory()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
