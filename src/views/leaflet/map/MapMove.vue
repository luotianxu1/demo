<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import * as L from "leaflet"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map", {
		center: [24.522422570142833, 118.11471659369913], //地图初始化时的中心点位置
		zoom: 12, //地图初始化时的缩放等级
		minZoom: 1, //地图的最小缩放级别。
		maxZoom: 20 //地图的最大缩放级别。
	})
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 20,
		minZoom: 1,
		attribution: "© OpenStreetMap"
	}).addTo(map)

	addMapEvent()
})

const intervalPixel = 200 //设置的移动像素距离
let lastCenter: L.LatLngExpression //上一个发起请求动作移动时保留的中心点信息

const addMapEvent = () => {
	lastCenter = map!.getCenter()
	map!.on("moveend", moveEventCallBack)
}

const moveEventCallBack = () => {
	if (!map) {
		return
	}
	//每次移动时得到新的中心点
	let newCurrentCenter = map.getCenter()
	let currentPixelCenter = map.latLngToContainerPoint(newCurrentCenter)
	//上一个中心点所对应得像素位置
	let lastPixelCenter = map.latLngToContainerPoint(lastCenter)
	console.log("------------------")
	console.log("currentPixelCenter", currentPixelCenter)
	console.log("lastPixelCenter", lastPixelCenter)
	let xdi = currentPixelCenter.x - lastPixelCenter.x
	let ydi = currentPixelCenter.y - lastPixelCenter.y
	let value = Math.pow(xdi * xdi + ydi * ydi, 0.5) //空间距离判断
	console.log("中心点已移动像素距离：", value)
	if (value > intervalPixel) {
		//重新赋值请求动作时的中心点
		lastCenter = newCurrentCenter
		console.log("大于所设置的像素距离(200px),发起请求动作，请求中。。。")
	} else {
		console.log("小于所设置的像素距离(200px),不发起请求动作")
	}
	console.log("地图边界", map.getBounds())
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
