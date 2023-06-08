<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "leaflet-contextmenu"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map", {
		contextmenu: true,
		contextmenuWidth: 140,
		contextmenuItems: [
			{
				text: "Show coordinates",
				callback: showCoordinates
			},
			{
				text: "Center map here",
				callback: centerMap
			},
			"-",
			{
				text: "Zoom in",
				icon: "./img/map/zoom-in.png",
				callback: zoomIn
			},
			{
				text: "Zoom out",
				icon: "./img/map/zoom-out.png",
				callback: zoomOut
			}
		]
	} as any)
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 18,
		minZoom: 3,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	map.setView(L.latLng(30.5217, 114.3948), 18)
})

const showCoordinates = (e: any) => {
	alert(e.latlng)
}

const centerMap = (e: any) => {
	map!.panTo(e.latlng)
}

const zoomIn = (e: any) => {
	map!.zoomIn()
}

const zoomOut = (e: any) => {
	map!.zoomOut()
}
</script>
<style lang="scss">
#map {
	width: 100%;
	height: 100%;
}
</style>
