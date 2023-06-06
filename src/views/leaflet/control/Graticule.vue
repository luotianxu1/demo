<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import AutoGraticule from "leaflet-auto-graticule"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map", {
		center: [39.077514, 117.713544], // 地图中心
		zoom: 18, //缩放比列
		scrollWheelZoom: true // 允许鼠标滚轮缩放地图
	})
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}").addTo(map)
	new AutoGraticule().addTo(map)
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
