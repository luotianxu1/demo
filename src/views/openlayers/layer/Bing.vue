<template>
	<div class="main">
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import Tile from "ol/layer/Tile" // 瓦片加载器
import View from "ol/View"
import BingMaps from "ol/source/BingMaps"

onMounted(() => {
	initMap()
})

let map
let view
const key = "Q57tupj2UBsQNQdju4xL~xBceblfTd6icjljunbuaCw~AhwA-whmGMsfIpVhslZyknWhFYq-GvWJZqBnqV8Zq1uRlI5YM_qr7_hxvdgnU7nH"
const layer = new Tile({
	source: new BingMaps({ key: key, imagerySet: "Road" })
})

const initMap = () => {
	view = new View({
		center: [12950000, 4860000], // 中心点坐标
		zoom: 6
	})
	map = new Map({
		target: "map",
		layers: [layer],
		view: view
	})
}
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.map {
		flex: 1;
	}
}
</style>
