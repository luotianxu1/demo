<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import * as turf from "@turf/turf"

let map: L.Map | null = null
const linePoints: any = [
	[24.50019836425782, 118.1006240844767],
	[24.46311950683598, 118.0827713012655],
	[24.43668365478556, 118.1068038940297],
	[24.43702697753902, 118.1308364868142]
]
const markerPoint: any = [24.47861267089843, 118.1133270263619]
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.52242257014833, 118.1147165936913]
	map.setView(center_point, 12)

	L.polyline(linePoints, { color: "blue" }).addTo(map)
	L.marker(markerPoint).addTo(map)

	findNearestPointOnLine()
})

const findNearestPointOnLine = () => {
	//置换坐标位置
	let newLinePoints = []
	for (let i = 0; i < linePoints.length; i++) {
		newLinePoints.push([linePoints[i][1], linePoints[i][0]])
	}
	let newMarkerPoint = [markerPoint[1], markerPoint[0]]

	let line = turf.lineString(newLinePoints)
	let pt = turf.point(newMarkerPoint)
	let snapped = turf.nearestPointOnLine(line, pt, { units: "miles" })
	let nearestPoint = snapped.geometry.coordinates
	console.log("离点距离最近线上的点坐标", nearestPoint)
	//置换坐标位置
	let newNearestPoint: LatLngExpression = [nearestPoint[1], nearestPoint[0]]
	//点
	let markerTemp = L.marker(newNearestPoint)
	markerTemp.addTo(map!)
}
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
