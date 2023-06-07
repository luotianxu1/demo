<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "../../../../node_modules/leaflet.browser.print/dist/leaflet.browser.print.min.js"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map", {
		center: [39.077514, 117.713544], // 地图中心
		zoom: 18, //缩放比列
		scrollWheelZoom: true // 允许鼠标滚轮缩放地图
	})
	L.tileLayer("http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=55b4d4eaef95384c946e9bd1b99c5610").addTo(map)
	;(L.control as any).browserPrint({ position: "topleft", title: "Print" }).addTo(map)
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
