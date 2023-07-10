<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Feature from "ol/Feature.js"
import Map from "ol/Map.js"
import Point from "ol/geom/Point.js"
import View from "ol/View.js"
import { Circle as CircleStyle, Stroke, Style } from "ol/style.js"
import { OSM, Vector as VectorSource } from "ol/source.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"
import { easeOut } from "ol/easing.js"
import { fromLonLat } from "ol/proj.js"
import { getVectorContext } from "ol/render.js"
import { unByKey } from "ol/Observable.js"

let interval
onMounted(() => {
	initMap()
	interval = setInterval(addRandomFeature, 1000)
})

onBeforeUnmount(() => {
	clearInterval(interval)
})

let map

const source = new VectorSource({
	wrapX: false
})
const vector = new VectorLayer({
	source: source
})

const tileLayer = new TileLayer({
	source: new OSM()
})

const initMap = () => {
	map = new Map({
		target: "map",
		layers: [tileLayer, vector],
		view: new View({
			center: [0, 0],
			zoom: 3,
			multiWorld: true
		})
	})
}

const addRandomFeature = () => {
	const x = Math.random() * 360 - 180
	const y = Math.random() * 170 - 85
	const geom = new Point(fromLonLat([x, y]))
	const feature = new Feature(geom)
	source.addFeature(feature)
}

const duration = 3000
const flash = feature => {
	const start = Date.now()
	const flashGeom = feature.getGeometry().clone()
	const listenerKey = tileLayer.on("postrender", animate)

	function animate(event) {
		const frameState = event.frameState
		const elapsed = frameState.time - start
		if (elapsed >= duration) {
			unByKey(listenerKey)
			return
		}
		const vectorContext = getVectorContext(event)
		const elapsedRatio = elapsed / duration
		const radius = easeOut(elapsedRatio) * 25 + 5
		const opacity = easeOut(1 - elapsedRatio)

		const style = new Style({
			image: new CircleStyle({
				radius: radius,
				stroke: new Stroke({
					color: "rgba(255, 0, 0, " + opacity + ")",
					width: 0.25 + opacity
				})
			})
		})

		vectorContext.setStyle(style)
		vectorContext.drawGeometry(flashGeom)
		map.render()
	}
}

source.on("addfeature", function (e) {
	flash(e.feature)
})
</script>

<style lang="scss" scoped>
#map {
	width: 100vw;
	height: 100vh;
}
</style>
