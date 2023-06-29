<template>
	<div class="container">
		<div id="map" class="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

onMounted(() => {
	initMap()
})

let map: any
let aMap: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0"
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("map", {
				resizeEnable: true,
				zoom: 13 //地图显示的缩放级别
			})

			pathLength()
			area()
		})
		.catch(e => {
			console.log(e)
		})
}

const pathLength = () => {
	let arr = new Array() //经纬度坐标数组
	arr.push(new aMap.LngLat(116.368904, 39.913423))
	arr.push(new aMap.LngLat(116.382122, 39.901176))
	arr.push(new aMap.LngLat(116.387271, 39.912501))
	arr.push(new aMap.LngLat(116.398258, 39.9046))
	arr.push(new aMap.LngLat(116.427097, 39.9125))

	//定义折线对象
	let polyline = new aMap.Polyline({
		path: arr, //设置折线的节点数组
		strokeColor: "red",
		strokeOpacity: 1,
		strokeWeight: 3,
		strokeDasharray: [10, 5]
	})

	polyline.setMap(map) //地图上添加折线

	let distance = Math.round(aMap.GeometryUtil.distanceOfLine(arr))
	let text = new aMap.Text({
		position: new aMap.LngLat(116.427097, 39.9125),
		text: "折线长" + distance + "米",
		offset: new aMap.Pixel(-20, -20)
	})
	map.add(text)
	map.setFitView()
}

const area = () => {
	const path: any = [
		[116.169465, 39.93267],
		[116.16026, 39.924492],
		[116.150625, 39.710019],
		[116.183198, 39.70992],
		[116.22695, 39.777616],
		[116.442621, 39.799892],
		[116.463478, 39.790066],
		[116.588276, 39.809551],
		[116.536091, 39.808859],
		[116.573856, 39.839643],
		[116.70638, 39.91674],
		[116.600293, 39.93777],
		[116.514805, 39.982375],
		[116.499935, 40.01371],
		[116.54652, 40.030443],
		[116.687668, 40.129961],
		[116.539697, 40.080659],
		[116.50339, 40.058474],
		[116.4688, 40.052578]
	]
	const polygon = new aMap.Polygon({
		map: map,
		fillOpacity: 0.4,
		path: path
	})
	// 计算区域面积
	const area = Math.round(aMap.GeometryUtil.ringArea(path))
	const text = new aMap.Text({
		position: new aMap.LngLat(116.4688, 40.052578),
		text: "区域面积" + area + "平方米",
		offset: new aMap.Pixel(-20, -20)
	})
	map.add(text)
	map.setFitView()
}
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	width: 100%;
	display: flex;

	.map {
		height: 100%;
		width: 100%;
	}

	.btn {
		width: 320px;
		padding: 10px;
		display: flex;
		flex-direction: column;

		.el-button {
			margin: 0 0 5px 0;
		}
	}
}
</style>
