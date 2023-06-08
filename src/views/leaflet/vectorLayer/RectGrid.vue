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
		crs: L.CRS.EPSG3857,
		center: [30.5217, 114.3948],
		minZoom: 1,
		maxZoom: 18,
		zoom: 18
	})
	//加载天地图矢量图层
	L.tileLayer("http://t0.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=55b4d4eaef95384c946e9bd1b99c5610").addTo(map)
	//加载天地图矢量注记图层
	L.tileLayer("http://t0.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=55b4d4eaef95384c946e9bd1b99c5610").addTo(map)

	addRectGrid()
})

const addRectGrid = () => {
	//绘制经线
	for (let i = 0; i < 11; i++) {
		L.polyline(
			[
				[30.5207, 114.3938 + i * 0.0002],
				[30.5227, 114.3938 + i * 0.0002]
			],
			{ color: "red" }
		).addTo(map!)
	}
	//绘制纬线
	for (let j = 0; j < 11; j++) {
		L.polyline(
			[
				[30.5207 + j * 0.0002, 114.3938],
				[30.5207 + j * 0.0002, 114.3958]
			],
			{ color: "red" }
		).addTo(map!)
	}
}
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	display: flex;

	#map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
