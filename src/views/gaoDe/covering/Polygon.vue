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

const path = [
	[116.403322, 39.920255],
	[116.410703, 39.897555],
	[116.402292, 39.892353],
	[116.389846, 39.891365]
]

onMounted(() => {
	initMap()
})

let map: AMap.Map
let aMap: any
let polygonEditor: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.PolygonEditor"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			polygonEditor = new AMap.PolygonEditor(map, null)

			polygonEditor.on("addnode", function (e: any) {
				console.log("addnode", e)
			})

			polygonEditor.on("adjust", function (e: any) {
				console.log("adjust", e)
			})

			polygonEditor.on("removenode", function (e: any) {
				console.log("removenode", e)
			})

			polygonEditor.on("add", function (e: any) {
				console.log("add", e)
			})

			polygonEditor.on("end", function (e: any) {
				console.log("end", e)
			})

			addPolygon()
		})
		.catch(e => {
			console.log(e)
		})
}

let polygon: AMap.Polygon
const addPolygon = () => {
	polygon = new aMap.Polygon({
		path: path,
		strokeColor: "#FF33FF",
		strokeWeight: 6,
		strokeOpacity: 0.2,
		fillOpacity: 0.4,
		fillColor: "#1791fc",
		zIndex: 50,
		bubble: true
	})
	map.add([polygon])
	map.setFitView()
}

const add = () => {
	polygonEditor.setTarget()
	polygonEditor.open()
}

const edit = () => {
	polygonEditor.setTarget(polygon)
	polygonEditor.open()
}

const save = () => {
	polygonEditor.close()
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
