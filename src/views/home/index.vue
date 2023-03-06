<template>
	<el-container style="height: 100%">
		<el-header>
			<div class="nav" :class="a === 1 ? 'active' : ''" @click="a = 1">threejs</div>
			<div class="nav" :class="a === 2 ? 'active' : ''" @click="a = 2">leaflet</div>
		</el-header>
		<el-main>
			<el-scrollbar>
				<span>灯光</span>
				<el-divider></el-divider>
				<el-row :gutter="10">
					<el-col :span="4" v-for="(i, index) in 10" :key="index">
						<el-card class="box-card" shadow="hover">
							<template #header>
								<div class="card-header">
									<span>Card name</span>
									<el-button class="button" text>Operation button</el-button>
								</div>
							</template>
							<div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div>
						</el-card>
					</el-col>
				</el-row>
				<span>几何体</span>
				<el-divider />
				<el-row :gutter="10">
					<el-col :span="4" v-for="(i, index) in 10" :key="index">
						<el-card class="box-card" shadow="hover">
							<template #header>
								<div class="card-header">
									<span>Card name</span>
									<el-button class="button" text>Operation button</el-button>
								</div>
							</template>
							<div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div>
						</el-card>
					</el-col>
				</el-row>
				<el-divider />
				<el-row :gutter="10">
					<el-col :span="4" v-for="(i, index) in 10" :key="index">
						<el-card class="box-card" shadow="hover">
							<template #header>
								<div class="card-header">
									<span>Card name</span>
									<el-button class="button" text>Operation button</el-button>
								</div>
							</template>
							<div v-for="o in 4" :key="o" class="text item">{{ "List item " + o }}</div>
						</el-card>
					</el-col>
				</el-row>
			</el-scrollbar>
		</el-main>
	</el-container>
</template>

<script lang="ts" setup>
const a = ref(1)
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
