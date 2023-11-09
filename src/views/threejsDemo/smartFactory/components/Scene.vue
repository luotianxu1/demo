<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import SmartFactory from "../model/smartFactory"

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
