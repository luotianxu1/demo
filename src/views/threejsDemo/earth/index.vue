<template>
	<div ref="webglRef" class="webgl"></div>
</template>

<script lang="ts" setup>
import * as THREE from "three"
import Earth from "./model/earth"

const webglRef = ref<HTMLDivElement>()
let web: Earth
onMounted(() => {
	init()
})

const init = () => {
	if (!webglRef.value) {
		return
	}
	web = new Earth(webglRef.value, {})

	renderScene()
}

const renderScene = () => {
	web.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	web.destroy()
})
</script>

<style scoped lang="scss">
.webgl {
	width: 100%;
	height: 100%;
}
</style>
