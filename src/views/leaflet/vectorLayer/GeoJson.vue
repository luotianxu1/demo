<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import axios from "axios"

let map: L.Map | null = null
onMounted(async () => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.62242257014283, 118.11471659369913]
	map.setView(center_point, 11)
	let mapData = await readFile()
	console.log(mapData)

	let geoMapTileLayer = L.geoJSON(mapData, {
		style: {
			weight: 1,
			fillColor: getColor(),
			fillOpacity: 0.7,
			color: "rgba(255,255,255,0.65)"
		},
		onEachFeature: function (feature, layer) {
			console.log("feature", feature)
			console.log("layer", layer)
		}
	})

	geoMapTileLayer.addTo(map)
})

//文件数据读取
const readFile = async () => {
	const res = await axios.get("./leaflet/calculation/xiamen.json")
	return res.data
}

//随机获取颜色值
const getColor = () => {
	let colourstr = "#"
	let coloruarr = ["a", "b", "c", "d", "e", "f", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
	for (let p = 0; p < 6; p++) {
		let n = Math.floor(Math.random() * coloruarr.length + 1) - 1
		colourstr += coloruarr[n]
	}
	return colourstr
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100%;

	.btnList {
		display: flex;
		width: 255px;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	#map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
