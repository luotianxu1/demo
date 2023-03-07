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
				<div v-for="(item, index) in formList" :key="index">
					<span>{{ item.title }}</span>
					<el-divider></el-divider>
					<el-row :gutter="10">
						<el-col :span="4" v-for="(card, index) in item.children" :key="index">
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
import { list } from "./data"

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
	align-items: center;
	justify-content: center;
	background-color: rgba(255, 255, 255, 0.9);
	color: #666;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.el-main {
	padding: 20px;
}

.nav {
	position: relative;
	margin: 0 10px;

	&::after {
		content: " ";
		position: absolute;
		right: 50%;
		bottom: -5px;
		left: 50%;
		height: 2px;
		border-radius: 1px;
		background: #2196f3;
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
		content: " ";
		position: absolute;
		right: 0;
		left: 0;
		bottom: -5px;
		height: 2px;
		border-radius: 1px;
		background: #2196f3;
		visibility: visible;
	}
}
.el-col {
	border-radius: 4px;
	margin-bottom: 10px;
}

:deep(.is-horizontal) {
	display: none !important;
}
</style>
