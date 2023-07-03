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
				zoom: 11.43,
				center: [120.2446746826172, 30.199146446037616],
				pitch: 55,
				rotation: 20,
				showLabel: true,
				viewMode: "3D",
				mapStyle: "amap://styles/dark"
			})
			loca = new Loca.Container({
				map: map
			})
			// 环境光
			loca.ambLight = {
				intensity: 0.4,
				color: "#ced5ed"
			}
			// 平行光
			loca.dirLight = {
				intensity: 0.02,
				color: "#666",
				target: [10, 10, 10],
				position: [0, -1, 0.1]
			}
			// 点光
			loca.pointLight = {
				color: "rgb(155,173,80)",
				position: [120.14133, 30.246611, 20000],
				intensity: 2.2,
				// 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
				distance: 40000
			}
			let geo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/hz_road_level.json"
			})
			let ll = new Loca.HexagonLayer({
				// loca,
				zIndex: 10,
				opacity: 1,
				visible: true,
				zooms: [2, 22],
				acceptLight: true
			})
			let colors = ["#F4FFB3", "#BFDDA8", "#96CA8D", "#75BA89", "#5EAC86", "#4D9A96", "#3F748F", "#1D3748"].reverse()
			let heights = [100, 200, 300, 900, 1000, 1200, 1500, 3000]
			ll.setSource(geo)

			ll.setStyle({
				unit: "meter",
				radius: 120,
				gap: 0,
				altitude: 0,
				height: function (index, feature) {
					let ranks = sum(feature.coordinates)
					return ranks < 20
						? heights[0]
						: ranks < 40
						? heights[1]
						: ranks < 60
						? heights[2]
						: ranks < 80
						? heights[3]
						: ranks < 100
						? heights[4]
						: ranks < 120
						? heights[5]
						: ranks < 130
						? heights[6]
						: heights[7]
				},
				topColor: function (index, feature) {
					let ranks = sum(feature.coordinates)
					return ranks < 20
						? colors[0]
						: ranks < 40
						? colors[1]
						: ranks < 60
						? colors[2]
						: ranks < 80
						? colors[3]
						: ranks < 100
						? colors[4]
						: ranks < 120
						? colors[5]
						: ranks < 130
						? colors[6]
						: colors[7]
				},
				sideBottomColor: function (index, feature) {
					let ranks = sum(feature.coordinates)
					return ranks < 20
						? colors[0]
						: ranks < 40
						? colors[1]
						: ranks < 60
						? colors[2]
						: ranks < 80
						? colors[3]
						: ranks < 100
						? colors[4]
						: ranks < 120
						? colors[5]
						: ranks < 130
						? colors[6]
						: colors[7]
				},
				sideTopColor: function (index, feature) {
					let ranks = sum(feature.coordinates)
					return ranks < 20
						? colors[0]
						: ranks < 40
						? colors[1]
						: ranks < 60
						? colors[2]
						: ranks < 80
						? colors[3]
						: ranks < 100
						? colors[4]
						: ranks < 120
						? colors[5]
						: ranks < 130
						? colors[6]
						: colors[7]
				}
			})
			loca.add(ll)

			map.on("complete", function () {
				setTimeout(function () {
					ll.show(500)
					ll.addAnimate({
						key: "height",
						value: [0, 1],
						duration: 500,
						easing: "Linear",
						transform: 500,
						random: true,
						delay: 10000
					})
				}, 800)
			})

			new Loca.Legend({
				loca: loca,
				title: {
					label: "延误指数",
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
					{ label: "> 130", color: colors[7] },
					{ label: "< 130", color: colors[6] },
					{ label: "< 120", color: colors[5] },
					{ label: "< 100", color: colors[4] },
					{ label: "< 80", color: colors[3] },
					{ label: "< 60", color: colors[2] },
					{ label: "< 40", color: colors[1] },
					{ label: "< 20", color: colors[0] }
				]
			})
			// let dat = new Loca.Dat()
			// dat.addLight(loca.ambLight, loca, "环境光")
			// dat.addLight(loca.dirLight, loca, "平行光")
			// dat.addLight(loca.pointLight, loca, "点光")
		})
		.catch(e => {
			console.log(e)
		})
}

const sum = arr => {
	let num = 0
	arr.forEach(a => {
		num += a.properties.rank
	})
	return num
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
}
</style>
