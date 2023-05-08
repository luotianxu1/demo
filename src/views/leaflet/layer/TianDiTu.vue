//map.vue

<template>
	<div id="map" ref="map"></div>
</template>

<script setup lang="ts">
import * as L from "leaflet"
import type { LatLngExpression } from "leaflet"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer(
		"http://t0.tianditu.gov.cn/img_w/wmts?" +
			"SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles" +
			"&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=518f2364222882244bfe0b5bd8c17faa",
		{
			maxZoom: 20,
			minZoom: 1,
			attribution: "© OpenStreetMap"
		}
	).addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 12)
})
</script>

<style>
#map {
	width: 100%;
	height: 100%;
}
</style>
