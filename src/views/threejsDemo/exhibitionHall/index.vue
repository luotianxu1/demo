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
import ExhibitionHall from "./model/exhibitionHall"

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = function () {
	loading.value = false
}

let webgl = ref()
let web: ExhibitionHall
onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new ExhibitionHall(webgl.value, false, false, false, {
		render: { antialias: true, logarithmicDepthBuffer: true }
	})

	render()
})

onUnmounted(() => {
	web.remove()
})

const render = () => {
	web.updateExhibitionHall()
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
