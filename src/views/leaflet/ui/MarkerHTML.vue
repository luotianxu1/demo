<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]

onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	map.setView(center_point, 3)

	addDivMarker()
})

const addDivMarker = () => {
	let html = ""
	html += "<div>"
	html += '<img src="./img/map/map-point.png" width="40px;" height="40px" >'
	html += "</div>"
	let divIcon = L.divIcon({ html: html, iconAnchor: [23, 54] })
	let myDivLayer = L.marker(center_point, { icon: divIcon })
	myDivLayer.addTo(map!)
}
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	display: flex;

	.btnList {
		width: 255px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	#map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
