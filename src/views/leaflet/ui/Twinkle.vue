<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 18,
		minZoom: 3,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 12)

	const icon = L.divIcon({
		className: "dIcon",
		html: '<div class="blinking"><img src="./img/map/map-point.png"></div>',
		iconSize: [42, 34]
	})

	for (let i = 0; i < 10; i++) {
		const xy: LatLngExpression = [24.42 + Math.random() * 0.2, 118.06 + Math.random() * 0.2]
		const marker = L.marker(xy, { icon: icon })
		marker.addTo(map)
	}
})
</script>
<style lang="scss">
#map {
	width: 100%;
	height: 100%;
}

@keyframes wxBlinking {
	from {
		width: 40px;
		height: 40px;
		opacity: 0.3;
	}

	to {
		width: 40px;
		height: 40px;
		opacity: 1;
	}
}

.blinking {
	animation: wxBlinking 1s infinite alternate;
}
</style>
