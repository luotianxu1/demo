<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import Hotel from "./model/hotel"

let webgl = ref()
let web: Hotel
onMounted(() => {
	if (!webgl.value) {
		return
	}
	web = new Hotel(webgl.value, {
		loading: {
			show: true,
			html: true
		}
	})
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
