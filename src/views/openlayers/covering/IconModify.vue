<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Feature from "ol/Feature.js"
import Map from "ol/Map.js"
import Point from "ol/geom/Point.js"
import View from "ol/View.js"
import { Icon, Style } from "ol/style.js"
import { Modify } from "ol/interaction.js"
import { Vector as VectorSource } from "ol/source.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"
import OSM from "ol/source/OSM"

const iconFeature = new Feature({
	geometry: new Point([0, 0]),
	name: "Null Island",
	population: 4000,
	rainfall: 500
})

const iconStyle = new Style({
	image: new Icon({
		anchor: [0.5, 46],
		anchorXUnits: "fraction",
		anchorYUnits: "pixels",
		src: "/public/img/map/icon.png"
	})
})

iconFeature.setStyle(iconStyle)

const vectorSource = new VectorSource({
	features: [iconFeature]
})

const vectorLayer = new VectorLayer({
	source: vectorSource
})

const rasterLayer = new TileLayer({
	source: new OSM()
})

let map

onMounted(() => {
	initMap()
})

const initMap = () => {
	const target = document.getElementById("map")
	map = new Map({
		layers: [rasterLayer, vectorLayer],
		target: target,
		view: new View({
			center: [0, 0],
			zoom: 3
		})
	})

	const modify = new Modify({
		hitDetection: vectorLayer,
		source: vectorSource
	})
	modify.on(["modifystart", "modifyend"], function (evt) {
		target.style.cursor = evt.type === "modifystart" ? "grabbing" : "pointer"
	})
	const overlaySource = modify.getOverlay().getSource()
	overlaySource.on(["addfeature", "removefeature"], function (evt) {
		target.style.cursor = evt.type === "addfeature" ? "pointer" : ""
	})

	map.addInteraction(modify)
}
</script>

<style lang="scss" scoped>
#map {
	width: 100vw;
	height: 100vh;
}
</style>
