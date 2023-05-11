<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import * as turf from "@turf/turf"

let map: L.Map | null = null
let linePoints: any = [
	[24.50019836425781, 118.1006208447267],
	[24.46311956835938, 118.0827730126955],
	[24.43668365785156, 118.1068038944297],
	[24.43706977539062, 118.1308364681642]
]
let startPoint: any = [24.486337004163207, 118.09395009627897]
let endPoint: any = [24.436777296296626, 118.11335879984584]

onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.52242257014833, 118.1147165936913]
	map.setView(center_point, 12)

	let polyline = L.polyline(linePoints, { color: "blue" }).addTo(map)
	let markerStart = L.marker(startPoint).addTo(map)
	let markerEnd = L.marker(endPoint).addTo(map)

	lineSlice()
})

function lineSlice() {
	//置换坐标位置
	let newLinePoints = []
	for (let i = 0; i < linePoints.length; i++) {
		newLinePoints.push([linePoints[i][1], linePoints[i][0]])
	}
	let newStartPoint = [startPoint[1], startPoint[0]]
	let newEndPoint = [endPoint[1], endPoint[0]]
	let line = turf.lineString(newLinePoints)
	let start = turf.point(newStartPoint)
	let stop = turf.point(newEndPoint)

	let sliced = turf.lineSlice(start, stop, line)

	let redLinePoints = sliced.geometry.coordinates
	let newRedLinePoints: any = []
	for (let i = 0; i < redLinePoints.length; i++) {
		newRedLinePoints.push([redLinePoints[i][1], redLinePoints[i][0]])
	}
	console.log("截取后线段坐标：", newRedLinePoints)
	let redPolyline = L.polyline(newRedLinePoints, { color: "red", weight: 8 }).addTo(map!)
}
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
