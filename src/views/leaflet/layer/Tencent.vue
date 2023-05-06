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
	L.tileLayer("http://rt0.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=0", {
		maxZoom: 20,
		minZoom: 1,
		tms: true, //腾讯地图需设置该值
		attribution: "ⓒ 2012 Daum"
	}).addTo(map)
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
