<template>
	<div class="main">
		<div class="btnList">
			<el-select v-model="data.province" filterable placeholder="请选择省" @change="search">
				<el-option v-for="item in options['province']" :key="item.label" :label="item.label" :value="item.label" />
			</el-select>
			<el-select v-model="data.city" filterable placeholder="请选择市" @change="search">
				<el-option v-for="item in options['city']" :key="item.label" :label="item.label" :value="item.label" />
			</el-select>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import axios from "axios"
import * as echarts from "echarts"

interface OptionItem {
	label: string
	value: string
	lat: number
	lng: number
}
interface Options {
	province: OptionItem[]
	city: OptionItem[]
}

onMounted(() => {
	initECharts()
	initMap()
})

let districtSearch: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.DistrictSearch"]
	})
		.then(AMap => {
			districtSearch = new AMap.DistrictSearch({
				subdistrict: 1, //返回下一级行政区
				showbiz: true, //最后一级返回街道信息
				extensions: "all"
			})
			search("中国")
		})
		.catch(e => {
			console.log(e)
		})
}

const options = shallowReactive<Options>({
	province: [],
	city: []
})
const data = reactive({
	province: "",
	city: ""
})

const search = (val: string) => {
	districtSearch.search(val, (status: string, result: any) => {
		if (status === "complete") {
			getData(result.districtList[0])
		}
	})
}

const getData = (res: any) => {
	const subList = res.districtList
	let num = Object.keys(options).indexOf(subList[0].level)
	clear(num)
	if (subList) {
		let nextType = Object.keys(options)[num]
		options[nextType] = res.districtList.map((item: any) => {
			return {
				label: item.name,
				value: item.adcode
			}
		})
	}
	getGeoJson(res.adcode)
}

const clear = (num: number) => {
	Object.keys(options).forEach((item, index) => {
		if (index >= num) {
			options[item] = []
		}
	})
	Object.keys(data).forEach((item, index) => {
		if (index >= num) {
			data[item] = ""
		}
	})
}

let mainChart
let queue = ref<Array<string>>([])
const echartsOptions = {
	tooltip: {},
	title: {
		text: "",
		y: "50px",
		x: "center"
	},
	geo: [
		{
			map: "",
			zoom: 0.1,
			roam: "scale",
			itemStyle: {
				areaColor: "#2e72bf",
				borderColor: "#232733"
			}
		}
	],
	series: [
		{
			type: "map",
			geoIndex: 0,
			data: []
		}
	]
}

const initECharts = () => {
	mainChart = echarts.init(document.getElementById("map") as HTMLElement)
}

const getGeoJson = async (name: string) => {
	await axios.get(`https://geo.datav.aliyun.com/areas_v3/bound/${name}_full.json`).then(res => {
		if (res.status === 200) {
			if (queue.value.length >= 1) {
				echartsOptions.geo[0].zoom = 0.01
				mainChart.setOption(echartsOptions)

				setTimeout(() => {
					echarts.registerMap(name, {
						geoJSON: res.data,
						specialAreas: {}
					})
					echartsOptions.geo[0].map = name
					echartsOptions.geo[0].zoom = 1
					mainChart.setOption(echartsOptions)
				}, 500)
			} else {
				echarts.registerMap(name, { geoJSON: res.data, specialAreas: {} })
				echartsOptions.geo[0].map = name
				echartsOptions.geo[0].zoom = 1
				mainChart.setOption(echartsOptions)
			}

			if (name !== queue.value[queue.value.length - 1]) {
				queue.value.push(name)
			}
		}
	})
}
</script>

<style lang="scss" scoped>
.main {
	width: 100%;
	height: 100vh;
	display: flex;

	.btnList {
		width: 200px;
		display: flex;
		flex-wrap: wrap;
		align-content: flex-start;
		overflow: auto;
		padding: 5px;
	}

	.map {
		flex: 1;
		background-color: #232733;
	}
}
</style>
