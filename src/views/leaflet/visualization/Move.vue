<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "leaflet.animatedmarker/src/AnimatedMarker"

let map: L.Map | null = null
let markers: L.Marker[] = []
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 18,
		minZoom: 3,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	map.setView(L.latLng(30.5217, 114.3948), 18)

	let routeLines = [
		L.polyline([
			[30.52295, 114.39583],
			[30.52295, 114.39447],
			[30.5226, 114.39447]
		]),
		L.polyline([
			[30.52134, 114.39333],
			[30.52134, 114.39478],
			[30.52096, 114.39478]
		]),
		L.polyline([
			[30.52243, 114.39332],
			[30.52194, 114.39332],
			[30.52194, 114.39444]
		])
	]
	console.log(routeLines)
	routeLines.forEach(item => {
		let marker = (L as any).animatedMarker(item.getLatLngs(), {
			//开启移动状态
			autoStart: false
		})
		//在新位置添加标注
		map!.addLayer(marker)
		markers.push(marker)
	})

	for (let i = 0; i < markers.length; i++) {
		//调用start方法，开始移动
		;(markers[i] as any).start()
	}
})
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
