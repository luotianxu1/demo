<template>
	<div class="main">
		<div class="btnList">
			<el-radio-group v-model="radio1" class="ml-4" @change="change">
				<el-radio label="rule" size="large">距离测量</el-radio>
				<el-radio label="measureArea" size="large">面积测量</el-radio>
			</el-radio-group>
			<el-button type="primary" @click="clear">清除</el-button>
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

const radio1 = ref("rule")
let map: AMap.Map
let aMap: any
let mouseTool: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.MouseTool"]
	})
		.then(AMap => {
			aMap = AMap
			map = new AMap.Map("container", {
				center: [116.395577, 39.892257],
				zoom: 14
			})
			mouseTool = new AMap.MouseTool(map)
			change()
		})
		.catch(e => {
			console.log(e)
		})
}

const change = () => {
	draw(radio1.value)
}

const draw = (type: string) => {
	switch (type) {
		case "rule": {
			mouseTool.rule({
				startMarkerOptions: {
					//可缺省
					icon: new aMap.Icon({
						size: new aMap.Size(19, 31), //图标大小
						imageSize: new aMap.Size(19, 31),
						image: "//webapi.amap.com/theme/v1.3/markers/b/start.png"
					}),
					offset: new aMap.Pixel(-9, -31)
				},
				endMarkerOptions: {
					//可缺省
					icon: new aMap.Icon({
						size: new aMap.Size(19, 31), //图标大小
						imageSize: new aMap.Size(19, 31),
						image: "//webapi.amap.com/theme/v1.3/markers/b/end.png"
					}),
					offset: new aMap.Pixel(-9, -31)
				},
				midMarkerOptions: {
					//可缺省
					icon: new aMap.Icon({
						size: new aMap.Size(19, 31), //图标大小
						imageSize: new aMap.Size(19, 31),
						image: "//webapi.amap.com/theme/v1.3/markers/b/mid.png"
					}),
					offset: new aMap.Pixel(-9, -31)
				},
				lineOptions: {
					//可缺省
					strokeStyle: "solid",
					strokeColor: "#FF33FF",
					strokeOpacity: 1,
					strokeWeight: 2
				}
				//同 RangingTool 的 自定义 设置，缺省为默认样式
			})
			break
		}
		case "measureArea": {
			mouseTool.measureArea({
				strokeColor: "#80d8ff",
				fillColor: "#80d8ff",
				fillOpacity: 0.3
				//同 Polygon 的 Option 设置
			})
			break
		}
	}
}

const clear = () => {
	mouseTool.close(true)
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
		padding: 5px;
		overflow: auto;
		flex-wrap: wrap;
		align-content: flex-start;
	}

	.map {
		flex: 1;
	}
}
</style>
