<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "leaflet.magnifyingglass"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map", {
		center: [39.077514, 117.713544], // 地图中心
		zoom: 18, //缩放比列
		scrollWheelZoom: true // 允许鼠标滚轮缩放地图
	})
	L.tileLayer("http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=55b4d4eaef95384c946e9bd1b99c5610").addTo(map)

	let imgLayer = L.tileLayer("http://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=55b4d4eaef95384c946e9bd1b99c5610")
	;(L as any)
		.magnifyingGlass({
			//设置放大镜中显示的图层
			layers: [imgLayer]
			//探查半径
			// radius: 100,
			//设置放大镜中图层级数和主图层的级数差（0表示同级）
			// zoomOffset: 5
		})
		.addTo(map)
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
