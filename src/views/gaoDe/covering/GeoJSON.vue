<template>
	<div class="main">
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import axios from "axios"

let mapData: any
onMounted(async () => {
	mapData = await readFile()

	initMap()
})

let map: AMap.Map
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.GeoJSON"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [118.11471659369913, 24.62242257014283],
				zoom: 10
			})

			let geojson = new AMap.GeoJSON({
				geoJSON: mapData,
				// 还可以自定义getMarker和getPolyline
				getPolygon: function (geojson: any, lnglats: any[]) {
					// 计算面积
					let area = AMap.GeometryUtil.ringArea(lnglats[0])

					return new AMap.Polygon({
						path: lnglats,
						fillOpacity: 1 - Math.sqrt(area / 8000000000), // 面积越大透明度越高
						strokeColor: "white",
						fillColor: "red"
					})
				}
			})
			map.add(geojson)
		})
		.catch(e => {
			console.log(e)
		})
}

//文件数据读取
const readFile = async () => {
	const res = await axios.get("./json/xiamen.json")
	return res.data
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 250px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
