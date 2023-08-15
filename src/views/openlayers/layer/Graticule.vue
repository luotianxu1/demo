<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Graticule from "ol/layer/Graticule.js"
import Map from "ol/Map.js"
import OSM from "ol/source/OSM.js"
import Stroke from "ol/style/Stroke.js"
import TileLayer from "ol/layer/Tile.js"
import View from "ol/View.js"
import { fromLonLat } from "ol/proj.js"

onMounted(() => {
	initMap()
})

const initMap = () => {
	const map = new Map({
		layers: [
			new TileLayer({
				source: new OSM({
					wrapX: false
				})
			}),
			new Graticule({
				// the style to use for the lines, optional.
				strokeStyle: new Stroke({
					color: "rgba(255,120,0,0.9)",
					width: 2,
					lineDash: [0.5, 4]
				}),
				showLabels: true,
				wrapX: false
			})
		],
		target: "map",
		view: new View({
			center: fromLonLat([4.8, 47.75]),
			zoom: 5
		})
	})
}
</script>

<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
