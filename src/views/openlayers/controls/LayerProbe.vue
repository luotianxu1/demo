<template>
	<div id="map" ref="container"></div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import Tile from "ol/layer/Tile" // 瓦片加载器
import XYZ from "ol/source/XYZ" // 引入XYZ地图格式
import View from "ol/View"

onMounted(() => {
	initMap()
})

let map
let radius = 75
let mousePosition
let container = ref<HTMLElement>()
const TiandiMap_vec = new Tile({
	source: new XYZ({
		url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
		wrapX: false
	})
})
const TiandiMap_img = new Tile({
	source: new XYZ({
		url: "http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=3bc6874f2b919aa581635abab7759a3f",
		wrapX: false
	})
})

const initMap = () => {
	map = new Map({
		target: "map",
		layers: [TiandiMap_vec, TiandiMap_img],
		view: new View({
			center: [-109, 46.5], // 中心点坐标
			zoom: 6
		})
	})

	container.value.addEventListener("mousemove", mousemove)
	container.value.addEventListener("mouseout", mouseout)

	TiandiMap_img.on("prerender", prerender)
	TiandiMap_img.on("postrender", postrender)
}

onBeforeUnmount(() => {
	container.value.removeEventListener("mousemove", mousemove)
	container.value.removeEventListener("mouseout", mouseout)
	TiandiMap_img.removeEventListener("prerender", prerender)
	TiandiMap_img.removeEventListener("postrender", prerender)
})

const mousemove = event => {
	mousePosition = map.getEventPixel(event)
	map.render()
}

const mouseout = () => {
	mousePosition = null
	map.render()
}

const prerender = event => {
	let ctx: any = event.context
	let pixelRatio = event.frameState.pixelRatio
	ctx.save()
	ctx.beginPath()
	if (mousePosition) {
		//只显示一个围绕着鼠标的圆圈
		ctx.arc(mousePosition[0] * pixelRatio, mousePosition[1] * pixelRatio, radius * pixelRatio, 0, 2 * Math.PI)
		ctx.lineWidth = 5 * pixelRatio
		ctx.strokeStyle = "rgba(0,0,0,0.5)"
		ctx.stroke()
	}
	ctx.clip()
	map.render()
}

const postrender = event => {
	let ctx: any = event.context
	ctx.restore()
}
</script>

<style lang="scss" scoped>
#map {
	width: 100vw;
	height: 100vh;
}
</style>
