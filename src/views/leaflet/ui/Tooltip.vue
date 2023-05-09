<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
let marker: L.Marker | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 3)

	marker = L.marker([50.5, 30.5]).bindTooltip("132", {
		pane: "tooltipPane", //地图窗格将添加 Tooltip 的位置。
		offset: [0, 0], //Tooltip 位置的可选偏移。
		direction: "auto", //打开 Tooltip 的方向。可能的值有：right、left、 top、bottom、center、auto。 auto 将之间进行动态切换 right 和 left 根据地图上的工具提示位置。
		permanent: false, //是永久打开 Tooltip 还是只在鼠标移动时打开。
		sticky: false, //如果为 true，Tooltip 将跟随鼠标移动，而不是固定在特征中心。
		opacity: 0.9, //Tooltip 容器透明度。
		interactive: false, //如果为 true，popup/tooltip 将监听鼠标事件。
		className: "tooltipPane" //为 Overlayer 设置自定义 CSS 类名称。
	})
	map.addLayer(marker)
})
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	display: flex;

	.btnList {
		width: 255px;
		display: flex;
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
