<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import Metaverse from "./model/metaverse"

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
		},
		loading: {
			show: true,
			html: true
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
