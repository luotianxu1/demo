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
	[116.362209, 39.887487],
	[116.422897, 39.878002],
	[116.372105, 39.90651],
	[116.428945, 39.89663]
]
const path2 = [
	[
		[116.32873535156249, 40.01499435375046],
		[116.52099609375, 40.019201307686785],
		[116.49902343749999, 40.12849105685408]
	],
	[
		[116.66931152343749, 40.0360265298117],
		[116.72973632812499, 40.14948820651523],
		[116.81213378906249, 40.01499435375046]
	]
]

onMounted(() => {
	initMap()
})

let map: AMap.Map
let aMap: any
let polyEditor: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.PolylineEditor"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			polyEditor = new AMap.PolylineEditor(map, null)

			polyEditor.on("addnode", function (e: any) {
				console.log("addnode", e)
			})

			polyEditor.on("adjust", function (e: any) {
				console.log("adjust", e)
			})

			polyEditor.on("removenode", function (e: any) {
				console.log("removenode", e)
			})

			polyEditor.on("add", function (e: any) {
				console.log("add", e)
			})

			polyEditor.on("end", function (e: any) {
				console.log("end", e)
			})

			addLine()
		})
		.catch(e => {
			console.log(e)
		})
}

let polyline: AMap.Polyline
let polyline2: AMap.Polyline
const addLine = () => {
	polyline = new aMap.Polyline({
		path: path,
		isOutline: true,
		outlineColor: "#ffeeff",
		borderWeight: 3,
		strokeColor: "#3366FF",
		strokeOpacity: 1,
		strokeWeight: 6,
		strokeStyle: "solid",
		strokeDasharray: [10, 5],
		lineJoin: "round",
		lineCap: "round",
		zIndex: 50
	})

	polyline2 = new aMap.Polyline({
		path: path2,
		isOutline: true,
		outlineColor: "#ffeeff",
		borderWeight: 3,
		strokeColor: "#3366FF",
		strokeOpacity: 1,
		strokeWeight: 6,
		strokeStyle: "dashed",
		strokeDasharray: [15, 5],
		lineJoin: "round",
		lineCap: "round",
		zIndex: 50
	})
	map.add([polyline, polyline2])
	map.setFitView()
}

const add = () => {
	polyEditor.setTarget()
	polyEditor.open()
}

const edit = () => {
	polyEditor.setTarget(polyline)
	polyEditor.open()
}

const save = () => {
	polyEditor.close()
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
