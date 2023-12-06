<template>
	<div class="main">
		<div ref="webglRef" class="webgl"></div>
		<div class="btnList">
			<div class="btn" @click="changeScene('earth')">地球</div>
			<div class="btn" @click="changeScene('map')">地图</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import MainScene from "./model/mainScene"

const webglRef = ref<HTMLDivElement>()
let webGl: MainScene

onMounted(() => {
	init()
})

const init = () => {
	webGl = new MainScene(webglRef.value, {
		render: {
			antialias: true,
			logarithmicDepthBuffer: false
		}
	})

	renderScene()
}

const changeScene = type => {
	webGl.changeScene(type)
}

const renderScene = () => {
	webGl?.update()
	requestAnimationFrame(renderScene)
}

onUnmounted(() => {
	webGl.destroy()
	webGl = null
	webglRef.value = null
})
</script>

<style scoped lang="scss">
.main {
	position: relative;
	width: 100%;
	height: 100%;

	.webgl {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.btnList {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 999;
		color: #fff;
	}
}
</style>
