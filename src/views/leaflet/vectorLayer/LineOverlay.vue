<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "leaflet-polylinedecorator"

let map: L.Map | null = null
onMounted(async () => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [52.0, -11.0]
	map.setView(center_point, 5)

	simple()
	polygon()
	multiPattern()
	markers()
	rotatedMarker()
	polylines()
})

// 箭头
const simple = () => {
	let arrow = L.polyline(
		[
			[57, -19],
			[60, -12]
		],
		{}
	).addTo(map!)
	;(L as any)
		.polylineDecorator(arrow, {
			patterns: [
				{
					offset: "100%",
					repeat: 0,
					symbol: (L as any).Symbol.arrowHead({ pixelSize: 15, polygon: false, pathOptions: { stroke: true } })
				}
			]
		})
		.addTo(map)
}

// 虚线
const polygon = () => {
	let polygon = L.polygon(
		[
			[
				[54, -6],
				[55, -7],
				[56, -2],
				[55, 1],
				[53, 0]
			],
			[
				[54, -3],
				[54, -2],
				[55, -1],
				[55, -5]
			]
		],
		{ color: "#ff7800", weight: 1 }
	).addTo(map!)
	;(L as any)
		.polylineDecorator(polygon, {
			patterns: [{ offset: 0, repeat: 10, symbol: (L as any).Symbol.dash({ pixelSize: 3 }) }]
		})
		.addTo(map)
}

// 虚线
const multiPattern = () => {
	;(L as any)
		.polylineDecorator(
			[
				[49.543519, -12.469833],
				[49.808981, -12.895285],
				[50.056511, -13.555761],
				[50.217431, -14.758789],
				[50.476537, -15.226512],
				[50.377111, -15.706069],
				[50.200275, -16.000263],
				[49.860606, -15.414253],
				[49.672607, -15.710152],
				[49.863344, -16.451037],
				[49.774564, -16.875042],
				[49.498612, -17.106036],
				[49.435619, -17.953064],
				[49.041792, -19.118781],
				[48.548541, -20.496888],
				[47.930749, -22.391501],
				[47.547723, -23.781959],
				[47.095761, -24.94163],
				[46.282478, -25.178463],
				[45.409508, -25.601434],
				[44.833574, -25.346101],
				[44.03972, -24.988345]
			],
			{
				patterns: [
					{
						offset: 12,
						repeat: 25,
						symbol: (L as any).Symbol.dash({ pixelSize: 10, pathOptions: { color: "#f00", weight: 2 } })
					},
					{ offset: 0, repeat: 25, symbol: (L as any).Symbol.dash({ pixelSize: 0 }) }
				]
			}
		)
		.addTo(map)
}

// 图标
const markers = () => {
	let markerLine = L.polyline(
		[
			[58.44773, -28.65234],
			[52.9354, -23.33496],
			[53.01478, -14.32617],
			[58.1707, -10.37109],
			[59.68993, -0.65918]
		],
		{}
	).addTo(map!)
	;(L as any)
		.polylineDecorator(markerLine, {
			patterns: [{ offset: "5%", repeat: "10%", symbol: (L as any).Symbol.marker() }]
		})
		.addTo(map)
}

// 旋转图标
const rotatedMarker = () => {
	;(L as any)
		.polylineDecorator(
			[
				[42.9, -15],
				[44.18, -11.4],
				[45.77, -8.0],
				[47.61, -6.4],
				[49.41, -6.1],
				[51.01, -7.2]
			],
			{
				patterns: [
					{
						offset: 0,
						repeat: 10,
						symbol: (L as any).Symbol.dash({ pixelSize: 5, pathOptions: { color: "#000", weight: 1, opacity: 0.2 } })
					},
					{
						offset: "16%",
						repeat: "33%",
						symbol: (L as any).Symbol.marker({
							rotate: true,
							markerOptions: {
								icon: L.icon({
									iconUrl: "./leaflet/vectorLayer/icon_plane.png",
									iconAnchor: [16, 16]
								})
							}
						})
					}
				]
			}
		)
		.addTo(map)
}

const polylines = () => {
	let multiCoords1: LatLngExpression[][] = [
		[
			[47.5468, -0.791],
			[48.8068, -0.1318],
			[49.1242, 1.6699],
			[49.4966, 3.2958],
			[51.4266, 2.8564],
			[51.7542, 2.1093]
		],
		[
			[48.0193, -2.8125],
			[46.3165, -2.8564],
			[44.9336, -1.0107],
			[44.5278, 1.582],
			[44.8714, 3.7353],
			[45.8287, 5.1855],
			[48.1953, 5.1416]
		],
		[
			[45.9205, 0.4394],
			[46.7699, 0.9228],
			[47.6061, 2.5488],
			[47.754, 3.3837]
		]
	]
	let plArray = []
	for (let i = 0; i < multiCoords1.length; i++) {
		plArray.push(L.polyline(multiCoords1[i]).addTo(map!))
	}
	;(L as any)
		.polylineDecorator(multiCoords1, {
			patterns: [
				{
					offset: 25,
					repeat: 50,
					symbol: (L as any).Symbol.arrowHead({ pixelSize: 15, pathOptions: { fillOpacity: 1, weight: 0 } })
				}
			]
		})
		.addTo(map)
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
