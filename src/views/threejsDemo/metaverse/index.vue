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
import Metaverse from "./model/metaverse"

const loading = ref(false)
const loadingText = ref("加载中")
THREE.DefaultLoadingManager.onLoad = function () {
	loading.value = false
}

let webgl = ref()
let metaverse: Metaverse
onMounted(() => {
	if (!webgl.value) {
		return
	}
	metaverse = new Metaverse(webgl.value, false, false, false, {
		render: {
			logarithmicDepthBuffer: true
		}
	})

	render()
})

onUnmounted(() => {
	metaverse.remove()
})

const render = () => {
	metaverse.updateMetaverse()
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
