<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import { antPath } from "leaflet-ant-path"

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

	addAntPath()
})

const addAntPath = () => {
	let antPathJson = {
		xys: [
			[24.445696, 118.081398],
			[24.449644, 118.08629],
			[24.453678, 118.100882],
			[24.45857, 118.105087],
			[24.462605, 118.106546],
			[24.464321, 118.111181],
			[24.466381, 118.119764],
			[24.471016, 118.124657],
			[24.478054, 118.125],
			[24.483891, 118.125515],
			[24.490242, 118.13015],
			[24.502258, 118.133583],
			[24.510326, 118.132381],
			[24.519939, 118.132725],
			[24.528694, 118.12191]
		],
		option: {
			color: "green", //线的颜色
			pulseColor: "white", //块颜色
			weight: "8", //线的宽度
			delay: "1000", //块的速度  数值越小，越快
			opacity: "0.8", //透明度
			dashArray: [10, 20], //间隔  [块的长度，块的间隔]
			paused: false //是否暂停
		}
	}
	let antPolyline = antPath(antPathJson.xys, antPathJson.option)
	antPolyline.bindPopup("蚂蚁线")
	antPolyline.addTo(map)
}
</script>
<style lang="scss">
#map {
	width: 100%;
	height: 100%;
}
</style>
