<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import Tile from "ol/layer/Tile" // 瓦片加载器
import XYZ from "ol/source/XYZ" // 引入XYZ地图格式
import View from "ol/View"

onMounted(() => {
	initMap()
})

let map

const initMap = () => {
	map = new Map({
		target: "map",
		layers: [
			new Tile({
				source: new XYZ({
					url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
				})
			})
		],
		view: new View({
			center: [113.300839, 23.048857], // 中心点坐标
			zoom: 10, // 缩放等级
			projection: "EPSG:4326" // 坐标系
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
