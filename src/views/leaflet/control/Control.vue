<template>
	<div class="main">
		<div class="btnList">
			<span style="width: 100%">zoom</span>
			<el-button type="primary" @click="getZoomPosition">获取位置</el-button>
			<el-button type="primary" @click="setZoomPosition">设置位置</el-button>
			<el-button type="primary" @click="getZoonContainer">获取内容</el-button>
			<el-button type="primary" @click="addZoomTo">添加</el-button>
			<el-button type="primary" @click="removeZoom">删除</el-button>
			<span style="width: 100%">attribution</span>
			<el-button type="primary" @click="setAttributionPrefix">设置文本</el-button>
			<el-button type="primary" @click="getAttributionPosition">获取位置</el-button>
			<el-button type="primary" @click="setAttributionPosition">设置位置</el-button>
			<el-button type="primary" @click="getAttributionContainer">获取内容</el-button>
			<el-button type="primary" @click="addAttributionTo">添加</el-button>
			<el-button type="primary" @click="removeAttribution">删除</el-button>
			<span style="width: 100%">scale</span>
			<el-button type="primary" @click="getScalePosition">获取位置</el-button>
			<el-button type="primary" @click="setScalePosition">设置位置</el-button>
			<el-button type="primary" @click="getScaleContainer">获取内容</el-button>
			<el-button type="primary" @click="addScale">添加</el-button>
			<el-button type="primary" @click="removeScale">删除</el-button>
			<span style="width: 100%">layer</span>
			<el-button type="primary" @click="addBaseLayer">添加图层</el-button>
			<el-button type="primary" @click="removeLayer">删除图层</el-button>
			<el-button type="primary" @click="expand">展开</el-button>
			<el-button type="primary" @click="collapse">折叠</el-button>
			<el-button type="primary" @click="getLayerPosition">获取位置</el-button>
			<el-button type="primary" @click="setLayerPosition">设置位置</el-button>
			<el-button type="primary" @click="getLayerContainer">获取内容</el-button>
			<el-button type="primary" @click="addLayer">添加</el-button>
			<el-button type="primary" @click="remove">删除</el-button>
		</div>
		<div id="map" ref="map"></div>
	</div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
let zoom: L.Control.Zoom | null = null
let attribution: L.Control.Attribution | null = null
let scale: L.Control.Scale | null = null
let layer: L.Control.Layers | null = null

let test = L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
	maxZoom: 20,
	minZoom: 1,
	attribution: "© OpenStreetMap"
})
onMounted(() => {
	map = L.map("map", {
		zoomControl: false
	})

	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 3)

	let layers = {
		GeoDe: L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
			maxZoom: 20,
			minZoom: 1,
			attribution: "© OpenStreetMap"
		})
	}
	layer = L.control.layers(
		layers,
		{},
		{
			collapsed: true, //如果为 true, 该控件将被折叠成一个图标，并在鼠标悬停或触摸时展开。
			autoZIndex: true, //如果为 true, 控件将以递增的顺序为其所有图层分配 zIndexes，以便在开/关它们时保留顺序。
			hideSingleBase: false, //如果为 true, 当只有一个基础图层时，控件中的基础图层将被隐藏。
			sortLayers: false //是否对各图层进行排序。如果是 false, ，图层将保持它们被添加到控件中的顺序。
			// sortFunction: function() {}
		}
	)
	layers.GeoDe.addTo(map)

	zoom = L.control.zoom({
		zoomInText: '<span aria-hidden="true">+</span>',
		zoomInTitle: "Zoom in",
		zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
		zoomOutTitle: "Zoom out",
		position: "topleft"
	})

	attribution = L.control.attribution({
		prefix: "Leaflet",
		position: "bottomleft"
	})

	scale = L.control.scale({
		maxWidth: 100,
		metric: true,
		imperial: true,
		updateWhenIdle: false,
		position: "topright"
	})
})
// 返回控件的位置。
const getZoomPosition = () => {
	console.log(zoom?.getPosition())
}
// 设置控件的位置。
const setZoomPosition = () => {
	zoom?.setPosition("bottomleft")
}
// 返回包含该控件的 HTMLElement。
const getZoonContainer = () => {
	console.log(zoom?.getContainer())
}
// 将控件添加到给定的地图中。
const addZoomTo = () => {
	zoom?.addTo(map!)
}
// 将控件从当前活动的地图上删除。
const removeZoom = () => {
	zoom?.remove()
}
// 设置属性之前显示的 HTML 文本。通过 false 禁用。
const setAttributionPrefix = () => {
	attribution?.setPrefix("123")
}
const getAttributionPosition = () => {
	console.log(attribution?.getPosition())
}
const setAttributionPosition = () => {
	attribution?.setPosition("bottomright")
}
const getAttributionContainer = () => {
	console.log(attribution?.getContainer())
}
const addAttributionTo = () => {
	attribution?.addTo(map!)
}
const removeAttribution = () => {
	attribution?.remove()
}
const getScalePosition = () => {
	console.log(scale?.getPosition())
}
const setScalePosition = () => {
	scale?.setPosition("bottomright")
}
const getScaleContainer = () => {
	console.log(scale?.getContainer())
}
const addScale = () => {
	scale?.addTo(map!)
}
const removeScale = () => {
	scale?.remove()
}
//
const expand = () => {
	console.log(layer?.expand())
}
const collapse = () => {
	console.log(layer?.collapse())
}
const getLayerPosition = () => {
	console.log(layer?.getPosition())
}
const setLayerPosition = () => {
	layer?.setPosition("bottomright")
}
const getLayerContainer = () => {
	console.log(layer?.getContainer())
}
const addLayer = () => {
	layer?.addTo(map!)
}
const remove = () => {
	layer?.remove()
}
const addBaseLayer = () => {
	layer?.addBaseLayer(test, "test")
}
const removeLayer = () => {
	layer?.removeLayer(test)
}
</script>
<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100%;
	display: flex;

	.btnList {
		width: 255px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	#map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
