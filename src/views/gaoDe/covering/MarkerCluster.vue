<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="addCluster(1)">自定义图标</el-button>
			<el-button type="primary" @click="addCluster(2)">完全自定义</el-button>
			<el-button type="primary" @click="addCluster(3)">默认样式</el-button>
		</div>
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import { points } from "./data/point"

onMounted(() => {
	initMap()
})

let map: AMap.Map
let aMap: any
let cluster: AMap.MarkerClusterer
let gridSize = 60
let count = points.length

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.MarkerCluster"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("container", {
				center: [104.937478, 35.439575],
				zoom: 5
			})
			addCluster(1)
		})
		.catch(e => {
			console.log(e)
		})
}

const addCluster = (tag: number) => {
	if (cluster) {
		cluster.setMap(null as any)
	}
	if (tag === 2) {
		//完全自定义
		cluster = new aMap.MarkerCluster(map, points, {
			gridSize: gridSize, // 设置网格像素大小
			renderClusterMarker: _renderClusterMarker, // 自定义聚合点样式
			renderMarker: _renderMarker // 自定义非聚合点样式
		})
	} else if (tag === 1) {
		//自定义图标
		let sts = [
			{
				url: "//a.amap.com/jsapi_demos/static/images/blue.png",
				size: new AMap.Size(32, 32),
				offset: new AMap.Pixel(-16, -16)
			},
			{
				url: "//a.amap.com/jsapi_demos/static/images/green.png",
				size: new AMap.Size(32, 32),
				offset: new AMap.Pixel(-16, -16)
			},
			{
				url: "//a.amap.com/jsapi_demos/static/images/orange.png",
				size: new AMap.Size(36, 36),
				offset: new AMap.Pixel(-18, -18)
			},
			{
				url: "//a.amap.com/jsapi_demos/static/images/red.png",
				size: new AMap.Size(48, 48),
				offset: new AMap.Pixel(-24, -24)
			},
			{
				url: "//a.amap.com/jsapi_demos/static/images/darkRed.png",
				size: new AMap.Size(48, 48),
				offset: new AMap.Pixel(-24, -24)
			}
		]
		cluster = new aMap.MarkerCluster(map, points, {
			styles: sts,
			gridSize: gridSize
		})
	} else {
		//默认样式
		cluster = new aMap.MarkerCluster(map, points, { gridSize: gridSize })
	}
}

const _renderClusterMarker = (context: any) => {
	let factor = Math.pow(context.count / count, 1 / 18)
	let div = document.createElement("div")
	let Hue = 180 - factor * 180
	let bgColor = "hsla(" + Hue + ",100%,40%,0.7)"
	let fontColor = "hsla(" + Hue + ",100%,90%,1)"
	let borderColor = "hsla(" + Hue + ",100%,40%,1)"
	let shadowColor = "hsla(" + Hue + ",100%,90%,1)"
	div.style.backgroundColor = bgColor
	let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 20)
	div.style.width = div.style.height = size + "px"
	div.style.border = "solid 1px " + borderColor
	div.style.borderRadius = size / 2 + "px"
	div.style.boxShadow = "0 0 5px " + shadowColor
	div.innerHTML = context.count
	div.style.lineHeight = size + "px"
	div.style.color = fontColor
	div.style.fontSize = "14px"
	div.style.textAlign = "center"
	context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
	context.marker.setContent(div)
}

const _renderMarker = (context: any) => {
	let content =
		'<div style="background-color: hsla(180, 100%, 50%, 0.3); height: 18px; width: 18px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;"></div>'
	let offset = new AMap.Pixel(-9, -9)
	context.marker.setContent(content)
	context.marker.setOffset(offset)
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
