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
let autoComplete: any
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

			autoComplete = new AMap.Autocomplete()
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
						value: `${item.name}`,
						label: `${item.name}`,
						adcode: `${item.adcode}`
					}
				})
			}
		})
	} else {
		options.value = []
	}
	loading.value = false
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
