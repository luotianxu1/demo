<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "@geoman-io/leaflet-geoman-free"
import * as turf from "@turf/turf"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map", {
		center: [30.5217, 114.3948],
		minZoom: 1,
		maxZoom: 18,
		zoom: 18
	})
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}").addTo(map)

	map.pm.setLang("zh")
	map.pm.addControls({
		position: "topleft",
		drawPolygon: true, //绘制多边形
		drawMarker: false, //绘制标记点
		drawCircleMarker: false, //绘制圆形标记
		drawPolyline: true, //绘制线条
		drawRectangle: false, //绘制矩形
		drawCircle: true, //绘制圆圈
		editMode: true, //编辑多边形
		dragMode: true, //拖动多边形
		cutPolygon: true, //添加⼀个按钮以删除多边形⾥⾯的部分内容
		removalMode: true //清除多边形
	})

	map.pm.setPathOptions({
		color: "orange",
		fillColor: "green",
		fillOpacity: 0.4
	})

	map.on("pm:create", e => {
		//判断绘制结束之后是否为线
		if (e.shape === "Line") {
			//获取绘制线的geojson
			let geojson = (e.layer as any).toGeoJSON()

			//辐射30米
			let buffered = turf.buffer(geojson, 50, { units: "meters" })
			//辐射区添加到地图
			let bufferLayer = L.geoJSON(buffered, {
				pmIgnore: true
			})
			bufferLayer.addTo(map!)
		}
	})
})
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100%;

	#map {
		flex: 1;
	}
}
</style>
