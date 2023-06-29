<template>
	<div class="main">
		<div class="btnList">
			<el-radio-group v-model="radio1" class="ml-4" @change="change">
				<el-radio label="zoomIn" size="large">拉框放大</el-radio>
				<el-radio label="zoomOut" size="large">拉框缩小</el-radio>
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

const radio1 = ref("zoomIn")
let map: AMap.Map
let mouseTool: any
const initMap = () => {
	AMapLoader.load({
		key: AMAP_KEY,
		version: "2.0",
		plugins: ["AMap.MouseTool"]
	})
		.then(AMap => {
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
		case "zoomIn": {
			mouseTool.rectZoomIn({
				strokeColor: "#80d8ff",
				fillColor: "#80d8ff",
				fillOpacity: 0.3
			})
			break
		}
		case "zoomOut": {
			mouseTool.rectZoomOut({
				strokeColor: "#80d8ff",
				fillColor: "#80d8ff",
				fillOpacity: 0.3
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
