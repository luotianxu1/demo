<template>
	<div id="sidebar">
		<h1>leaflet-sidebar</h1>
	</div>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import * as L from "leaflet"
import "leaflet-sidebar"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map").setView([36.09, 120.35], 13)
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}").addTo(map)

	let sidebar = (L.control as any).sidebar("sidebar", {
		position: "left"
	})

	map.addControl(sidebar)
	setTimeout(function () {
		sidebar.show()
	}, 500)

	//添加一个标记并设置其点击事件，点击时显示侧边栏
	let marker = L.marker([36.09, 120.35])
		.addTo(map)
		.on("click", function () {
			sidebar.toggle()
		})

	//设置地图点击事件，侧边栏隐藏
	map.on("click", function () {
		sidebar.hide()
	})
})
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
