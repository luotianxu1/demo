<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import SmartPark from "../model/smartPark"

let webgl = ref()
let smartPark: SmartPark
onMounted(() => {
	if (!webgl.value) {
		return
	}
	smartPark = new SmartPark(webgl.value, {
		render: {
			logarithmicDepthBuffer: true
		},
		loading: {
			show: true,
			html: true,
			loadingId: "app"
		}
	})

	render()
})

onUnmounted(() => {
	// smartPark.remove()
})

const render = () => {
	smartPark.updateSmartPark()
	requestAnimationFrame(render)
}
</script>

<style lang="scss" scoped>
.webgl {
	position: relative;
	top: 0;
	left: 0;
	z-index: 100;
	display: flex;
	width: 100vw;
	height: 100vh;
}
</style>
