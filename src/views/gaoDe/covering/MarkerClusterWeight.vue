<template>
	<div class="main">
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import { points } from "./data/buildings"
import { district } from "./data/district"

onMounted(() => {
	initMap()
})

let map: AMap.Map
const clusterIndexSet = {
	city: {
		minZoom: 2,
		maxZoom: 10
	},
	district: {
		minZoom: 10,
		maxZoom: 12
	},
	area: {
		minZoom: 12,
		maxZoom: 15
	},
	community: {
		minZoom: 15,
		maxZoom: 22
	}
}

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.IndexCluster"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [104.937478, 35.439575],
				zoom: 5,
				mapStyle: "amap://styles/grey"
			})

			new AMap.IndexCluster(map, points, {
				renderClusterMarker: _renderClusterMarker,
				clusterIndexSet: clusterIndexSet
			})
		})
		.catch(e => {
			console.log(e)
		})
}

function getStyle(context: any) {
	let clusterData = context.clusterData // 聚合中包含数据
	let index = context.index // 聚合的条件
	let count = context.count // 聚合中点的总数
	let color = ["8,60,156", "66,130,198", "107,174,214", "78,200,211"]
	let indexs = ["city", "district", "area", "community"]
	let i = indexs.indexOf(index["mainKey"])
	let text = clusterData[0][index["mainKey"]]
	let size = Math.round(30 + Math.pow(count / points.length, 1 / 5) * 70)
	if (i <= 2) {
		let extra = '<span class="showCount">' + context.count + "套</span>"
		text = '<span class="showName">' + text + "</span>"
		text += extra
	} else {
		size = 12 * text.length + 20
	}
	let style = {
		bgColor: "rgba(" + color[i] + ",.8)",
		borderColor: "rgba(" + color[i] + ",1)",
		text: text,
		size: size,
		index: i,
		color: "#ffffff",
		textAlign: "center",
		boxShadow: "0px 0px 5px rgba(0,0,0,0.8)"
	}
	return style
}

function getPosition(context: any) {
	let key = context.index.mainKey
	let dataItem = context.clusterData && context.clusterData[0]
	let districtName = dataItem[key]
	if (!district[districtName as keyof typeof district]) {
		return null
	}
	let center: any = district[districtName as keyof typeof district].center.split(",")
	let centerLnglat = new AMap.LngLat(center[0], center[1])
	return centerLnglat
}

// 自定义聚合点样式
function _renderClusterMarker(context: any) {
	let styleObj = getStyle(context)
	// 自定义点标记样式
	let div = document.createElement("div")
	div.className = "amap-cluster"
	div.style.backgroundColor = styleObj.bgColor
	div.style.width = styleObj.size + "px"
	if (styleObj.index <= 2) {
		div.style.height = styleObj.size + "px"
		// 自定义点击事件
		context.marker.on("click", function (e: any) {
			let curZoom = map.getZoom()
			if (curZoom < 20) {
				curZoom += 1
			}
			map.setZoomAndCenter(curZoom, e.lnglat)
		})
	}
	div.style.border = "solid 1px " + styleObj.borderColor
	div.style.borderRadius = styleObj.size + "px"
	div.innerHTML = styleObj.text
	div.style.color = styleObj.color
	div.style.textAlign = styleObj.textAlign
	div.style.boxShadow = styleObj.boxShadow
	context.marker.setContent(div)
	// 自定义聚合点标记显示位置
	let position = getPosition(context)
	if (position) {
		context.marker.setPosition(position)
	}
	context.marker.setAnchor("center")
}
</script>
<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 250px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.map {
		flex: 1;
	}
}

:deep(.amap-cluster) {
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	font-size: 12px;
}
</style>
