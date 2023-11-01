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
				zoom: 16.82,
				center: [116.597005, 39.914388],
				pitch: 80,
				rotation: 205,
				showLabel: false,
				mapStyle: "amap://styles/dark",
				viewMode: "3D"
			})
			loca = new Loca.Container({
				map: map
			})
			let geo = new Loca.GeoJSONSource({
				data: {
					type: "FeatureCollection",
					features: [
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.59008979797363, 39.90058428630659]
							},
							properties: {
								name: "远洋一方润园",
								price: 65000,
								count: 92
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.59378051757811, 39.89704498575387]
							},
							properties: {
								name: "远洋一方溪语苑",
								price: 65000,
								count: 52
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.59366250038148, 39.90657598772839]
							},
							properties: {
								name: "东会新村",
								price: 49000,
								count: 53
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.60161256790161, 39.91717540663561]
							},
							properties: {
								name: "北京新天地（东区）",
								price: 62000,
								count: 639
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.59092664718628, 39.913423004886894]
							},
							properties: {
								name: "京通苑阳光华苑",
								price: 48000,
								count: 651
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.59223556518555, 39.92263906258135]
							},
							properties: {
								name: "龙湖长楹天街",
								price: 76000,
								count: 12
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.58066987991333, 39.92166814352715]
							},
							properties: {
								name: "柏林爱乐",
								price: 62000,
								count: 471
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.5806484222412, 39.91766912840225]
							},
							properties: {
								name: "汇鸿家园",
								price: 58000,
								count: 65
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.5688467025757, 39.91737289576941]
							},
							properties: {
								name: "三间房南里",
								price: 53000,
								count: 45
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.57416820526123, 39.9034814381334]
							},
							properties: {
								name: "康惠园三号院",
								price: 48000,
								count: 95
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.60126924514769, 39.89893812274133]
							},
							properties: {
								name: "东一时区小区",
								price: 54000,
								count: 199
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.60905838012695, 39.90331683051646]
							},
							properties: {
								name: "八里桥南院",
								price: 44000,
								count: 2
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.62437915802002, 39.9101312551376]
							},
							properties: {
								name: "西马庄园",
								price: 36000,
								count: 102
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.60266399383545, 39.929747745342944]
							},
							properties: {
								name: "保利嘉园1号院",
								price: 53000,
								count: 125
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.56524181365967, 39.92691752490338]
							},
							properties: {
								name: "朝青知筑",
								price: 80000,
								count: 36
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.54335498809814, 39.903678966751734]
							},
							properties: {
								name: "北花园小区1号院",
								price: 50000,
								count: 2
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.54949188232422, 39.921421297504764]
							},
							properties: {
								name: "瑞和国际",
								price: 49000,
								count: 74
							}
						},
						{
							type: "Feature",
							geometry: {
								type: "Point",
								coordinates: [116.63712501525877, 39.92444921388591]
							},
							properties: {
								name: "天赐良园（东区）",
								price: 49000,
								count: 51
							}
						}
					]
				}
			})
			// 文字主体图层
			let zMarker = new Loca.ZMarkerLayer({
				loca: loca,
				zIndex: 120
			})
			zMarker.setSource(geo)
			zMarker.setStyle({
				content: (i, feat) => {
					let props = feat.properties
					let leftColor = props.price < 60000 ? "rgba(0, 28, 52, 0.6)" : "rgba(33,33,33,0.6)"
					let rightColor = props.price < 60000 ? "#038684" : "rgba(172, 137, 51, 0.3)"
					let borderColor = props.price < 60000 ? "#038684" : "rgba(172, 137, 51, 1)"
					return (
						'<div style="width: 490px; height: 228px; padding: 0 0;">' +
						'<p style="display: block; height:80px; line-height:80px;font-size:40px;background-image: linear-gradient(to right, ' +
						leftColor +
						"," +
						leftColor +
						"," +
						rightColor +
						",rgba(0,0,0,0.4)); border:4px solid " +
						borderColor +
						'; color:#fff; border-radius: 15px; text-align:center; margin:0; padding:5px;">' +
						props["name"] +
						": " +
						props["price"] / 10000 +
						'</p><span style="width: 130px; height: 130px; margin: 0 auto; display: block; background: url(https://a.amap.com/Loca/static/loca-v2/demos/images/prism_' +
						(props["price"] < 60000 ? "blue" : "yellow") +
						'.png);"></span></div>'
					)
				},
				unit: "meter",
				rotation: 0,
				alwaysFront: true,
				size: [490 / 2, 222 / 2],
				altitude: 0
			})
			// 浮动三角
			let triangleZMarker = new Loca.ZMarkerLayer({
				loca: loca,
				zIndex: 119
			})
			triangleZMarker.setSource(geo)
			triangleZMarker.setStyle({
				content: (i, feat) => {
					return (
						'<div style="width: 120px; height: 120px; background: url(https://a.amap.com/Loca/static/loca-v2/demos/images/triangle_' +
						(feat.properties.price < 60000 ? "blue" : "yellow") +
						'.png);"></div>'
					)
				},
				unit: "meter",
				rotation: 0,
				alwaysFront: true,
				size: [60, 60],
				altitude: 15
			})
			triangleZMarker.addAnimate({
				key: "altitude",
				value: [0, 1],
				random: true,
				transform: 1000,
				delay: 2000,
				yoyo: true,
				repeat: 999999
			})
			// 呼吸点 蓝色
			let scatterBlue = new Loca.ScatterLayer({
				loca,
				zIndex: 110,
				opacity: 1,
				visible: true,
				zooms: [2, 26],
				depth: false
			})

			scatterBlue.setSource(geo)
			scatterBlue.setStyle({
				unit: "meter",
				size: function (i, feat) {
					return feat.properties.price < 60000 ? [90, 90] : [0, 0]
				},
				texture: "https://a.amap.com/Loca/static/loca-v2/demos/images/scan_blue.png",
				altitude: 20,
				duration: 2000,
				animate: true
			})
			// 呼吸点 金色
			let scatterYellow = new Loca.ScatterLayer({
				loca,
				zIndex: 110,
				opacity: 1,
				visible: true,
				zooms: [2, 26],
				depth: false
			})

			scatterYellow.setSource(geo)
			scatterYellow.setStyle({
				unit: "meter",
				size: function (i, feat) {
					return feat.properties.price > 60000 ? [90, 90] : [0, 0]
				},
				texture: "https://a.amap.com/Loca/static/loca-v2/demos/images/scan_yellow.png",
				altitude: 20,
				duration: 2000,
				animate: true
			})
			// 启动帧
			loca.animate.start()
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

	.btn {
		display: flex;
		width: 320px;
		padding: 10px;
		flex-direction: column;

		.el-button {
			margin: 0 0 5px 0;
		}
	}
}
</style>
