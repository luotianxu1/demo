<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
let marker: L.Marker | null = null
let polygon: L.Polygon
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.507455675371375, 118.15418243408205]
	map.setView(center_point, 13)

	let latlngs: LatLngExpression[][] = [
		[
			[24.523887634277347, 118.14130783081056],
			[24.49127197265625, 118.14302444458008],
			[24.494361877441406, 118.16774368286133],
			[24.517192840576172, 118.16619873046874],
			[24.523887634277347, 118.14130783081056]
		]
	]
	polygon = L.polygon(latlngs, { color: "#3388ff", opacity: 0.2, fillColor: "#3388ff", fillOpacity: 0.2, weight: 2 }).addTo(map)
	marker = L.marker([24.507455675371375, 118.15418243408205], { icon: myIcon, opacity: 0.9 }).addTo(map)

	marker.on("mouseover", mouseoverCallBack, "mymouseover")
	marker.on("mouseout", mouseoutCallBack, "mymouseout")
})

let myIcon = L.icon({
	iconSize: [20, 40],
	iconAnchor: [20, 16],
	iconUrl: "./leaflet/calculation/map-point.png"
})

let newIcon = L.icon({
	iconSize: [40, 60],
	iconAnchor: [25, 20],
	iconUrl: "./leaflet/calculation/map-point.png"
})

const mouseoverCallBack = (e: any) => {
	console.log("触发移入事件", e)
	polygon.setStyle({
		opacity: 0.5,
		fillOpacity: 0.5
	})
	marker!.setIcon(newIcon)
}

const mouseoutCallBack = (e: any) => {
	console.log("触发移出事件", e)
	polygon.setStyle({
		opacity: 0.2,
		fillOpacity: 0.2
	})
	marker!.setIcon(myIcon)
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100%;

	.btnList {
		display: flex;
		width: 255px;
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
