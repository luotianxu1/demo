<template>
	<div class="main">
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import Map from "ol/Map"
import Tile from "ol/layer/Tile" // 瓦片加载器
import View from "ol/View"
import TileGrid from "ol/tilegrid/TileGrid"
import TileImage from "ol/source/TileImage"

onMounted(() => {
	initMap()
})

let map
let view

let resolutions = []
let baiduX, baiduY
for (let i = 0; i < 19; i++) {
	resolutions[i] = Math.pow(2, 18 - i)
}
let tilegrid = new TileGrid({
	origin: [0, 0],
	resolutions: resolutions
})

let baidu_source = new TileImage({
	projection: "EPSG:3857",
	tileGrid: tilegrid,
	tileUrlFunction: function (tileCoord) {
		if (!tileCoord) return ""
		let z = tileCoord[0]
		let x = tileCoord[1]
		let y = tileCoord[2]
		// 对编号xy处理
		baiduX = x < 0 ? x : "M" + -x
		baiduY = -y
		return (
			"http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" +
			baiduX +
			"&y=" +
			baiduY +
			"&z=" +
			z +
			"&styles=pl&udt=20151021&scaler=1&p=1"
		)
	}
})

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
				source: baidu_source
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
