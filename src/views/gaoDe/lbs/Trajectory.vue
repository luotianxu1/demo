<template>
	<div class="main">
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

const pathParam = [
	{ x: 116.478928, y: 39.997761, sp: 19, ag: 0, tm: 1478031031 },
	{ x: 116.478907, y: 39.998422, sp: 10, ag: 0, tm: 2 },
	{ x: 116.479384, y: 39.998546, sp: 10, ag: 110, tm: 3 },
	{ x: 116.481053, y: 39.998204, sp: 10, ag: 120, tm: 4 },
	{ x: 116.481793, y: 39.997868, sp: 10, ag: 120, tm: 5 },
	{ x: 116.482898, y: 39.998217, sp: 10, ag: 30, tm: 6 },
	{ x: 116.483789, y: 39.999063, sp: 10, ag: 30, tm: 7 },
	{ x: 116.484674, y: 39.999844, sp: 10, ag: 30, tm: 8 }
]

onMounted(() => {
	initMap()
})

let map: AMap.Map
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.GraspRoad"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			let path1 = []
			for (let i = 0; i < pathParam.length; i += 1) {
				path1.push([pathParam[i].x, pathParam[i].y])
			}

			let oldLine = new AMap.Polyline({
				path: path1,
				strokeWeight: 8,
				strokeOpacity: 1,
				strokeColor: "red"
			})
			map.add(oldLine)

			let graspRoad = new AMap.GraspRoad()
			graspRoad.driving(pathParam, function (error: any, result: any) {
				if (!error) {
					let path2 = []
					let newPath = result.data.points
					for (let i = 0; i < newPath.length; i += 1) {
						path2.push([newPath[i].x, newPath[i].y])
					}
					let newLine = new AMap.Polyline({
						path: path2,
						strokeWeight: 8,
						strokeOpacity: 0.8,
						strokeColor: "#0091ea",
						showDir: true
					})
					map.add(newLine)
					map.setFitView()
				}
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

	.map {
		flex: 1;
	}
}
</style>
