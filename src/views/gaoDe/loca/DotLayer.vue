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
				zoom: 4.8,
				showLabel: false,
				viewMode: "3D",
				center: [105.601, 35.32],
				mapStyle: "amap://styles/dark"
			})
			loca = new Loca.Container({
				map: map
			})
			let pl = new Loca.PointLayer({
				zIndex: 10,
				opacity: 1,
				blend: "normal"
			})

			let geo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/gdp.json"
			})
			pl.setSource(geo)
			let colors = [
				"rgba(254,255,198,0.95)",
				"rgba(255,238,149,0.95)",
				"rgba(255,217,99,0.95)",
				"rgba(255,175,43,0.95)",
				"rgba(255,135,24,0.95)",
				"rgba(234,10,0,0.95)",
				"rgba(195,0,0,0.95)",
				"rgba(139,0,0,0.95)"
			]
			let style = {
				unit: "meter",
				radius: (index, f) => {
					let n = f.properties["人口"]
					return n * 100
				},
				color: (index, f) => {
					let n = Math.min(7, ~~(f.properties["人均GDP"] / 10000))
					return colors[n]
				},
				borderWidth: 0,
				blurRadius: -1
			}
			pl.setStyle(style)
			loca.add(pl)
			new Loca.Legend({
				loca: loca,
				title: {
					label: "人均GDP",
					fontColor: "rgba(255,255,255,0.4)",
					fontSize: "16px"
				},
				style: {
					backgroundColor: "rgba(255,255,255,0.1)",
					left: "20px",
					bottom: "40px",
					fontSize: "12px"
				},
				dataMap: [
					{ label: "> 8万", color: colors[7] },
					{ label: "< 7万", color: colors[6] },
					{ label: "< 6万", color: colors[5] },
					{ label: "< 5万", color: colors[4] },
					{ label: "< 4万", color: colors[3] },
					{ label: "< 3万", color: colors[2] },
					{ label: "< 2万", color: colors[1] },
					{ label: "< 1万", color: colors[0] }
				]
			})
			// 动画
			map.on("complete", function () {
				pl.addAnimate({
					key: "radius",
					value: [0, 1],
					duration: 2000,
					easing: "ElasticOut"
					// yoyo: false,
					// repeat: 1,
				})
				pl.show(600)
			})
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
