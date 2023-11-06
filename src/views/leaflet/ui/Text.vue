<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 18,
		minZoom: 3,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [30.5217, 114.3948]
	map.setView(center_point, 4)

	let marker = L.marker([30.5217, 114.3948], {
		opacity: 0
	}).addTo(map)
	//添加tooltip标注
	marker
		.bindTooltip("文本标注", {
			//标注始终存在
			permanent: true,
			//显示位置
			direction: "right",
			//标注的css样式类名
			className: "tooltip"
		})
		.openTooltip()
})
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}

.tooltip {
	width: 60px;
	font: italic bold 16px/30px arial, sans-serif;
	color: red;
	text-align: center;
	border: 0;
}

.leaflet-tooltip {
	background-color: rgba(255, 255, 255, 0) !important;
	box-shadow: 0 0 0 rgba(255, 255, 255, 0) !important;
}

.leaflet-tooltip-right::before {
	border-right-color: rgba(255, 255, 255, 0) !important;
}
</style>
