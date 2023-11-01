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
let polygon: AMap.Polygon
let path = [
	[116.169465, 39.93267],
	[116.16026, 39.924492],
	[116.186138, 39.879817],
	[116.150625, 39.710019],
	[116.183198, 39.70992],
	[116.22695, 39.777616],
	[116.421078, 39.810771],
	[116.442621, 39.799892],
	[116.463478, 39.790066],
	[116.588276, 39.809551],
	[116.536091, 39.808859],
	[116.573856, 39.839643],
	[116.70638, 39.91674],
	[116.657285, 39.934545],
	[116.600293, 39.93777],
	[116.540039, 39.937968],
	[116.514805, 39.982375],
	[116.499935, 40.01371],
	[116.54652, 40.030443],
	[116.687668, 40.129961],
	[116.539697, 40.080659],
	[116.50339, 40.058474],
	[116.4688, 40.052578]
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

			polygon = new AMap.Polygon({
				map: map,
				fillOpacity: 0.4,
				path: path
			})
			marker = new AMap.Marker({
				map: map,
				draggable: true,
				position: [116.377904, 39.915423]
			})
			map.setFitView([polygon, marker])

			compute()
			marker.on("dragging", compute)
		})
		.catch(e => {
			console.log(e)
		})
}

const compute = () => {
	let point = marker.getPosition()
	let isPointInRing = aMap.GeometryUtil.isPointInRing(point, path)
	marker.setLabel({
		direction: "",
		content: isPointInRing ? "内部" : "外部",
		offset: new aMap.Pixel(20, 0)
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
