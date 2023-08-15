<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Draw from "ol/interaction/Draw.js"
import Map from "ol/Map.js"
import View from "ol/View.js"
import { OSM, Vector as VectorSource } from "ol/source.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"
import { Icon, Stroke, Style } from "ol/style.js"
import Point from "ol/geom/Point.js"
import { get } from "ol/proj.js"

onMounted(() => {
	initMap()
})

let map: Map

const raster = new TileLayer({
	source: new OSM()
})

const source = new VectorSource({ wrapX: false })

const styleFunction = function (feature) {
	const geometry = feature.getGeometry()
	const styles = [
		// linestring
		new Style({
			stroke: new Stroke({
				color: "#ffcc33",
				width: 2
			})
		})
	]

	geometry.forEachSegment(function (start, end) {
		const dx = end[0] - start[0]
		const dy = end[1] - start[1]
		const rotation = Math.atan2(dy, dx)
		// arrows
		styles.push(
			new Style({
				geometry: new Point(end),
				image: new Icon({
					src: "/img/map/arrow.png",
					anchor: [0.75, 0.5],
					rotateWithView: true,
					rotation: -rotation
				})
			})
		)
	})

	return styles
}

const vector = new VectorLayer({
	source: source,
	style: styleFunction
})

const extent = get("EPSG:3857").getExtent().slice()
extent[0] += extent[0]
extent[2] += extent[2]

const initMap = () => {
	map = new Map({
		target: "map",
		view: new View({
			center: [-11000000, 4600000],
			zoom: 4
		}),
		layers: [raster, vector]
	})

	addInteraction()
}

const addInteraction = () => {
	map.addInteraction(
		new Draw({
			source: source,
			type: "LineString"
		})
	)
}
</script>

<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
