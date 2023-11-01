<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import * as turf from "@turf/turf"

let latlngs: any = [
	[24.523887634277347, 118.14130783081056],
	[24.49127197265625, 118.14302444458008],
	[24.494361877441406, 118.16774368286133],
	[24.517192840576172, 118.16619873046874]
]

let map: L.Map | null = null
onMounted(async () => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.507455675371375, 118.15418243408205]
	map.setView(center_point, 14)

	L.polyline(latlngs, { color: "red" }).addTo(map)

	lineSliceAlong()
})

const lineSliceAlong = () => {
	let newLatlngs = []
	for (let i = 0; i < latlngs.length; i++) {
		let arrTemp: LatLngExpression = [latlngs[i][1], latlngs[i][0]]
		newLatlngs.push(arrTemp)
	}
	//计算线的长度
	let line = turf.lineString(newLatlngs)

	let length = turf.length(line, { units: "meters" })
	console.log("线的长度为：", length)

	let chunk = turf.lineChunk(line, 1000, { units: "meters" })

	let markerIcon = L.icon({
		iconUrl: "img/map/map-point.png",
		iconAnchor: [21, 42],
		iconSize: [42, 42]
	})

	for (let i = 0; i < chunk.features.length; i++) {
		let latlngTemp: LatLngExpression = [
			chunk.features[i].geometry.coordinates[0][1],
			chunk.features[i].geometry.coordinates[0][0]
		]
		console.log("坐标" + (i + 1) + ":", latlngTemp)
		let marker = L.marker(latlngTemp, {
			icon: markerIcon
		})
		marker.addTo(map!)
	}
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
