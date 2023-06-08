<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "leaflet-minimap"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map").setView([24.522422570142833, 118.11471659369913], 13)
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}").addTo(map)

	let gaoDe = L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		minZoom: 0,
		maxZoom: 13
	})
	new (L.Control as any).MiniMap(gaoDe, { toggleDisplay: true }).addTo(map)
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
