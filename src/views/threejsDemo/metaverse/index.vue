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

const loading = ref(true)
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
	metaverse = new Metaverse(webgl.value, {
		render: {
			logarithmicDepthBuffer: true
		},
		controls: {
			type: false
		}
	})

	render()
})

onUnmounted(() => {
	metaverse.destroy()
})

const render = () => {
	metaverse.updateMetaverse()
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
