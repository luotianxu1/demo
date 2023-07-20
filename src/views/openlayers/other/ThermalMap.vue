<template>
	<div class="main">
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import KML from "ol/format/KML.js"
import Map from "ol/Map.js"
import Stamen from "ol/source/Stamen.js"
import VectorSource from "ol/source/Vector.js"
import View from "ol/View.js"
import { Heatmap as HeatmapLayer, Tile as TileLayer } from "ol/layer.js"

onMounted(() => {
	initMap()
})

let map
const vector = new HeatmapLayer({
	source: new VectorSource({
		url: "./kml/2012_Earthquakes_Mag5.kml",
		format: new KML({
			extractStyles: false
		})
	}),
	blur: parseInt("10", 10),
	radius: parseInt("10", 10),
	weight: function (feature) {
		const name = feature.get("name")
		const magnitude = parseFloat(name.substr(2))
		return magnitude - 5
	}
})

const raster = new TileLayer({
	source: new Stamen({
		layer: "toner"
	})
})

const initMap = () => {
	map = new Map({
		target: "map",
		view: new View({
			center: [0, 0],
			zoom: 2
		}),
		layers: [raster, vector]
	})
}
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.btnList {
		width: 150px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		overflow: auto;
		padding: 10px;
	}

	.map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
