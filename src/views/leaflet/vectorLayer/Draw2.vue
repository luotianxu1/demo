<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "@geoman-io/leaflet-geoman-free"

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

	map.pm.setLang("zh")
	map.pm.addControls({
		position: "topleft"
	})

	// 绘制事件监听
	map.on("pm:drawstart", e => {
		console.log(e, "绘制开始第一个点")
	})
	map.on("pm:drawend", e => {
		console.log(e, "禁⽌绘制、绘制结束")
	})
	map.on("pm:create", e => {
		console.log(e, "绘制完成时调⽤")
	})
})
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100%;

	#map {
		flex: 1;
	}
}
</style>
