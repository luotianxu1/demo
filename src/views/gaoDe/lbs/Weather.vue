<template>
	<div class="main">
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

onMounted(() => {
	initMap()
})

let map: AMap.Map
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.Weather"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			const weather = new AMap.Weather()

			weather.getLive("朝阳区", function (err: any, data: any) {
				if (!err) {
					let str = []
					str.push("<h4 >实时天气" + "</h4><hr>")
					str.push("<p>城市/区：" + data.city + "</p>")
					str.push("<p>天气：" + data.weather + "</p>")
					str.push("<p>温度：" + data.temperature + "℃</p>")
					str.push("<p>风向：" + data.windDirection + "</p>")
					str.push("<p>风力：" + data.windPower + " 级</p>")
					str.push("<p>空气湿度：" + data.humidity + "</p>")
					str.push("<p>发布时间：" + data.reportTime + "</p>")
					let marker = new AMap.Marker({ map: map, position: map.getCenter() })
					let infoWin = new AMap.InfoWindow({
						content:
							'<div class="info" style="position:inherit;margin-bottom:0;">' + str.join("") + '</div><div class="sharp"></div>',
						isCustom: true,
						offset: new AMap.Pixel(0, -37)
					})
					infoWin.open(map, marker.getPosition())
					marker.on("mouseover", function () {
						infoWin.open(map, marker.getPosition())
					})
				}
			})

			//未来4天天气预报
			weather.getForecast("朝阳区", function (err: any, data: any) {
				if (err) {
					return
				}
				console.log(data)
			})
		})
		.catch(e => {
			console.log(e)
		})
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.map {
		flex: 1;
	}
}

:deep(.info) {
	position: fixed;
	top: 1rem;
	right: 1rem;
	width: auto;
	min-width: 22rem;
	padding: 0.75rem 1.25rem;
	margin-bottom: 1rem;
	background-color: white;
	border-width: 0;
	border-radius: 0.25rem;
	box-shadow: 0 2px 6px 0 rgba(114, 124, 245, 0.5);
}

.weather {
	display: inline-block;
	width: 5rem;
	padding-left: 0.5rem;
}

.sharp {
	position: inherit;
	width: 1rem;
	height: 1rem;
	margin-top: -6px;
	margin-left: 10.5rem;
	background-color: white;
	transform: rotateZ(45deg);
	box-shadow: 2px 2px 3px rgba(114, 124, 245, 0.5);
}
</style>
