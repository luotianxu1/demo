<template>
	<div class="container">
		<div id="map" class="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

onMounted(() => {
	initMap()
})

let map: any
let aMap: any
let marker: AMap.Marker
let polyline: AMap.Polyline
let path = [
	[116.368904, 39.913423],
	[116.382122, 39.901176],
	[116.387271, 39.912501],
	[116.398258, 39.9046]
]

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0"
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("map", {
				resizeEnable: true,
				zoom: 13 //地图显示的缩放级别
			})

			polyline = new AMap.Polyline({
				map: map,
				path: path,
				strokeColor: "#80d8ff",
				strokeWeight: 5
			})
			marker = new AMap.Marker({
				map: map,
				draggable: true,
				position: [116.377904, 39.915423]
			})
			map.setFitView([polyline, marker])

			pointOnSegment()
			marker.on("dragging", pointOnSegment)
		})
		.catch(e => {
			console.log(e)
		})
}

const pointOnSegment = () => {
	let pos = marker.getPosition()
	// mp = getResolution() 获取指定位置的地图分辨率，单位：米/像素
	let mp = map.getResolution()
	// m 为Polyline宽度的米数
	let m = 5 * mp
	// 判断 marker 是否在线段上，最后一个参数为 m米 的误差
	let inLine = aMap.GeometryUtil.isPointOnSegment(pos, path[0], path[1], m)
	let text = "点不在第一条线段上"
	if (inLine) {
		text = "点在第一条线段上"
	}
	marker.setLabel({
		direction: "",
		offset: new aMap.Pixel(20, 20),
		content: text
	})
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	width: 100%;
	height: 100%;

	.map {
		width: 100%;
		height: 100%;
	}

	.btn {
		display: flex;
		width: 320px;
		padding: 10px;
		flex-direction: column;

		.el-button {
			margin: 0 0 5px 0;
		}
	}
}
</style>
