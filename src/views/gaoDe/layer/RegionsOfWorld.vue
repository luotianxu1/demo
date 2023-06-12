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
			let dis = new AMap.DistrictLayer.World({
				zIndex: 10,
				styles: {
					"stroke-width": 0.8,
					fill: function (props: any) {
						if (props.SOC === "CHN") {
							return "rgba(20, 120, 230, 0.3)"
						} else {
							return "white"
						}
					}
				}
			})

			new AMap.Map("container", {
				layers: [dis],
				zooms: [2, 4],
				zoom: 2,
				center: [110, 30],
				viewMode: "3D",
				showLabel: false
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
