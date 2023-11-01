<template>
	<div id="map"></div>
	<input id="swipe" type="range" style="width: 100%" />
</template>

<script lang="ts" setup>
import Map from "ol/Map.js"
import OSM from "ol/source/OSM.js"
import TileLayer from "ol/layer/Tile.js"
import View from "ol/View.js"
import { getRenderPixel } from "ol/render.js"
import Stamen from "ol/source/Stamen.js"

const osm = new TileLayer({
	source: new OSM()
})

const aerial = new TileLayer({
	source: new Stamen({ layer: "watercolor" })
})

onMounted(() => {
	initMap()
})

let map
const initMap = () => {
	map = new Map({
		layers: [osm, aerial],
		target: "map",
		view: new View({
			center: [0, 0],
			zoom: 2
		})
	})

	const swipe: any = document.getElementById("swipe")

	aerial.on("prerender", function (event) {
		const ctx: any = event.context
		const mapSize = map.getSize()
		const width = mapSize[0] * (swipe.value / 100)
		const tl = getRenderPixel(event, [width, 0])
		const tr = getRenderPixel(event, [mapSize[0], 0])
		const bl = getRenderPixel(event, [width, mapSize[1]])
		const br = getRenderPixel(event, mapSize)

		ctx.save()
		ctx.beginPath()
		ctx.moveTo(tl[0], tl[1])
		ctx.lineTo(bl[0], bl[1])
		ctx.lineTo(br[0], br[1])
		ctx.lineTo(tr[0], tr[1])
		ctx.closePath()
		ctx.clip()
	})

	aerial.on("postrender", function (event) {
		const ctx: any = event.context
		ctx.restore()
	})

	swipe.addEventListener("input", function () {
		map.render()
	})
}
</script>

<style lang="scss" scoped>
#map {
	width: 100%;
	height: 80%;
}
</style>
