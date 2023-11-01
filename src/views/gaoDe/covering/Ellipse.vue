<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="add">新增</el-button>
			<el-button type="primary" @click="edit">编辑</el-button>
			<el-button type="primary" @click="save">保存</el-button>
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
let aMap: any
let ellipseEditor: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.EllipseEditor"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			ellipseEditor = new AMap.EllipseEditor(map, null)

			ellipseEditor.on("addnode", function (e: any) {
				console.log("addnode", e)
			})

			ellipseEditor.on("adjust", function (e: any) {
				console.log("adjust", e)
			})

			ellipseEditor.on("removenode", function (e: any) {
				console.log("removenode", e)
			})

			ellipseEditor.on("add", function (e: any) {
				console.log("add", e)
			})

			ellipseEditor.on("end", function (e: any) {
				console.log("end", e)
			})

			addEllipse()
		})
		.catch(e => {
			console.log(e)
		})
}

let ellipse: AMap.Ellipse
const addEllipse = () => {
	ellipse = new aMap.Ellipse({
		center: [116.433322, 39.900255],
		radius: [2000, 1000], //半径
		borderWeight: 3,
		strokeColor: "#FF33FF",
		strokeOpacity: 1,
		strokeWeight: 6,
		fillOpacity: 0.4,
		// 线样式还支持 'dashed'
		strokeStyle: "dashed",
		strokeDasharray: [10, 10],
		fillColor: "#1791fc",
		zIndex: 50
	})
	map.add(ellipse)
	map.setFitView([ellipse])
}

const add = () => {
	ellipseEditor.setTarget()
	ellipseEditor.open()
}

const edit = () => {
	ellipseEditor.setTarget(ellipse)
	ellipseEditor.open()
}

const save = () => {
	ellipseEditor.close()
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
