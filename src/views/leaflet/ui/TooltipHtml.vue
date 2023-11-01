<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)

	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 3)

	addTooltip()
})

const addTooltip = () => {
	let marker = L.marker([24.522422570142833, 118.11471659369913])
	marker.addTo(map!)
	//绑定气泡框内容
	let html = "<div style='color:blue;200px;height:200px;width:200px;'>tooltip内容</div>"
	marker.bindTooltip(html, { direction: "top", offset: [0, 0], permanent: false, opacity: 1, sticky: false })
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
