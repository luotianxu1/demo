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
		plugins: ["AMap.DistrictSearch"]
	})
		.then(AMap => {
			const wms = new AMap.TileLayer.WMTS({
				url: "https://wmts-service.pre-fc.alibaba-inc.com/amap/service/wmts",
				blend: true,
				tileSize: 256,
				params: {
					LAYERS: "map:shanghai",
					VERSION: "1.1.0"
				}
			})
			new AMap.Map("container", {
				zoom: 9.6,
				center: [121.456493, 31.252764],
				layer: [wms]
			})
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
