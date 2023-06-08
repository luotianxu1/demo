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

	let drawnItems = new L.FeatureGroup()
	map.addLayer(drawnItems)

	//初始化绘制控件
	let drawControl = new (L.Control as any).Draw({
		position: "topleft", //控件位置 'topleft'(默认), 'topright', 'bottomleft' or 'bottomright'
		draw: {
			rectangle: { showArea: false }, // disable showArea
			polyline: true,
			polygon: true,
			circlemarker: true,
			circle: true,
			marker: true
		},
		edit: {
			//绘制图层
			featureGroup: drawnItems,
			//图形删除控件
			remove: true
		}
	})

	map.addControl(drawControl)

	map.on((L as any).Draw.Event.CREATED, function (e) {
		drawnItems.addLayer(e.layer)
	})

	map.on((L as any).Draw.Event.EDITED, function (e: any) {
		console.log(e)
		console.log(e.layers)
	})
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
