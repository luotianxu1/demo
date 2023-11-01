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
let rectangleEditor: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.RectangleEditor"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			rectangleEditor = new AMap.RectangleEditor(map, null)

			rectangleEditor.on("addnode", function (e: any) {
				console.log("addnode", e)
			})

			rectangleEditor.on("adjust", function (e: any) {
				console.log("adjust", e)
			})

			rectangleEditor.on("removenode", function (e: any) {
				console.log("removenode", e)
			})

			rectangleEditor.on("add", function (e: any) {
				console.log("add", e)
			})

			rectangleEditor.on("end", function (e: any) {
				console.log("end", e)
			})

			addRectangle()
		})
		.catch(e => {
			console.log(e)
		})
}

let rectangle: AMap.Rectangle
const addRectangle = () => {
	const southWest = new AMap.LngLat(116.356449, 39.859008)
	const northEast = new AMap.LngLat(116.417901, 39.893797)
	const bounds = new AMap.Bounds(southWest, northEast)

	rectangle = new aMap.Rectangle({
		bounds: bounds,
		strokeColor: "red",
		strokeWeight: 6,
		strokeOpacity: 0.5,
		strokeDasharray: [30, 10],
		strokeStyle: "dashed",
		fillColor: "blue",
		fillOpacity: 0.5,
		cursor: "pointer",
		zIndex: 50
	})
	map.add(rectangle)
	map.setFitView([rectangle])
}

const add = () => {
	rectangleEditor.setTarget()
	rectangleEditor.open()
}

const edit = () => {
	rectangleEditor.setTarget(rectangle)
	rectangleEditor.open()
}

const save = () => {
	rectangleEditor.close()
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
