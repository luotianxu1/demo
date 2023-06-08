<template>
	<div class="main">
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngBoundsExpression } from "leaflet"
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

	addMultiRect()
})

const addMultiRect = () => {
	for (let i = 0; i < 8; i++) {
		//设置矩形的坐标范围
		let bounds: LatLngBoundsExpression = [
			[30.5207 + i * 0.000125, 114.3938 + i * 0.000125],
			[30.5227 - i * 0.000125, 114.3958 - i * 0.000125]
		]
		//将创建的矩形添加进图层
		L.rectangle(bounds, {
			//边线颜色
			color: "#ff7800",
			//线宽
			weight: 3,
			//填充色
			fillColor: "white",
			//透明度
			fillOpacity: 0
		}).addTo(map!)
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
