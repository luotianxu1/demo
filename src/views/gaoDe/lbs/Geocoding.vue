<template>
	<div class="main">
		<div class="btnList">
			<el-select v-model="data.province" filterable placeholder="请选择省" @change="search">
				<el-option v-for="item in options['province']" :key="item.label" :label="item.label" :value="item.label" />
			</el-select>
			<el-select v-model="data.city" filterable placeholder="请选择市" @change="search">
				<el-option v-for="item in options['city']" :key="item.label" :label="item.label" :value="item.label" />
			</el-select>
			<el-select v-model="data.district" filterable placeholder="请选择区" @change="search">
				<el-option v-for="item in options['district']" :key="item.label" :label="item.label" :value="item.label" />
			</el-select>
			<el-select v-model="data.street" filterable placeholder="请选择街道" @change="setCenter">
				<el-option v-for="item in options['street']" :key="item.label" :label="item.label" :value="item.label" />
			</el-select>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"

interface OptionItem {
	label: string
	value: string
	lat: number
	lng: number
}
interface Options {
	province: OptionItem[]
	city: OptionItem[]
	district: OptionItem[]
	street: OptionItem[]
}

onMounted(() => {
	initMap()
})

let map: any
let aMap: any
let districtSearch: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.DistrictSearch"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("map", {
				resizeEnable: true,
				zoom: 13 //地图显示的缩放级别
			})

			const opts = {
				subdistrict: 1, //返回下一级行政区
				showbiz: false, //最后一级返回街道信息
				extensions: "all"
			}
			districtSearch = new AMap.DistrictSearch(opts)
			search("中国")
		})
		.catch(e => {
			console.log(e)
		})
}

let polygons: any = []
const options = shallowReactive<Options>({
	province: [],
	city: [],
	district: [],
	street: []
})
const data = reactive({
	province: "",
	city: "",
	district: "",
	street: ""
})

const search = (val: string) => {
	for (let i = 0, l = polygons.length; i < l; i++) {
		polygons[i].setMap(null)
	}
	districtSearch.search(val, (status: string, result: any) => {
		if (status === "complete") {
			getData(result.districtList[0])
		}
	})
}

const getData = (res: any) => {
	const bounds = res.boundaries
	if (bounds && map) {
		for (let i = 0, l = bounds.length; i < l; i++) {
			let polygon = new aMap.Polygon({
				map: map,
				strokeWeight: 1,
				strokeColor: "#0091ea",
				fillColor: "#80d8ff",
				fillOpacity: 0.2,
				path: bounds[i]
			})
			polygons.push(polygon)
		}
		map.setFitView()
	}

	const subList = res.districtList
	let num = Object.keys(options).indexOf(subList[0].level)
	clear(num)
	if (subList) {
		let nextType = Object.keys(options)[num]
		options[nextType] = res.districtList.map((item: any) => {
			return {
				label: item.name,
				value: item.adcode,
				lat: item.center.lat,
				lng: item.center.lng
			}
		})
	}
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

const setCenter = (val: string) => {
	let arr = options.street.filter(item => item.label === val)[0]
	if (arr && map) {
		map.setCenter([arr.lng, arr.lat])
	}
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
	}
}
</style>
