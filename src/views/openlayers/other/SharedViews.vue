<template>
	<div id="map">
		<div id="left"></div>
		<div id="right"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map.js"
import TileLayer from "ol/layer/Tile.js"
import View from "ol/View.js"
import { OSM } from "ol/source.js"

const view = new View({
	center: [-6655.5402445057125, 6709968.258934638],
	zoom: 13
})

const map1Layer = new TileLayer({
	source: new OSM()
})

const map2Layer = new TileLayer({
	source: new OSM()
})

onMounted(() => {
	const map1 = new Map({
		target: "left",
		layers: [map1Layer],
		view: view
	})

	const map2 = new Map({
		target: "right",
		layers: [map2Layer],
		view: view
	})
})
</script>

<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
	display: flex;
}

#left {
	flex: 1;
}

#right {
	flex: 1;
}
</style>
