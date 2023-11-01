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
		plugins: []
	})
		.then(AMap => {
			const xyzTileLayer = new AMap.TileLayer({
				// 图块取图地址
				getTileUrl: "https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]&size=1&scl=1&style=8&ltype=11",
				zIndex: 100
			})
			const map = new AMap.Map("container", {
				center: [116.472804, 39.995725],
				viewMode: "3D",
				showLabel: true,
				labelzIndex: 130,
				zoom: 9,
				layers: [new AMap.TileLayer.Satellite(), xyzTileLayer]
			})
		})
		.catch(e => {
			console.log(e)
		})
}
</script>
<style lang="scss" scoped>
#container {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
}
</style>
