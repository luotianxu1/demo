<template>
	<div class="container">
		<div id="map" class="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

let map
let loca

onMounted(() => {
	initMap()
})

onUnmounted(() => {
	loca.destroy()
	map.destroy()
})

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		AMapUI: {
			// 是否加载 AMapUI，缺省不加载
			version: "1.1", // AMapUI 缺省 1.1
			plugins: ["overlay/SimpleMarker"] // 需要加载的 AMapUI ui插件
		},
		Loca: {
			version: "2.0.0" // Loca 版本，缺省 1.3.2
		}
	})
		.then(AMap => {
			map = new AMap.Map("map", {
				zoom: 5.29,
				// showLabel: false,
				viewMode: "3D",
				pitch: 48,
				center: [104.780269, 34.955403],
				mapStyle: "amap://styles/dark"
			})
			loca = new Loca.Container({
				map: map
			})
			let scatter = new Loca.ScatterLayer({
				loca,
				zIndex: 10,
				opacity: 0.6,
				visible: true,
				zooms: [2, 22]
			})
			let pointGeo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/pulselink-china-city-point.json"
			})
			scatter.setSource(pointGeo)
			scatter.setStyle({
				unit: "meter",
				size: [100000, 100000],
				borderWidth: 0,
				texture: "https://a.amap.com/Loca/static/loca-v2/demos/images/breath_red.png",
				duration: 2000,
				animate: true
			})
			loca.add(scatter)

			// 弧线
			let pulseLink = new Loca.PulseLinkLayer({
				// loca,
				zIndex: 10,
				opacity: 1,
				visible: true,
				zooms: [2, 22],
				depth: true
			})
			let geo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/data-line-out.json"
			})
			pulseLink.setSource(geo)
			pulseLink.setStyle({
				unit: "meter",
				dash: [40000, 0, 40000, 0],
				lineWidth: function () {
					return [20000, 1000]
				},
				height: function (index, feat) {
					return feat.distance / 3 + 10
				},
				// altitude: 1000,
				smoothSteps: 30,
				speed: function () {
					return 1000 + Math.random() * 200000
				},
				flowLength: 100000,
				lineColors: function () {
					return ["rgb(255,228,105)", "rgb(255,164,105)", "rgba(1, 34, 249,1)"]
				},
				maxHeightScale: 0.3, // 弧顶位置比例
				headColor: "rgba(255, 255, 0, 1)",
				trailColor: "rgba(255, 255,0,0)"
			})
			loca.add(pulseLink)
			loca.animate.start()
		})
		.catch(e => {
			console.log(e)
		})
}
</script>

<style lang="scss" scoped>
.container {
	height: 100%;
	width: 100%;
	display: flex;

	.map {
		height: 100%;
		width: 100%;
	}

	.btn {
		width: 320px;
		padding: 10px;
		display: flex;
		flex-direction: column;

		.el-button {
			margin: 0 0 5px 0;
		}
	}
}
</style>
