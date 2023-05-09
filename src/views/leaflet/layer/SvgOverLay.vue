<template>
	<div id="map" ref="map"></div>
	<svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
		<rect width="200" height="200" />
		<rect x="75" y="23" width="50" height="50" style="fill: red" />
		<rect x="75" y="123" width="50" height="50" style="fill: #0013ff" />
	</svg>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")

	let latLngBounds = L.latLngBounds([
		[32, -130],
		[13, -100]
	])
	map.fitBounds(latLngBounds)

	let svgElement = document.querySelector("#svg")
	let svgOverlay = L.svgOverlay(svgElement as any, latLngBounds, {
		opacity: 0.7,
		interactive: true
	}).addTo(map)

	const center_point: LatLngExpression = [32, -130]
	map.setView(center_point, 5)
})
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
