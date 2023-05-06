//map.vue

<template>
	<div id="map" ref="map"></div>
</template>

<script setup lang="ts">
import * as L from "leaflet"
import type { LatLngExpression } from "leaflet"
import proj4 from "proj4"
import proj4leaflet from "proj4leaflet"

let map: L.Map | null = null
onMounted(() => {
	//投影参数
	const crs = new L.Proj.CRS(
		"EPSG:900913",
		"+proj=merc +a=6378206 +b=6356584.314245179 +lat_ts=0.0 +lon_0=0.0 +x_0=0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",
		{
			resolutions: [262144, 131072, 65536, 32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
			origin: [0, 0],
			bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
		}
	)
	map = L.map("map", { crs: crs })
	L.tileLayer("http://online0.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1", {
		maxZoom: 12,
		attribution: "© OpenStreetMap",
		tms: true
	}).addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 12)
})
</script>

<style>
#map {
	width: 100%;
	height: 100%;
}
</style>
