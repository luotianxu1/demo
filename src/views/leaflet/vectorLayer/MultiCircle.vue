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

	addMultiCircle()
})

const addMultiCircle = () => {
	//设置圆心坐标
	let latLng = L.latLng(30.5217, 114.3948)
	//初始半径
	let r = 65
	for (let i = 0; i < 5; i++) {
		//添加圆
		L.circle(latLng, {
			//圆半径
			radius: r,
			//颜色
			color: "#ffcc33",
			//填充色
			fillColor: "white",
			//填充色透明度
			fillOpacity: 0.8
		}).addTo(map!)
		//调整半径大小
		r = r / 1.5
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
