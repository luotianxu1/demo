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
				zoom: 5,
				showLabel: false,
				viewMode: "3D",
				pitch: 55,
				center: [103.594884, 36.964587],
				mapStyle: "amap://styles/dark"
			})
			loca = new Loca.Container({
				map: map
			})

			loca.ambLight = {
				intensity: 0.7,
				color: "#7b7bff"
			}
			loca.dirLight = {
				intensity: 0.8,
				color: "#fff",
				target: [0, 0, 0],
				position: [0, -1, 1]
			}
			loca.pointLight = {
				color: "rgb(240,88,25)",
				position: [112.028276, 31.58538, 2000000],
				intensity: 3,
				// 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
				distance: 5000000
			}

			let pl = new Loca.PrismLayer({
				zIndex: 10,
				opacity: 1,
				visible: false,
				hasSide: true
			})
			let geo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/gdp.json"
			})
			pl.setSource(geo)
			let topConf = {
				上海市: "https://a.amap.com/Loca/static/loca-v2/demos/images/top-one.png",
				北京市: "https://a.amap.com/Loca/static/loca-v2/demos/images/top-two.png",
				广州市: "https://a.amap.com/Loca/static/loca-v2/demos/images/top-three.png"
			}
			pl.setStyle({
				unit: "meter",
				sideNumber: 32,
				topColor: (index, f) => {
					let n = f.properties["GDP"]
					return n > 7000 ? "#E97091" : "#2852F1"
				},
				sideTopColor: (index, f) => {
					let n = f.properties["GDP"]
					return n > 7000 ? "#E97091" : "#2852F1"
				},
				sideBottomColor: "#002bb9",
				radius: 15000,
				height: (index, f) => {
					let props = f.properties
					let height = Math.max(100, Math.sqrt(props["GDP"]) * 9000 - 50000)
					let conf = topConf[props["名称"]]
					// top3 的数据，增加文字表达
					if (conf) {
						map.add(
							new AMap.Marker({
								anchor: "bottom-center",
								position: [f.coordinates[0], f.coordinates[1], height],
								content:
									'<div style="margin-bottom: 10px; float: left; font-size: 14px;height: 57px; width: 180px; color:#fff; background: no-repeat url(' +
									conf +
									'); background-size: 100%;"><p style="margin: 7px 0 0 35px; height: 20px; line-height:20px;">' +
									props["名称"] +
									"人口 " +
									props["人口"] +
									"</p>" +
									'<p style="margin: 4px 0 0 35px; height: 20px; line-height:20px; color: #00a9ff; font-size: 13px;">' +
									props["GDP"] +
									" 元" +
									"</p></div>"
							})
						)
					}
					return height
				},
				altitude: 0
			})
			loca.add(pl)
			map.on("complete", function () {
				setTimeout(function () {
					pl.show(500)
					pl.addAnimate({
						key: "height",
						value: [0, 1],
						duration: 500,
						easing: "Linear",
						transform: 500,
						random: true,
						delay: 5000
					})
				}, 800)
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
