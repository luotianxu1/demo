<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import WebGl from "@/utils/three/webGl"

let webgl = ref()
let web: WebGl
onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new WebGl(webgl.value)
	web.addAxesHelper()

	render()
})

const render = () => {
	web.update()
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
