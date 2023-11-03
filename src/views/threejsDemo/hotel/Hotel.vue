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
import Hotel from "./model/hotel"

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = function () {
	loading.value = false
}

let webgl = ref()
let web: Hotel
onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new Hotel(webgl.value)
	render()
})

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
