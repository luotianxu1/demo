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
			const imageLayer = new AMap.ImageLayer({
				url: "https://amappc.cn-hangzhou.oss-pub.aliyun-inc.com/lbs/static/img/dongwuyuan.jpg",
				bounds: new AMap.Bounds([116.327911, 39.939229], [116.342659, 39.946275]),
				zooms: [15, 20]
			})
			new AMap.Map("container", {
				center: [116.33719, 39.942384],
				zoom: 15,
				layers: [AMap.createDefaultLayer(), imageLayer]
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
