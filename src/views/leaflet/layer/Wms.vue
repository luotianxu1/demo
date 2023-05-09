<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	let basemaps = {
		Topography: L.tileLayer.wms("http://ows.mundialis.de/services/service?", {
			layers: "TOPO-WMS"
		}),

		Places: L.tileLayer.wms("http://ows.mundialis.de/services/service?", {
			layers: "OSM-Overlay-WMS"
		}),

		"Topography, then places": L.tileLayer.wms("http://ows.mundialis.de/services/service?", {
			layers: "TOPO-WMS,OSM-Overlay-WMS"
		}),

		"Places, then topography": L.tileLayer.wms("http://ows.mundialis.de/services/service?", {
			layers: "OSM-Overlay-WMS,TOPO-WMS"
		})
	}
	L.tileLayer
		.wms("http://ows.mundialis.de/services/service?", {
			layers: "TOPO-WMS"
		})
		.addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 5)

	L.control.layers(basemaps).addTo(map)
	basemaps.Topography.addTo(map)
})
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
