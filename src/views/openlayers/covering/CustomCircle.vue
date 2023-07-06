<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import View from "ol/View"
import Feature from "ol/Feature.js"
import { Circle } from "ol/geom.js"
import { Style } from "ol/style.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"
import { OSM, Vector as VectorSource } from "ol/source.js"

onMounted(() => {
	initMap()
})

let map
const circleFeature = new Feature({
	geometry: new Circle([12127398.797692968, 4063894.123105166], 50)
})
circleFeature.setStyle(
	new Style({
		renderer(coordinates, state) {
			console.log(coordinates)

			const [[x, y], [x1, y1]]: any = coordinates
			const ctx = state.context
			const dx = x1 - x
			const dy = y1 - y
			const radius = Math.sqrt(dx * dx + dy * dy)

			const innerRadius = 0
			const outerRadius = radius * 1.4

			const gradient = ctx.createRadialGradient(x, y, innerRadius, x, y, outerRadius)
			gradient.addColorStop(0, "rgba(255,0,0,0)")
			gradient.addColorStop(0.6, "rgba(255,0,0,0.2)")
			gradient.addColorStop(1, "rgba(255,0,0,0.8)")
			ctx.beginPath()
			ctx.arc(x, y, radius, 0, 2 * Math.PI, true)
			ctx.fillStyle = gradient
			ctx.fill()

			ctx.arc(x, y, radius, 0, 2 * Math.PI, true)
			ctx.strokeStyle = "rgba(255,0,0,1)"
			ctx.stroke()
		}
	})
)

const initMap = () => {
	map = new Map({
		target: "map",
		layers: [
			new TileLayer({
				source: new OSM()
			}),
			new VectorLayer({
				source: new VectorSource({
					features: [circleFeature]
				})
			})
		],
		view: new View({
			center: [12127398.797692968, 4063894.123105166],
			zoom: 19
		})
	})
}
</script>

<style lang="scss" scoped>
#map {
	width: 100vw;
	height: 100vh;
}
</style>
