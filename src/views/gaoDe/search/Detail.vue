<template>
	<div class="main">
		<div class="btnList">
			<el-select
				v-model="input"
				filterable
				remote
				reserve-keyword
				placeholder="请输入关键字"
				:remote-method="remoteMethod"
				:loading="loading"
				@change="getDetail"
			>
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
			</el-select>
		</div>
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
let overlayGroups: AMap.OverlayGroup
let autoComplete: any
let placeSearch: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.AutoComplete", "AMap.PlaceSearch"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			overlayGroups = new AMap.OverlayGroup()
			map.add(overlayGroups as any)

			autoComplete = new AMap.Autocomplete()

			placeSearch = new AMap.PlaceSearch({
				citylimit: false, //是否强制限制在设置的城市内搜索
				pageSize: 10, // 单页显示结果条数
				children: 0, //不展示子节点数据
				pageIndex: 1, //页码
				extensions: "base" //返回基本地址信息
			})
		})
		.catch(e => {
			console.log(e)
		})
}

interface ListItem {
	value: string
	label: string
	adcode: number
}
const input = ref("")
const loading = ref(false)
const options = ref<ListItem[]>([])
const remoteMethod = (query: string) => {
	loading.value = true
	if (query) {
		autoComplete.search(query, function (status: string, result: any) {
			if (status === "complete") {
				options.value = result.tips.map((item: any) => {
					return {
						value: `${item.id}`,
						label: `${item.name}`,
						adcode: `${item.adcode}`,
						id: `${item.id}`
					}
				})
			}
		})
	} else {
		options.value = []
	}
	loading.value = false
}

const getDetail = (e: string) => {
	overlayGroups.clearOverlays()
	placeSearch.getDetails(e, function (status: string, result: any) {
		if (status === "complete" && result.info === "OK") {
			console.log(result)

			let poiArr = result.poiList.pois
			//添加marker
			let marker = new AMap.Marker({
				map: map,
				position: poiArr[0].location
			})
			map.setCenter(marker.getPosition()!)
			overlayGroups.addOverlay(marker)
		}
	})
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

.el-button {
	margin: 5px;
}
</style>
