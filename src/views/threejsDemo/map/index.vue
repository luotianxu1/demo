<template>
	<div><el-button @click="backMap" :disabled="activeLevel === 'level1'">返回</el-button></div>
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
let nextLevel = ref<TMapLevel>("level1")

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

const getUrl = code => {
	if (nextLevel.value === "level2") {
		return "province/" + code
	} else if (nextLevel.value === "level3") {
		return "citys/" + code
	} else {
		return code
	}
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
	const levelList = Object.keys(mapLevel)
	nextLevel.value = (levelList[levelList.indexOf(activeLevel.value) + 1] ?? "level1") as TMapLevel
	const url = getUrl(code)
	const res = await web.loadMap(url)
	if (res) {
		activeLevel.value = nextLevel.value
		mapLevel[activeLevel.value as keyof typeof activeLevel] = code
		if (!levelList[levelList.indexOf(activeLevel.value) + 1]) return
		nextLevel.value = levelList[levelList.indexOf(activeLevel.value) + 1] as TMapLevel
	}
}

const backMap = async () => {
	if (activeLevel.value === "level1") return
	const levelList = Object.keys(mapLevel)
	nextLevel.value = levelList[levelList.indexOf(activeLevel.value) - 1] as TMapLevel
	const code = mapLevel[nextLevel.value]
	const url = getUrl(code)
	const res = await web.loadMap(url)
	if (res) {
		activeLevel.value = nextLevel.value
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
