<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "@utils/leaflet/leaflet.measure.js"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map", {
		center: [39.077514, 117.713544], // 地图中心
		zoom: 18, //缩放比列
		scrollWheelZoom: true // 允许鼠标滚轮缩放地图
	})
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}").addTo(map)
	;(L as any).Measure = {
		linearMeasurement: "距离测量",
		areaMeasurement: "面积测量",
		start: "开始",
		meter: "m",
		kilometer: "km",
		squareMeter: "m²",
		squareKilometers: "km²"
	}
	;(L.control as any).measure({}).addTo(map)
})
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	display: flex;

	#map {
		flex: 1;
	}
}
</style>
