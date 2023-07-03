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
				zoom: 11.2,
				center: [116.352734, 39.8447],
				pitch: 50,
				showLabel: true,
				viewMode: "3D",
				mapStyle: "amap://styles/dark"
			})
			loca = new Loca.Container({
				map: map
			})
			let geo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/bj_bus.json"
			})
			let layer = new Loca.PulseLineLayer({
				// loca,
				zIndex: 10,
				opacity: 1,
				visible: true,
				zooms: [2, 22]
			})
			let headColors = ["#EFBB51", "#7F3CFF", "#4CC19B", "#0B5D74", "#E06AC4", "#223F9B", "#F15C1A", "#7A0FA6"]
			layer.setSource(geo)
			layer.setStyle({
				altitude: 0,
				lineWidth: 2,
				// 脉冲头颜色
				headColor: (_, feature) => {
					return headColors[feature.properties.type - 1]
				},
				// 脉冲尾颜色
				trailColor: "rgba(128, 128, 128, 0.5)",
				// 脉冲长度，0.25 表示一段脉冲占整条路的 1/4
				interval: 0.25,
				// 脉冲线的速度，几秒钟跑完整段路
				duration: 5000
			})
			loca.add(layer)
			loca.animate.start()

			new Loca.Legend({
				loca: loca,
				title: {
					label: "公交类型",
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
					{ label: "A类型", color: headColors[7] },
					{ label: "B类型", color: headColors[6] },
					{ label: "C类型", color: headColors[5] },
					{ label: "D类型", color: headColors[4] },
					{ label: "E类型", color: headColors[3] },
					{ label: "F类型", color: headColors[2] },
					{ label: "G类型", color: headColors[1] },
					{ label: "H类型", color: headColors[0] }
				]
			})
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
