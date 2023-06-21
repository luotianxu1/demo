<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="startAnimation">开始动画</el-button>
			<el-button type="primary" @click="pauseAnimation">暂停动画</el-button>
			<el-button type="primary" @click="resumeAnimation">继续动画</el-button>
			<el-button type="primary" @click="stopAnimation">停止动画</el-button>
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
let marker: AMap.Marker
let lineArr = [
	[116.478935, 39.997761],
	[116.478939, 39.997825],
	[116.478912, 39.998549],
	[116.478912, 39.998549],
	[116.478998, 39.998555],
	[116.478998, 39.998555],
	[116.479282, 39.99856],
	[116.479658, 39.998528],
	[116.480151, 39.998453],
	[116.480784, 39.998302],
	[116.480784, 39.998302],
	[116.481149, 39.998184],
	[116.481573, 39.997997],
	[116.481863, 39.997846],
	[116.482072, 39.997718],
	[116.482362, 39.997718],
	[116.483633, 39.998935],
	[116.48367, 39.998968],
	[116.484648, 39.999861]
]

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.MoveAnimation"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				zoom: 4,
				center: [108, 34]
			})

			marker = new AMap.Marker({
				map: map,
				position: [116.478935, 39.997761],
				icon: "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
				offset: new AMap.Pixel(-13, -26)
			})

			// 绘制轨迹
			let polyline = new AMap.Polyline({
				map: map,
				path: lineArr,
				showDir: true,
				strokeColor: "#28F", //线颜色
				// strokeOpacity: 1,     //线透明度
				strokeWeight: 6 //线宽
				// strokeStyle: "solid"  //线样式
			})

			let passedPolyline = new AMap.Polyline({
				map: map,
				strokeColor: "#AF5", //线颜色
				strokeWeight: 6 //线宽
			})

			marker.on("moving" as any, function (e) {
				passedPolyline.setPath(e.passedPath)
				map.setCenter(e.target.getPosition(), true)
			})

			map.setFitView()
		})
		.catch(e => {
			console.log(e)
		})
}

const startAnimation = () => {
	marker.moveAlong(lineArr, {
		// 每一段的时长
		duration: 500, //可根据实际采集时间间隔设置
		// JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
		autoRotation: true
	})
}

const pauseAnimation = () => {
	marker.pauseMove()
}

const resumeAnimation = () => {
	marker.resumeMove()
}

const stopAnimation = () => {
	marker.stopMove()
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
