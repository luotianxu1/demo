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
import SmartFactory from "../model/smartFactory"

const loading = ref(true)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = function () {
	loading.value = false
}

let webgl = ref()
let smartFactory: SmartFactory
onMounted(() => {
	if (!webgl.value) {
		return
	}
	smartFactory = new SmartFactory(webgl.value, {
		css3DRender: true,
		render: {
			logarithmicDepthBuffer: true
		}
	})

	render()
})

onUnmounted(() => {
	smartFactory.destroy()
})

const render = () => {
	smartFactory.update()
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
