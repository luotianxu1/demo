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

const path: AMap.LngLatLike[] = [
	[116.368904, 39.913423],
	[116.382122, 39.901176],
	[116.387271, 39.912501],
	[116.398258, 39.9046]
]
let map
let marker: AMap.Marker
let marker2: AMap.Marker
let polyline2: AMap.Polyline
let text: AMap.Text
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0"
	})
		.then(AMap => {
			map = new AMap.Map("map", {
				resizeEnable: true,
				zoom: 13 //地图显示的缩放级别
			})
			if (!map) {
				return
			}

			let pos = [116.377904, 39.915423]
			marker = new AMap.Marker({
				draggable: true,
				position: pos
			})
			map.add(marker)

			let polyline = new AMap.Polyline({
				path: path,
				strokeColor: "#80d8ff"
			})
			map.add(polyline)
			map.setFitView([polyline, marker])

			polyline2 = new AMap.Polyline({
				strokeStyle: "dashed",
				strokeColor: "blue",
				strokeWeight: 2
			})
			map.add(polyline2)
			text = new AMap.Text({
				text: "",
				style: {
					"background-color": "#ccccff",
					"border-color": "green",
					"font-size": "12px"
				}
			})
			map.add(text)
			marker2 = new AMap.Marker({
				icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
				offset: new AMap.Pixel(-9, -31)
			})
			map.add(marker2)

			compute()
			marker.on("dragging", compute)
		})
		.catch(e => {
			console.log(e)
		})
}

const compute = () => {
	// 计算
	let data: any = marker.getPosition()
	let closestPositionOnLine: any = AMap.GeometryUtil.closestOnLine(data, path)
	marker2.setPosition(closestPositionOnLine as any)
	// 设置label标签
	marker2.setLabel({
		direction: "",
		offset: new AMap.Pixel(5, 0),
		content: "折线上离蓝色点最近的点"
	})
	polyline2.setPath([data, closestPositionOnLine])

	let distance = Math.round(AMap.GeometryUtil.distanceToLine(data, path))
	let textPos: any = [(data.lng + closestPositionOnLine[0]) / 2, (data.lat + closestPositionOnLine[1]) / 2]

	text.setPosition(textPos)
	text.setText("点线距离" + distance + "米")
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
