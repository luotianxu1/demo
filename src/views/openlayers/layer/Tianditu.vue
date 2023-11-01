<template>
	<div class="main">
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import Tile from "ol/layer/Tile" // 瓦片加载器
import View from "ol/View"
import XYZ from "ol/source/XYZ"

onMounted(() => {
	initMap()
})

let map
let view

const initMap = () => {
	view = new View({
		center: [12950000, 4860000], // 中心点坐标
		zoom: 6
	})
	map = new Map({
		target: "map",
		layers: [
			//加载瓦片图层数据
			new Tile({
				source: new XYZ({
					url: "http://t0.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=518f2364222882244bfe0b5bd8c17faa",
					wrapX: false
				})
			})
		],
		view: view
	})
}
</script>

<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.map {
		flex: 1;
	}
}
</style>
