<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "@utils/leaflet/L.Polyline.SnakeAnim.js"
import "@ansur/leaflet-pulse-icon"
import "@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.49042257014283, 118.1147165936993]
	map.setView(center_point, 12)

	addMovingPolyline()
})

const addMovingPolyline = () => {
	const polylineJson: any = {
		xys: [
			[24.445696, 118.081398],
			[24.449644, 118.08629],
			[24.453678, 118.100882],
			[24.45857, 118.105087],
			[24.462605, 118.106546],
			[24.464321, 118.111181],
			[24.466381, 118.119764],
			[24.471016, 118.124657],
			[24.478054, 118.125],
			[24.483891, 118.125515],
			[24.490242, 118.13015],
			[24.502258, 118.133583],
			[24.510326, 118.132381],
			[24.519939, 118.132725],
			[24.528694, 118.12191]
		],
		option: {
			color: "blue",
			weight: "4"
		}
	}

	const polyline = addPolyline(polylineJson)
	polyline.bindPopup("这是动态线")
	/**
	 * 第一个参数：是否居中移动
	 * 第二个参数：移动marker
	 * 第三个参数：移动速度（单位：像素）
	 */
	;(polyline as any).snakeIn(true, 50)
	//线移动事件
	polyline.on("snake", function () {})
	polyline.on("snakeend", function () {
		console.log("画线结束")
	})
}

const addPolyline = (polylineJson: any) => {
	const polyline = L.polyline(polylineJson.xys, polylineJson.option)
	polyline.addTo(map!)
	return polyline
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
