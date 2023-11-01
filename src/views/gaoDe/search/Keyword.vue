<template>
	<div class="main">
		<div class="btnList">
			<el-input v-model="input3" placeholder="Please input" class="input-with-select">
				<template #append>
					<el-button :icon="Search" @click="search" />
				</template>
			</el-input>
		</div>
		<div class="map" id="container"></div>
	</div>
</template>
<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import { Search } from "@element-plus/icons-vue"

onMounted(() => {
	initMap()
})

let map: AMap.Map
let placeSearch: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.PlaceSearch"]
	})
		.then(AMap => {
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})

			placeSearch = new AMap.PlaceSearch({
				pageSize: 5, // 单页显示结果条数
				pageIndex: 1, // 页码
				city: "010", // 兴趣点城市
				citylimit: true, //是否强制限制在设置的城市内搜索
				map: map, // 展现结果的地图实例
				panel: "panel", // 结果列表将在此容器中进行展示。
				autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
			})
		})
		.catch(e => {
			console.log(e)
		})
}

const input3 = ref()
const search = () => {
	placeSearch.search(input3.value)
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
