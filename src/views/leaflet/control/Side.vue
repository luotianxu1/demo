<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "leaflet-side-by-side"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map", {
		center: [39.077514, 117.713544], // 地图中心
		zoom: 18, //缩放比列
		scrollWheelZoom: true // 允许鼠标滚轮缩放地图
	})

	let vecLayer = L.tileLayer(
		"http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=55b4d4eaef95384c946e9bd1b99c5610",
		{ noWrap: true }
	).addTo(map)
	let imgLayer = L.tileLayer(
		"http://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=55b4d4eaef95384c946e9bd1b99c5610",
		{ noWrap: true }
	).addTo(map)
	;(L.control as any).sideBySide(vecLayer, imgLayer).addTo(map)
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
