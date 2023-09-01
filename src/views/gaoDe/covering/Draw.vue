<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="drawPolyline">绘制折线</el-button>
			<el-button type="primary" @click="drawPolygon">绘制多边形</el-button>
			<el-button type="primary" @click="drawRectangle">绘制矩形</el-button>
			<el-button type="primary" @click="drawCircle">绘制圆</el-button>
		</div>
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
let mouseTool: AMap.MouseTool
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.MouseTool"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			mouseTool = new AMap.MouseTool(map)
			mouseTool.on("draw", function (event) {
				// event.obj 为绘制出来的覆盖物对象
				console.log(event.obj.getPath())
			})
		})
		.catch(e => {
			console.log(e)
		})
}

const drawPolyline = () => {
	mouseTool.polyline({
		strokeColor: "#3366FF",
		strokeOpacity: 1,
		strokeWeight: 6,
		// 线样式还支持 'dashed'
		strokeStyle: "solid"
		// strokeStyle是dashed时有效
		// strokeDasharray: [10, 5],
	})
}

const drawPolygon = () => {
	mouseTool.polygon({
		strokeColor: "#FF33FF",
		strokeOpacity: 1,
		strokeWeight: 6,
		fillColor: "#1791fc",
		fillOpacity: 0.4,
		// 线样式还支持 'dashed'
		strokeStyle: "solid"
		// strokeStyle是dashed时有效
		// strokeDasharray: [30,10],
	})
}

const drawRectangle = () => {
	mouseTool.rectangle({
		strokeColor: "red",
		strokeOpacity: 0.5,
		strokeWeight: 6,
		fillColor: "blue",
		fillOpacity: 0.5,
		// strokeStyle还支持 solid
		strokeStyle: "solid"
		// strokeDasharray: [30,10],
	})
}

const drawCircle = () => {
	mouseTool.circle({
		strokeColor: "#FF33FF",
		strokeOpacity: 1,
		strokeWeight: 6,
		fillColor: "#1791fc",
		fillOpacity: 0.4,
		strokeStyle: "solid"
		// 线样式还支持 'dashed'
		// strokeDasharray: [30,10],
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
