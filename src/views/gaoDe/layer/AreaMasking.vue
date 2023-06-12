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
			const opts = {
				subdistrict: 0,
				extensions: "all",
				level: "city"
			}
			const district = new AMap.DistrictSearch(opts)

			district.search("北京市", function (status: any, result: any) {
				const bounds = result.districtList[0].boundaries
				if (!bounds.length) {
					return
				}
				const mask: any[] = []
				for (let i = 0; i < bounds.length; i += 1) {
					mask.push([bounds[i]])
				}
				const map = new AMap.Map("container", {
					mask: mask,
					center: [116.472804, 39.995725],
					viewMode: "3D",
					showLabel: true,
					labelzIndex: 130,
					pitch: 40,
					zoom: 9,
					layers: [new AMap.TileLayer.RoadNet(), new AMap.TileLayer.Satellite()]
				})
				//添加描边
				for (let i = 0; i < bounds.length; i += 1) {
					new AMap.Polyline({
						path: bounds[i],
						strokeColor: "#99ffff",
						strokeWeight: 4,
						map: map
					})
				}
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
