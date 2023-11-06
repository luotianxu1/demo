<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "@ansur/leaflet-pulse-icon"
import "@ansur/leaflet-pulse-icon/dist/L.Icon.Pulse.css"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 18,
		minZoom: 3,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [27.522422570142833, 115.11471659369913]
	map.setView(center_point, 4)

	addScatter()
})

//散点图数据情况
const scatterData = [
	{ name: "海门", value: 3, x: 121.15, y: 31.89 },
	{ name: "鄂尔多斯", value: 12, x: 109.781327, y: 39.608266 },
	{ name: "招远", value: 8, x: 120.38, y: 37.35 },
	{ name: "舟山", value: 9, x: 122.207216, y: 29.985295 },
	{ name: "齐齐哈尔", value: 14, x: 116.97, y: 33.38 },
	{ name: "盐城", value: 7, x: 120.13, y: 31.89 },
	{ name: "赤峰", value: 16, x: 118.87, y: 42.28 },
	{ name: "青岛", value: 45, x: 120.33, y: 36.07 },
	{ name: "乳山", value: 0, x: 121.52, y: 36.89 },
	{ name: "金昌", value: 19, x: 102.188043, y: 38.520089 },
	{ name: "泉州", value: 7, x: 118.58, y: 24.93 },
	{ name: "文登", value: 9, x: 122.05, y: 37.2 },
	{ name: "上海", value: 2, x: 121.48, y: 31.22 },
	{ name: "攀枝花", value: 5, x: 101.718637, y: 26.582347 },
	{ name: "威海", value: 8, x: 122.1, y: 37.5 },
	{ name: "承德", value: 67, x: 117.93, y: 40.97 },
	{ name: "厦门", value: 9, x: 118.1, y: 24.46 },
	{ name: "汕尾", value: 2, x: 115.375279, y: 22.786211 },
	{ name: "潮州", value: 4, x: 116.63, y: 23.68 }
]
function addScatter() {
	//数值0-5区间：绿色
	//数值6-10区间：黄色
	//数值11-20区间：橙色
	//数值21以上：红色
	const parts = [
		{ color: "green", betweenVal: [0, 5], size: 10 },
		{ color: "yellow", betweenVal: [6, 10], size: 15 },
		{ color: "orange", betweenVal: [11, 20], size: 20 },
		{ color: "red", betweenVal: [21], size: 30 }
	]

	for (let i = 0; i < scatterData.length; i++) {
		let pulseJson: any = {}
		//xy坐标
		pulseJson.xy = [scatterData[i].y, scatterData[i].x]
		pulseJson.option = {}
		let flag = 0
		for (let j = 0; j < parts.length; j++) {
			if (parts[j].betweenVal.length > 1) {
				if (parts[j].betweenVal[0] <= scatterData[i].value && scatterData[i].value <= parts[j].betweenVal[1]) {
					flag = 1
					pulseJson.option = {
						iconSize: [parts[j].size, parts[j].size], //波纹大小
						color: parts[j].color, //波纹颜色
						fillColor: parts[j].color, //波纹圆点颜色
						heartbeat: 2, //波纹速度
						animate: true //是否显示波纹
					}
				}
			}
		}
		if (flag === 0) {
			for (let j = 0; j < parts.length; j++) {
				if (parts[j].betweenVal.length === 1) {
					pulseJson.option = {
						iconSize: [parts[j].size, parts[j].size], //波纹大小
						color: parts[j].color, //波纹颜色
						fillColor: parts[j].color, //波纹圆点颜色
						heartbeat: 2, //波纹速度
						animate: true //是否显示波纹
					}
				}
			}
		}

		let pulsingIcon = (L.icon as any).pulse(pulseJson.option)
		let marker = L.marker(pulseJson.xy, { icon: pulsingIcon })
		if (!map) return
		marker.addTo(map)
		marker.bindPopup("<div>" + scatterData[i].name + ":" + scatterData[i].value + "</div>", {
			offset: [0, 0] //弹出偏移
		})
	}
}
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}

// .leaflet-pulsing-icon:after {
// 	-webkit-border-radius: 100%;
// 	border-radius: 100%;
// 	height: 120%;
// 	width: 120%;
// 	position: absolute;
// 	margin: -10% 0 0 -10%;
// }
</style>
