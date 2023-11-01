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
	//每个弧线段有两种描述方式
	[116.37, 39.91], //起点
	//第一段弧线
	[116.380298, 39.907771, 116.38, 39.9], //控制点，途经点
	//第二段弧线
	[116.385298, 39.907771, 116.4, 39.9], //控制点，途经点//弧线段有两种描述方式1
	//第三段弧线
	[
		//弧线段有两种描述方式2
		[116.392872, 39.887391], //控制点
		[116.40772, 39.909252], //控制点
		[116.41, 39.89] //途经点
	],
	//第四段弧线
	[116.423857, 39.889498, 116.422312, 39.899639, 116.425273, 39.902273]
	//控制点，控制点，途经点，每段最多两个控制点
]

onMounted(() => {
	initMap()
})

let map: AMap.Map
let aMap: any
let bezierCurveEditor: any

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.BezierCurveEditor"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			bezierCurveEditor = new AMap.BezierCurveEditor(map, null)

			bezierCurveEditor.on("addnode", function (e: any) {
				console.log("addnode", e)
			})

			bezierCurveEditor.on("adjust", function (e: any) {
				console.log("adjust", e)
			})

			bezierCurveEditor.on("removenode", function (e: any) {
				console.log("removenode", e)
			})

			addBezierCurve()
		})
		.catch(e => {
			console.log(e)
		})
}

let bezierCurve: AMap.BezierCurve
const addBezierCurve = () => {
	bezierCurve = new aMap.BezierCurve({
		path: path,
		isOutline: true,
		outlineColor: "#ffeeff",
		borderWeight: 3,
		strokeColor: "#3366FF",
		strokeOpacity: 1,
		strokeWeight: 6,
		// 线样式还支持 'dashed'
		strokeStyle: "solid",
		// strokeStyle是dashed时有效
		strokeDasharray: [10, 10],
		lineJoin: "round",
		lineCap: "round",
		zIndex: 50
	})

	map.add(bezierCurve)
	// 缩放地图到合适的视野级别
	map.setFitView([bezierCurve])
}

const add = () => {
	bezierCurveEditor.setTarget()
	bezierCurveEditor.open()
}

const edit = () => {
	bezierCurveEditor.setTarget(bezierCurve)
	bezierCurveEditor.open()
}

const save = () => {
	bezierCurveEditor.close()
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
