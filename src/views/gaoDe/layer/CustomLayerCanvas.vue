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
			const map = new AMap.Map("container", {
				center: [116.306206, 39.975468],
				zooms: [2, 10],
				zoom: 3
			})

			function getData(callback: any) {
				const search = new AMap.DistrictSearch()
				search.search("中国", function (status: any, data: any) {
					if (status === "complete") {
						let positions = []
						let provinces = data["districtList"][0]["districtList"]
						for (let i = 0; i < provinces.length; i += 1) {
							positions.push({
								center: provinces[i].center,
								radius: Math.max(2, Math.floor(Math.random() * 10))
							})
						}
						callback(positions)
					}
				})
			}

			function addLayer(positions: any) {
				const canvas = document.createElement("canvas")
				const customLayer = new AMap.CustomLayer(canvas, {
					zooms: [3, 10],
					zIndex: 120
				})
				const onRender = function () {
					let retina = AMap.Browser.retina
					let size = map.getSize() //resize
					let width = size.width
					let height = size.height
					canvas.style.width = width + "px"
					canvas.style.height = height + "px"
					if (retina) {
						//高清适配
						width *= 2
						height *= 2
					}
					canvas.width = width
					canvas.height = height //清除画布
					let ctx = canvas.getContext("2d")
					ctx!.fillStyle = "#08f"
					ctx!.strokeStyle = "#fff"
					ctx!.beginPath()
					for (let i = 0; i < positions.length; i += 1) {
						let center = positions[i].center
						let pos = map.lngLatToContainer(center)
						let r = positions[i].radius
						if (retina) {
							pos = pos.multiplyBy(2)
							r *= 2
						}
						ctx!.moveTo(pos.x + r, pos.y)
						ctx!.arc(pos.x, pos.y, r, 0, 2 * Math.PI)
					}
					ctx!.lineWidth = retina ? 6 : 3
					ctx!.closePath()
					ctx!.stroke()
					ctx!.fill()
				}!
				customLayer.render = onRender
				customLayer.setMap(map)
			}

			getData(addLayer)
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
