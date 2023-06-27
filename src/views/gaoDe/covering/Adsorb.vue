<template>
	<div class="main">
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

const path1 = [
	[116.475334, 39.997534],
	[116.476627, 39.998315],
	[116.478603, 39.99879],
	[116.478529, 40.000296],
	[116.475082, 40.000151],
	[116.473421, 39.998717]
]
const path2 = [
	[116.474595, 40.001321],
	[116.473526, 39.999865],
	[116.476284, 40.000917]
]

onMounted(async () => {
	initMap()
})

let map: AMap.Map
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.PolygonEditor"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [118.11471659369913, 24.62242257014283],
				zoom: 10
			})

			let polygon1 = new AMap.Polygon({
				path: path1
			})
			let polygon2 = new AMap.Polygon({
				path: path2
			})
			map.add([polygon1, polygon2])
			map.setFitView()

			let polyEditor = new AMap.PolygonEditor(map)
			polyEditor.addAdsorbPolygons([polygon1, polygon2])
			polyEditor.setTarget(polygon2)
			polyEditor.open()

			polyEditor.on("add", function (data: any) {
				let polygon = data.target
				polyEditor.addAdsorbPolygons(polygon)
				polygon.on("dblclick", () => {
					polyEditor.setTarget(polygon)
					polyEditor.open()
				})
			})
			polygon1.on("dblclick", () => {
				polyEditor.setTarget(polygon1)
				polyEditor.open()
			})
			polygon2.on("dblclick", () => {
				polyEditor.setTarget(polygon2)
				polyEditor.open()
			})
		})
		.catch(e => {
			console.log(e)
		})
}
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.btnList {
		width: 250px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		overflow: auto;
	}

	.map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
