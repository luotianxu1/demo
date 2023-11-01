<template>
	<div class="main">
		<div class="btnList">
			<el-input v-model="input" placeholder="请输入线路">
				<template #prepend>线路</template>
			</el-input>
			<el-button type="primary" @click="lineSearch">查询</el-button>
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
let linesearch: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.LineSearch"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			linesearch = new AMap.LineSearch({
				pageIndex: 1,
				city: "北京",
				pageSize: 1,
				extensions: "all"
			})
		})
		.catch(e => {
			console.log(e)
		})
}

const input = ref("919")
/*公交线路查询*/
const lineSearch = () => {
	if (!input.value) return
	//搜索“536”相关公交线路
	linesearch.search(input.value, function (status: string, result: any) {
		map.clearMap()
		if (status === "complete" && result.info === "OK") {
			lineSearch_Callback(result)
		}
	})
}

const lineSearch_Callback = (data: any) => {
	let lineArr = data.lineInfo
	let lineNum = data.lineInfo.length
	if (lineNum !== 0) {
		for (let i = 0; i < lineNum; i++) {
			let pathArr = lineArr[i].path
			let stops = lineArr[i].via_stops
			let startPot = stops[0].location
			let endPot = stops[stops.length - 1].location
			if (i === 0)
				//作为示例，只绘制一条线路
				drawbusLine(startPot, endPot, pathArr)
		}
	}
}

let busPolyline: AMap.Polyline
const drawbusLine = (startPot: any, endPot: any, BusArr: any) => {
	//绘制起点，终点
	new AMap.Marker({
		map: map,
		position: startPot, //基点位置
		icon: "https://webapi.amap.com/theme/v1.3/markers/n/start.png",
		zIndex: 10,
		anchor: "bottom-center"
	})
	new AMap.Marker({
		map: map,
		position: endPot, //基点位置
		icon: "https://webapi.amap.com/theme/v1.3/markers/n/end.png",
		zIndex: 10,
		anchor: "bottom-center"
	})
	if (busPolyline) {
		map.remove(busPolyline)
	}
	//绘制乘车的路线
	busPolyline = new AMap.Polyline({
		path: BusArr,
		strokeColor: "#09f", //线颜色
		strokeOpacity: 0.8, //线透明度
		isOutline: true,
		outlineColor: "white",
		strokeWeight: 6 //线宽
	})
	map.add(busPolyline)
	// 将 busPolyline 显示在地图中心并自动缩放地图到合适级别。
	// true表示需要动画过程，[60,200,60,60]表示上下左右避让像素
	map.setFitView([busPolyline], true, [60, 200, 60, 60])
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 200px;
		padding: 5px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.map {
		flex: 1;
	}
}
</style>
