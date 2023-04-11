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
import SmartPark from "../model/smartPark"

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = function () {
	loading.value = false
}

let webgl = ref()
let smartPark: SmartPark
onMounted(() => {
	if (!webgl.value) {
		return
	}
	smartPark = new SmartPark(webgl.value, true, false, false, {
		render: {
			logarithmicDepthBuffer: true
		}
	})

	render()
})

onUnmounted(() => {
	smartPark.remove()
})

const render = () => {
	smartPark.updateSmartPark()
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
	position: relative;
}
</style>
