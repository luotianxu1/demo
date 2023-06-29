<template>
	<div class="main">
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

onMounted(() => {
	initMap()
})

let map: AMap.Map
let m1: AMap.Marker
let m2: AMap.Marker
let line: AMap.Polyline
let text: AMap.Text
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: []
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			// 两点间距离
			m1 = new AMap.Marker({
				map: map,
				draggable: true,
				position: new AMap.LngLat(116.368904, 39.923423)
			})
			m2 = new AMap.Marker({
				map: map,
				draggable: true,
				position: new AMap.LngLat(116.387271, 39.922501)
			})
			map.setFitView()
			line = new AMap.Polyline({
				strokeColor: "#80d8ff",
				isOutline: true,
				outlineColor: "white"
			})
			line.setMap(map)
			text = new AMap.Text({
				anchor: "bottom-center",
				text: "",
				style: { "background-color": "#29b6f6", "border-color": "#e1f5fe", "font-size": "12px" }
			})
			text.setMap(map)
			computeDis()
			m1.on("dragging", computeDis)
			m2.on("dragging", computeDis)
		})
		.catch(e => {
			console.log(e)
		})
}

// 计算距离
const computeDis = () => {
	let p1 = m1.getPosition()
	let p2 = m2.getPosition()
	let textPos = p1!.divideBy(2).add(p2!.divideBy(2))
	let distance = Math.round(p1!.distance(p2!))
	let path = [p1, p2]
	line.setPath(path as AMap.LngLatLike[])
	text.setText("两点相距" + distance + "米")
	text.setPosition(textPos as any)
}
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.btnList {
		width: 200px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		overflow: auto;
		padding: 5px;
	}

	.map {
		flex: 1;
	}
}
</style>
