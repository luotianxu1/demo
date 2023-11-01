<template>
	<div class="main">
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import GeoJSON from "ol/format/GeoJSON.js"
import Map from "ol/Map.js"
import VectorLayer from "ol/layer/Vector.js"
import VectorSource from "ol/source/Vector.js"
import View from "ol/View.js"
import { Select } from "ol/interaction.js"
import { Fill, Stroke, Style } from "ol/style.js"

onMounted(() => {
	initMap()
})

let map

const vectorSource = new VectorSource({
	url: "https://openlayers.org/data/vector/ecoregions.json",
	format: new GeoJSON()
})

const style = new Style({
	fill: new Fill({
		color: "#eeeeee"
	})
})

const initMap = () => {
	map = new Map({
		target: "map",
		view: new View({
			center: [0, 0],
			zoom: 2,
			constrainRotation: 16
		}),
		layers: [
			new VectorLayer({
				source: vectorSource,
				background: "#1a2b39",
				style: function (feature) {
					const color = feature.get("COLOR_BIO") || "#eeeeee"
					style.getFill().setColor(color)
					return style
				}
			})
		]
	})

	map.addInteraction(select)
}

const selectedStyle = new Style({
	fill: new Fill({
		color: "rgba(255, 255, 255, 0.6)"
	}),
	stroke: new Stroke({
		color: "rgba(255, 255, 255, 0.7)",
		width: 2
	})
})

const select = new Select({
	style: function (feature) {
		const color = feature.get("COLOR_BIO") || "#eeeeee"
		selectedStyle.getFill().setColor(color)
		return selectedStyle
	}
})

const selectedFeatures = select.getFeatures()
selectedFeatures.on(["add", "remove"], function () {
	const names = selectedFeatures.getArray().map(feature => {
		return feature.get("ECO_NAME")
	})
	if (names.length > 0) {
		console.log(names)
	}
})
</script>

<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 150px;
		padding: 10px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
