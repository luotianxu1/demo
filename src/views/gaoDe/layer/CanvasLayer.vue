<template>
	<div id="container"></div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

onMounted(() => {
	initMap()
})

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: []
	})
		.then(AMap => {
			const map = new AMap.Map("container", {
				viewMode: "3D",
				zoom: 15,
				center: [116.335183, 39.941735]
			})

			/*
			 * 添加Canvas图层
			 */
			const canvas = document.createElement("canvas")
			canvas.width = canvas.height = 200

			const context = canvas.getContext("2d")
			if (!context) return
			context.fillStyle = "rgb(0,100,255)"
			context.strokeStyle = "white"
			context.globalAlpha = 1
			context.lineWidth = 2

			let radious = 0
			const draw = function () {
				context.clearRect(0, 0, 200, 200)
				context.globalAlpha = (context.globalAlpha - 0.01 + 1) % 1
				radious = (radious + 1) % 100

				context.beginPath()
				context.arc(100, 100, radious, 0, 2 * Math.PI)
				context.fill()
				context.stroke()

				// 刷新渲染图层
				CanvasLayer.reFresh()

				AMap.Util.requestAnimFrame(draw)
			}

			const CanvasLayer = new AMap.CanvasLayer({
				canvas: canvas,
				bounds: new AMap.Bounds([116.328911, 39.937229], [116.342659, 39.946275]),
				zooms: [3, 18]
			})

			map.addLayer(CanvasLayer)
			draw()
		})
		.catch(e => {
			console.log(e)
		})
}
</script>
<style lang="scss" scoped>
#container {
	height: 100%;
	width: 100%;
	padding: 0;
	margin: 0;
}
</style>
