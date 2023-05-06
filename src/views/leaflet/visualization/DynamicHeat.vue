<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "leaflet.heat"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 18,
		minZoom: 3,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 12)

	addHeatmap()
})

let heatPoints: any = [] //测试数据点
let heatmap: any = null //热力图
function addHeatmap() {
	if (!map) return

	//聚合半径
	let option = {
		//像素为单位，热力半径（热力根据级别设计监控）
		max: 50,
		radius: 10, //单位像素
		maxZoom: 15,
		gradient: { 0.2: "white", 0.4: "blue", 0.6: "cyan", 0.7: "lime", 0.8: "yellow", 1: "red" },
		//显示范围
		showRadius: 200 //单位米
	}
	heatmap = (L as any).heatLayer(heatPoints, option)
	map.addLayer(heatmap)

	addHeatMapData()

	map.on("click", function (e) {
		let count = 0
		for (let i = 0; i < heatPoints.length; i++) {
			let flag = pointlnCicle(heatPoints[i][1], heatPoints[i][0], e.latlng.lng, e.latlng.lat, option.showRadius)
			if (flag === true) {
				count = count + heatPoints[i][2]
			}
		}
		let popupOption = { className: "custom", minWidth: 20 }
		let point = [e.latlng.lat, e.latlng.lng]
		addPopup(popupOption, point, "周边200米总量:" + count)
	})
}

let timeFlag = 0
function addHeatMapData() {
	if (timeFlag > 39) {
		return
	}
	for (let i = 0; i < 200; i++) {
		let zby = 24.44 + Math.random() * 0.2
		let zbx = 118.08 + Math.random() * 0.2
		let value = Math.floor(Math.random() * 100)
		heatPoints.push([zby, zbx, value])
	}
	if (timeFlag < 40) {
		timeFlag = timeFlag + 1
		heatmap.setLatLngs(heatPoints)
		window.setTimeout(addHeatMapData, 100)
	}
}

/**
 * 添加气泡框
 * @param option
 * @param point
 * @param html
 * @returns {*}
 */
function addPopup(option: L.PopupOptions | undefined, point: number[], html: ((source: L.Layer) => L.Content) | L.Content) {
	if (!map) return
	let popup = L.popup(option).setLatLng([point[0], point[1]]).setContent(html).openOn(map)
	return popup
}
//判断点与圆的空间关系
function pointlnCicle(x1: number, y1: number, x2: number, y2: number, r: number) {
	let radiusMeter = r / (1000 * 101.11)
	let xdi = x2 - x1
	let ydi = y2 - y1
	if (Math.pow(xdi * xdi + ydi * ydi, 0.5) < radiusMeter) {
		return true
	} else {
		return false
	}
}
</script>
<style lang="scss">
#map {
	width: 100%;
	height: 100%;
}
</style>
