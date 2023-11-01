<template>
	<div class="main">
		<div class="btnList">
			<el-form :model="form" label-width="120px">
				<el-form-item label="比例尺">
					<el-switch v-model="form.scale" @change="changeScale" />
				</el-form-item>
				<el-form-item label="显示鹰眼">
					<el-switch v-model="form.hawkEye" @change="changeHawkEye" />
				</el-form-item>
				<el-form-item label="工具条">
					<el-switch v-model="form.toolBar" @change="changeToolBar" />
				</el-form-item>
				<el-form-item label="工具条方向盘">
					<el-switch v-model="form.controlBar" @change="changeControlBar" />
				</el-form-item>
				<el-form-item label="地图类型">
					<el-switch v-model="form.type" @change="changeMapType" />
				</el-form-item>
			</el-form>
		</div>
		<div class="map" id="map"></div>
	</div>
</template>

<script lang="ts" setup>
import { AMAP_KEY } from "@/config/global"
import AMapLoader from "@amap/amap-jsapi-loader"
import "@amap/amap-jsapi-types"

const map = shallowRef<AMap.Map>()
let toolBar: AMap.Control
let scale: AMap.Control
let controlBar: AMap.Control
let overView: AMap.Control
let mapType: AMap.Control
onMounted(() => {
	initMap()
})

const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY, // 申请好的Web端开发者Key，首次调用 load 时必填
		version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
		plugins: ["AMap.Scale", "AMap.HawkEye", "AMap.ToolBar", "AMap.ControlBar", "AMap.MapType"] // 需要使用的的插件列表，如比例尺'AMap.Scale'等
	})
		.then(AMap => {
			const mapOptions: AMap.MapOptions = {
				center: [116.472268, 39.995693],
				viewMode: "3D"
			}
			//设置地图容器id
			map.value = new AMap.Map("map", mapOptions)

			scale = new AMap.Scale()
			map.value?.addControl(scale)
			toolBar = new AMap.ToolBar({
				position: {
					top: "20px",
					left: "20px"
				}
			})
			map.value?.addControl(toolBar)
			controlBar = new AMap.ControlBar({
				position: {
					top: "10px",
					right: "10px"
				}
			})
			map.value?.addControl(controlBar)
			overView = new AMap.HawkEye({
				opened: false
			})
			map.value?.addControl(overView)
			mapType = new AMap.MapType({
				defaultType: 0,
				position: {
					top: "120px",
					right: "20px"
				}
			})
			map.value?.addControl(mapType)
		})
		.catch(e => {
			console.log(e)
		})
}

const form = reactive({
	scale: true,
	hawkEye: true,
	toolBar: true,
	controlBar: true,
	type: true
})

const changeScale = (val: any) => {
	val ? map.value?.addControl(scale) : map.value?.removeControl(scale)
}

const changeHawkEye = (val: any) => {
	val ? map.value?.addControl(overView) : map.value?.removeControl(overView)
}

const changeToolBar = (val: any) => {
	val ? map.value?.addControl(toolBar) : map.value?.removeControl(toolBar)
}

const changeControlBar = (val: any) => {
	val ? map.value?.addControl(controlBar) : map.value?.removeControl(controlBar)
}

const changeMapType = (val: any) => {
	val ? map.value?.addControl(mapType) : map.value?.removeControl(mapType)
}
</script>

<style lang="scss" scoped>
.main {
	display: flex;
	width: 100%;
	height: 100vh;

	.btnList {
		display: flex;
		width: 200px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	#map {
		flex: 1;
	}
}

.el-button {
	margin: 5px;
}
</style>
