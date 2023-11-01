<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="drawMarkerTest">放置点</el-button>
		</div>
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import axios from "axios"
import * as turf from "@turf/turf"

let map: L.Map | null = null
let xiamenjson: any
onMounted(async () => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.507455675371375, 118.15418243408205]
	map.setView(center_point, 12)
	xiamenjson = await readFile()

	let geoMapTileLayer = L.geoJSON(xiamenjson, {
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

let testMarker: any = null
const drawMarkerTest = () => {
	if (testMarker !== null) {
		map!.removeLayer(testMarker)
		testMarker = null
	}
	map!.on("click", function (e) {
		let gatherIcon = L.icon({
			iconUrl: "img/map/map-point.png",
			iconAnchor: [16, 16], //坐标固定在图标的哪个点，[0,0]表示图标的左上角
			iconSize: [32, 32]
		})
		let gather_marker_layer: any = L.marker([e.latlng.lat, e.latlng.lng], {
			icon: gatherIcon,
			draggable: true
		})
		gather_marker_layer.on("drag", function () {
			gather_marker_layer.xy = gather_marker_layer._latlng
			markerReceiver(gather_marker_layer)
		})

		gather_marker_layer.addTo(map!)
		map!.off("click") //移除所有监听对象
	})
}

const markerReceiver = (markerObj: any) => {
	testMarker = markerObj
	console.log("上图的对象", markerObj)
	console.log("采集坐标：", markerObj.xy)
	let lat = markerObj.xy.lat
	let lng = markerObj.xy.lng

	let pt = turf.point([lng, lat])
	let judgeFlag = turf.booleanPointInPolygon(pt, xiamenjson.features[0])
	console.log(judgeFlag)
}

//文件数据读取
const readFile = async () => {
	const res = await axios.get("./json/xiamen.json")
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
