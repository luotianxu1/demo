<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import View from "ol/View"
import OSM from "ol/source/OSM"
import TileLayer from "ol/layer/Tile"

onMounted(() => {
	initMap()
})

let map

const initMap = () => {
	map = new Map({
		target: "map",
		layers: [
			new TileLayer({
				source: new OSM()
			})
		],
		view: new View({
			center: [328627.563458, 5921296.662223], // 中心点坐标
			zoom: 10, // 缩放等级
			minZoom: 9,
			maxZoom: 13,
			extent: [-572513.341856, 5211017.966314, 916327.095083, 6636950.728974]
		})
	})
}
</script>

<style lang="scss" scoped>
#map {
	width: 100vw;
	height: 100vh;
}
</style>
