<template>
	<baidu-map
		class="map"
		ak="UAH6LeDfjlPbHTtKOchk0lnAhYIu2gWE"
		v="3.0"
		type="API"
		:center="{ lng: 116.404, lat: 39.915 }"
		:zoom="15"
		:scroll-wheel-zoom="true"
		:mapStyle="mapStyle"
	>
	</baidu-map>
</template>
<script setup lang="ts">
import { BaiduMap } from "vue-baidu-map-3x"
import json from "./custom_map_config.json"

const mapStyle = ref({
	styleJson: json
})
</script>
<style lang="scss" scoped>
.map {
	width: 100%;
	height: 300%;
}
</style>
