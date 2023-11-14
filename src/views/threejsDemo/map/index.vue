<template>
	<div ref="webgl" class="webgl"></div>
</template>

<script lang="ts" setup>
import Map from "./model/map"

const webgl = ref<HTMLDivElement>()
let web: Map

onMounted(() => {
	init()
})

const init = () => {
	if (!webgl.value) {
		return
	}
	web = new Map(webgl.value, {
		render: {
			antialias: true,
			logarithmicDepthBuffer: true
		},
		css2DRender: true
	})
	renderScene()
}

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	web.mapDestory()
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
