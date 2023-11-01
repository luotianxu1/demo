<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "@utils/leaflet/L.Polyline.SnakeAnim.js"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.49042257014283, 118.1147165936993]
	map.setView(center_point, 12)

	guiji()
})

const guiji = () => {
	//创建移动图标
	let _icon = L.icon({
		iconUrl: "./leaflet/calculation/map-point.png",
		iconAnchor: [12, 39]
	})

	let points = [
		[24.577789306640625, 118.02852630615234],
		[24.567489624023438, 118.08929443359376],
		[24.509124755859375, 118.13255310058594],
		[24.468612670898438, 118.125],
		[24.44732666015625, 118.08448791503906]
	]
	let featureGroup = addMovingPolyline(points, _icon)
	;(featureGroup as any).snakeIn(false, 200)
	// featureGroup.on("snake", function (ev) {
	// 	console.log(ev)
	// })
}

const addMovingPolyline = (points: any[], icon: L.Icon<L.IconOptions>) => {
	let featureGroup = []
	for (let i = 0; i < points.length; i++) {
		if (i === points.length - 1) {
			featureGroup.push(L.marker(points[i], { icon: icon }))
		} else {
			featureGroup.push(L.marker(points[i], { icon: icon }))
			featureGroup.push(L.polyline([points[i], points[i + 1]]))
		}
	}

	let feature = L.featureGroup(featureGroup)
	map!.addLayer(feature)
	return feature
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
