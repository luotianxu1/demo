<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.markercluster"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	L.tileLayer("http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}", {
		maxZoom: 18,
		minZoom: 3,
		attribution: "© OpenStreetMap"
	}).addTo(map)
	const center_point: LatLngExpression = [24.522422570142833, 118.11471659369913]
	map.setView(center_point, 12)

	addCluster()
})

function addCluster() {
	//模拟1000个聚合点
	let clusterMarkers = []
	for (let i = 0; i < 1000; i++) {
		//marker参数设置
		const lat: LatLngExpression = [24.42 + Math.random() * 0.1, 118.06 + Math.random() * 0.1]
		let marker = L.marker(lat, {})
		marker.bindPopup("聚合点：" + i)
		clusterMarkers.push(marker)
	}
	let clusterLayer = (L as any).markerClusterGroup({
		singleMarkerMode: false, //是否展示图标 true为数字1  false为marker图标
		maxClusterRadius: 100, //最大聚合像素，该配置影响地图的聚合数量
		iconCreateFunction: customStyle
	})
	clusterLayer.addLayers(clusterMarkers)
	map?.addLayer(clusterLayer)
}

//可自由定义聚合点的样式
function customStyle(cluster: any) {
	let childCount = cluster.getChildCount()
	let c = " cluster-marker-"
	if (childCount < 30) {
		c += "small"
	} else if (childCount < 200) {
		c += "medium"
	} else {
		c += "large"
	}
	return new L.DivIcon({
		html: "<div><span>" + childCount + "</span></div>",
		className: "marker-cluster" + c,
		iconSize: new L.Point(40, 40)
	})
}
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}

.cluster-marker-small {
	background-color: rgba(241, 211, 87, 0.6);
}

.cluster-marker-small div {
	background-color: rgba(0, 0, 255, 0.6);
}

.cluster-marker-medium {
	background-color: rgba(241, 211, 87, 0.6);
}

.cluster-marker-medium div {
	background-color: rgba(255, 255, 0, 0.6);
}

.cluster-marker-large {
	background-color: rgba(241, 211, 87, 0.6);
}

.cluster-marker-large div {
	background-color: rgba(255, 0, 0, 0.6);
}
</style>
