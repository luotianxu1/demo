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
let circleEditor: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.CircleEditor"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			circleEditor = new AMap.CircleEditor(map, null)

			circleEditor.on("addnode", function (e: any) {
				console.log("addnode", e)
			})

			circleEditor.on("adjust", function (e: any) {
				console.log("adjust", e)
			})

			circleEditor.on("removenode", function (e: any) {
				console.log("removenode", e)
			})

			circleEditor.on("add", function (e: any) {
				console.log("add", e)
			})

			circleEditor.on("end", function (e: any) {
				console.log("end", e)
			})

			addCircle()
		})
		.catch(e => {
			console.log(e)
		})
}

let circle: AMap.Circle
const addCircle = () => {
	circle = new aMap.Circle({
		center: [116.433322, 39.900255],
		radius: 1000, //半径
		borderWeight: 3,
		strokeColor: "#FF33FF",
		strokeOpacity: 1,
		strokeWeight: 6,
		fillOpacity: 0.4,
		strokeStyle: "dashed",
		strokeDasharray: [10, 10],
		// 线样式还支持 'dashed'
		fillColor: "#1791fc",
		zIndex: 50
	})
	map.add(circle)
	map.setFitView([circle])
}

const add = () => {
	circleEditor.setTarget()
	circleEditor.open()
}

const edit = () => {
	circleEditor.setTarget(circle)
	circleEditor.open()
}

const save = () => {
	circleEditor.close()
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
