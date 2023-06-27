<template>
	<div class="main">
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import { citys } from "./data/city"

onMounted(() => {
	initMap()
})

let map: AMap.Map
let mass: AMap.MassMarks
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.Adaptor"]
	})
		.then(AMap => {
			const style = [
				{
					url: "https://webapi.amap.com/images/mass/mass0.png",
					anchor: new AMap.Pixel(6, 6),
					size: new AMap.Size(11, 11),
					zIndex: 3
				},
				{
					url: "https://webapi.amap.com/images/mass/mass1.png",
					anchor: new AMap.Pixel(4, 4),
					size: new AMap.Size(7, 7),
					zIndex: 2
				},
				{
					url: "https://webapi.amap.com/images/mass/mass2.png",
					anchor: new AMap.Pixel(3, 3),
					size: new AMap.Size(5, 5),
					zIndex: 1
				}
			]

			map = new AMap.Map("container", {
				zoom: 4,
				center: [102.342785, 35.312316],
				showIndoorMap: false,
				viewMode: "3D"
			})

			mass = new AMap.MassMarks(citys, {
				opacity: 0.8,
				zIndex: 111,
				cursor: "pointer",
				style: style
			})

			let marker = new AMap.Marker({ content: " ", map: map })

			mass.on("mouseover", function (e) {
				marker.setPosition(e.data.lnglat)
				marker.setLabel({ content: e.data.name })
			})

			mass.setMap(map)
		})
		.catch(e => {
			console.log(e)
		})
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
</style>
