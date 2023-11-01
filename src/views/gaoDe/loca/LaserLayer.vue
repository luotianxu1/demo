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
				zoom: 14.8,
				viewMode: "3D",
				pitch: 79,
				rotation: 3,
				center: [116.487349, 39.994334],
				mapStyle: "amap://styles/dark",
				showLabel: false,
				showBuildingBlock: false
			})
			loca = new Loca.Container({
				map: map
			})

			let layer = new Loca.LaserLayer({
				zIndex: 130,
				opacity: 1,
				visible: true,
				depth: true,
				zooms: [2, 26]
			})

			let heightFactor = 9

			let pointGeo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/laser_point.json"
			})
			layer.setSource(pointGeo, {
				unit: "meter",
				height: (index, feat) => {
					return feat.properties.h * heightFactor
				},
				color: (index, feat) => {
					return ["#FF6F47", "#4FDDC7", "#4FDDC7"][index % 3]
				},
				lineWidth: 12,
				trailLength: 600,
				angle: 0,
				duration: 1500,
				interval: 1000,
				repeat: Infinity,
				delay: () => {
					return Math.random() * 2000
				}
			})

			let geo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/laser_soho.json"
			})

			let buildings = new Loca.PolygonLayer({
				zIndex: 1,
				opacity: 0.8,
				shininess: 10,
				hasSide: true
			})
			buildings.setSource(geo, {
				topColor: "rgba(16,128,165,1)",
				sideTopColor: "rgba(17,79,104,1)",
				sideBottomColor: "rgba(30,215,147,1)",
				height: function (index) {
					return (index % 10) * 10
				}
			})

			loca.add(layer)
			loca.add(buildings)

			// 围栏
			let outLayer = new Loca.PolygonLayer({
				zIndex: 120,
				cullface: "none",
				shininess: 1,
				hasBottom: false,
				blockHide: false,
				hasSide: true,
				hasTop: false,
				depth: true
			})

			let outGeo = new Loca.GeoJSONSource({
				url: "https://a.amap.com/Loca/static/loca-v2/demos/mock_data/laser_out.json"
			})
			outLayer.setSource(outGeo)
			outLayer.setStyle({
				topColor: function (index, feature) {
					return "rgba(217,104,104,0.1)"
				},
				sideTopColor: function (index, feature) {
					return "rgba(217,104,104,0.1)"
				},
				sideBottomColor: function (index, feature) {
					return "rgba(237,87,87,1)"
				},
				height: 100,
				altitude: 0
			})
			loca.add(outLayer)

			let top5 = new Loca.GeoJSONSource({
				data: {
					type: "FeatureCollection",
					features: [
						{
							geometry: {
								coordinates: [116.467041, 39.997771],
								type: "Point"
							},
							type: "Feature",
							properties: {
								h: 110
							}
						},
						{
							geometry: {
								coordinates: [116.45981, 39.992648],
								type: "Point"
							},
							type: "Feature",
							properties: {
								h: 130
							}
						},
						{
							geometry: {
								coordinates: [116.48469, 39.998533],
								type: "Point"
							},
							type: "Feature",
							properties: {
								h: 170
							}
						},
						{
							geometry: {
								coordinates: [116.497672, 39.992139],
								type: "Point"
							},
							type: "Feature",
							properties: {
								h: 150
							}
						},
						{
							geometry: {
								coordinates: [116.504495, 39.97537],
								type: "Point"
							},
							type: "Feature",
							properties: {
								h: 120
							}
						}
					]
				}
			})
			let zMarker = new Loca.ZMarkerLayer({
				zIndex: 120,
				loca
			})
			zMarker.setSource(top5)
			zMarker.setStyle({
				content: (i, feat) => {
					let height = feat.properties.h * heightFactor
					return `<div>
                <p style="width: 400px; height: 80px; line-height: 80px; font-size: 40px; background-image:linear-gradient(to right,rgba(30,215,196,0.4),rgba(30, 215, 196, 0.3),rgba(0,0,0,0.4)); border:4px solid rgba(30, 215, 196, 0.9); color:#fff; border-radius: 20px; text-align:center; margin:0;padding:0;">
                  高度: ${height}
                </p>
              </div>
              `
				},
				unit: "meter",
				rotation: 0,
				alwaysFront: true,
				size: [400 * 2, 80 * 2],
				altitude: (i, feat) => {
					return feat.properties.h * heightFactor
				}
			})
			let pole = new Loca.LaserLayer({
				zIndex: 120,
				loca,
				depth: false
			})
			pole.setSource(top5, {
				unit: "meter",
				height: (i, feat) => {
					return feat.properties.h * heightFactor
				},
				color: "rgba(30,215,196, 1)",
				lineWidth: 15,
				trailLength: 50000,
				repeat: 0
			})

			loca.animate.start()
			loca.pointLight.intensity = 0
			loca.ambLight.intensity = 1
		})
		.catch(e => {
			console.log(e)
		})
}
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	width: 100%;
	height: 100%;

	.map {
		width: 100%;
		height: 100%;
	}
}
</style>
