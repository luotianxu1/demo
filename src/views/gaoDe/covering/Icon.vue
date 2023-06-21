<template>
	<div class="main">
		<div class="btnList">
			<el-button type="primary" @click="setImageSize">设置图片大小</el-button>
			<el-button type="primary" @click="getImageSize">获取图片大小</el-button>
			<el-button type="primary" @click="setSize">设置图标大小</el-button>
			<el-button type="primary" @click="getSize">获取图标大小</el-button>
			<el-button type="primary" @click="setImageOffset">设置图片偏移</el-button>
			<el-button type="primary" @click="getImageOffset">获取图片偏移</el-button>
			<el-button type="primary" @click="getImage">获取图片</el-button>
			<el-button type="primary" @click="setImage">设置图片</el-button>
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
let startIcon: AMap.Icon
let startMarker: AMap.Marker
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.MoveAnimation"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				zoom: 13,
				center: [116.4, 39.92],
				resizeEnable: true
			})

			addMarker()
		})
		.catch(e => {
			console.log(e)
		})
}

const addMarker = () => {
	// 创建一个 Icon
	startIcon = new AMap.Icon({
		// 图标尺寸
		size: new AMap.Size(40, 90),
		// 图标的取图地址
		image: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
		// 图标所用图片大小
		imageSize: new AMap.Size(40, 90),
		// 图标取图偏移量
		imageOffset: new AMap.Pixel(0, 0)
	})

	// 将 icon 传入 marker
	startMarker = new AMap.Marker({
		position: new AMap.LngLat(116.35, 39.89),
		icon: startIcon,
		offset: new AMap.Pixel(-13, -30)
	})

	// 创建一个 icon
	const endIcon = new AMap.Icon({
		size: new AMap.Size(25, 34),
		image: "//a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png",
		imageSize: new AMap.Size(135, 40),
		imageOffset: new AMap.Pixel(-95, -3)
	})

	// 将 icon 传入 marker
	const endMarker = new AMap.Marker({
		position: new AMap.LngLat(116.45, 39.93),
		icon: endIcon,
		offset: new AMap.Pixel(-13, -30)
	})

	// 将 markers 添加到地图
	map.add([startMarker, endMarker])
}

const setImageSize = () => {
	startIcon.setImageSize(new AMap.Size(60, 20))
	startMarker.setIcon(startIcon)
	startMarker.addTo(map)
}

const getImageSize = () => {
	console.log(startIcon.getImageSize())
}

const setSize = () => {
	startIcon.setSize(new AMap.Size(60, 20))
	startMarker.setIcon(startIcon)
	startMarker.addTo(map)
}

const getSize = () => {
	console.log(startIcon.getSize())
}

const setImageOffset = () => {
	startIcon.setImageOffset(new AMap.Pixel(-10, 10))
	startMarker.setIcon(startIcon)
	startMarker.addTo(map)
}

const getImageOffset = () => {
	console.log(startIcon.getImageOffset())
}

const getImage = () => {
	console.log(startIcon.getImage())
}

const setImage = () => {
	startIcon.setImage("//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png")
	startMarker.setIcon(startIcon)
	startMarker.addTo(map)
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
