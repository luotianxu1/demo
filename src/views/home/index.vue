<template>
	<el-container style="height: 100%">
		<el-header>
			<div
				class="nav"
				v-for="(item, index) in typeList"
				:key="index"
				:class="active === index ? 'active' : ''"
				@click="changeFrom(item.index)"
			>
				{{ item.title }}
			</div>
		</el-header>
		<el-main>
			<el-scrollbar>
				<div v-for="item in formList" :key="item.title">
					<span>{{ item.title }}</span>
					<el-divider></el-divider>
					<el-row :gutter="10">
						<el-col :span="4" v-for="card in item.children" :key="card.url">
							<Card :card="card"></Card>
						</el-col>
					</el-row>
				</div>
			</el-scrollbar>
		</el-main>
	</el-container>
</template>

<script lang="ts" setup>
import Card from "./components/Card.vue"
import { threejsList } from "./data/threejs"
import { threejsDemoList } from "./data/threejsDemo"
import { leafletList } from "./data/leaflet"
import { canvasList } from "./data/canvas"
import { openlayersList } from "./data/openlayers"
import { gaoDeList } from "./data/gaoDe"
import { echartsList } from "./data/echarts"
import { elementList } from "./data/element"
import { baiduList } from "./data/baidu"

const list = [
	...threejsList,
	...threejsDemoList,
	...canvasList,
	...leafletList,
	...openlayersList,
	...gaoDeList,
	...echartsList,
	...elementList,
	...baiduList
]

let active = ref(0)
const typeList = list.map(item => {
	return {
		title: item.title,
		index: item.index
	}
})

const changeFrom = (index: number) => {
	active.value = index
}

const formList = computed(() => {
	return list.filter(item => item.index === active.value)[0].children
})
</script>

<style scoped lang="scss">
.el-header {
	position: relative;
	display: flex;
	color: #666;
	background-color: rgba(255, 255, 255, 0.9);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	align-items: center;
	justify-content: center;
}

.el-main {
	padding: 20px;
}

.nav {
	position: relative;
	margin: 0 10px;
	cursor: pointer;

	&::after {
		position: absolute;
		right: 50%;
		bottom: -10px;
		left: 50%;
		height: 2px;
		background: #2196f3;
		border-radius: 1px;
		content: " ";
		visibility: hidden;
		transition: left 0.2s ease-in-out, right 0.2s ease-in-out;
	}

	&:hover {
		&::after {
			right: 0;
			left: 0;
			visibility: visible;
		}
	}
}

.active {
	color: #2196f3;

	&::after {
		position: absolute;
		right: 0;
		bottom: -10px;
		left: 0;
		height: 2px;
		background: #2196f3;
		border-radius: 1px;
		content: " ";
		visibility: visible;
	}
}

.el-col {
	margin-bottom: 10px;
	border-radius: 4px;
}

.title {
	font-size: 24px;
}

:deep(.is-horizontal) {
	display: none !important;
}

.el-divider {
	margin: 10px 0;
}
</style>
