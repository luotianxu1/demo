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
let polygon1: AMap.Polygon
let polygon2: AMap.Polygon
let textBox: AMap.Text
const path1 = [
	[116.376907, 39.910967],
	[116.384911, 39.919505],
	[116.40109, 39.919728],
	[116.411132, 39.911408],
	[116.412076, 39.899135],
	[116.402292, 39.892353],
	[116.3874, 39.892518],
	[116.376971, 39.899267]
]
const path2 = [
	[116.390233, 39.906602],
	[116.395254, 39.908668],
	[116.400661, 39.906667],
	[116.400962, 39.898589],
	[116.395769, 39.894855],
	[116.390147, 39.898049]
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

			polygon1 = new AMap.Polygon({
				map: map,
				fillColor: "blue",
				fillOpacity: 0.3,
				path: path1
			})
			polygon2 = new AMap.Polygon({
				map: map,
				fillColor: "red",
				fillOpacity: 0.3,
				path: path2,
				draggable: true
			})
			textBox = new AMap.Text({
				map: map,
				position: new AMap.LngLat(116.40109, 39.919728),
				offset: new AMap.Pixel(-20, -40),
				style: {
					"background-color": "yellow",
					border: "solid 1px #0088ff",
					padding: "10px 20px"
				}
			})
			map.setFitView()

			compute()
			polygon2.on("dragging", compute)
		})
		.catch(e => {
			console.log(e)
		})
}

const compute = () => {
	const polygon1_path = polygon1.getPath()
	const polygon2_path = polygon2.getPath()
	// 小圈是否在大圈内
	const isRingInRing = aMap.GeometryUtil.isRingInRing(polygon2_path, polygon1_path)
	// 两圈是否交叉
	const doesRingRingIntersect = aMap.GeometryUtil.doesRingRingIntersect(polygon2_path, polygon1_path)
	const ringRingClip = aMap.GeometryUtil.ringRingClip(polygon2_path, polygon1_path)
	const ringArea = parseInt(aMap.GeometryUtil.ringArea(ringRingClip))

	let text = "两圈关系：在大圈外"
	if (isRingInRing) {
		text = "两圈关系：在大圈内"
	} else if (doesRingRingIntersect) {
		text = "两圈关系：两圈相交, 交叉区域面积为" + ringArea + "平方米"
	}
	textBox.setText(text)
}
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	width: 100%;
	display: flex;

	.map {
		height: 100%;
		width: 100%;
	}

	.btn {
		width: 320px;
		padding: 10px;
		display: flex;
		flex-direction: column;

		.el-button {
			margin: 0 0 5px 0;
		}
	}
}
</style>
