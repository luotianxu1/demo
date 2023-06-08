<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=55b4d4eaef95384c946e9bd1b99c5610").addTo(map)

	let imageUrl = "https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg"
	let errorOverlayUrl = "https://cdn-icons-png.flaticon.com/512/110/110686.png"
	let altText = "Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection."
	let latLngBounds = L.latLngBounds([
		[40.799311, -74.118464],
		[40.68202047785919, -74.33]
	])

	L.imageOverlay(imageUrl, latLngBounds, {
		opacity: 0.8,
		errorOverlayUrl: errorOverlayUrl,
		alt: altText,
		interactive: true
	}).addTo(map)
	const center_point: LatLngExpression = [40.799311, -74.118464]
	map.setView(center_point, 11)
})
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
