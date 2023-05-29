<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "leaflet-draw"

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

	//初始化绘制控件
	let drawControl = new (L.Control as any).Draw({
		position: "topright", //控件位置 'topleft'(默认), 'topright', 'bottomleft' or 'bottomright'
		draw: {
			polyline: true,
			polygon: true,
			rectangle: true,
			circle: true,
			marker: true
		}
	}).addTo(map)
	//.addTo(this.map);// 要添加到 L.map 对象中
	// 添加绘制完监听事件
	map.on((L as any).Draw.Event.CREATED, drawCreatedBack)
})

let drawLayerGrounp: any
// 交互绘制回调
const drawCreatedBack = (e: any) => {
	// 绘制的图形图层对象
	let drawLayer = e.layer
	// 判断当前没有图层组，需先添加
	if (!drawLayerGrounp) {
		//图层组
		drawLayerGrounp = new L.FeatureGroup()
		// 添加
		map!.addLayer(drawLayerGrounp)
	}
	// 添加到图层组
	drawLayerGrounp.addLayer(drawLayer)
}
</script>
<style lang="scss" scoped>
// @import "~leaflet-draw/dist/leaflet.draw.css";
@import "../../../../node_modules/leaflet-draw/dist/leaflet.draw.css";
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
