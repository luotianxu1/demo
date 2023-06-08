<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "proj4"
import "proj4leaflet"
import "@utils/leaflet/leaflet.ChineseTmsProviders.js"
import "@utils/leaflet/leaflet.mapCorrection.js"

let map: L.Map | null = null
onMounted(() => {
	let map = L.map("map", {
		center: [39.90553, 116.391305],
		zoom: 17
	})

	//添加底图
	;(L.tileLayer as any).chinaProvider("GaoDe.Normal.Map").addTo(map)

	//设置参照物
	L.marker([39.90553, 116.391305]).addTo(map).bindPopup("<p>我是WGS84坐标下，天安门广场国旗所在位置</p>").openPopup()
})
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
