<template>
	<div id="container"></div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

onMounted(() => {
	initMap()
})

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.IndoorMap"]
	})
		.then(AMap => {
			let indoorMap = new AMap.IndoorMap()
			let map = new AMap.Map("container", {
				showIndoorMap: false, //隐藏地图自带的室内地图图层
				layers: [indoorMap, AMap.createDefaultLayer()]
			})
			indoorMap.showIndoorMap("B000A9VHIG")
		})
		.catch(e => {
			console.log(e)
		})
}
</script>
<style lang="scss" scoped>
#container {
	height: 100%;
	width: 100%;
	padding: 0;
	margin: 0;
}
</style>
