<template>
	<el-card :body-style="{ padding: '0px' }" shadow="hover">
		<img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image" />
		<div class="card-bottom">
			<span>{{ props.card.title }}</span>
			<el-button :icon="ArrowRight" circle @click="changeToPage(props.card)" />
		</div>
	</el-card>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue"
import type { IFormItem } from "../data"

const props = defineProps({
	card: {
		required: false,
		type: Object as PropType<IFormItem>,
		default: () => {
			return [
				{
					title: "",
					url: ""
				}
			]
		}
	}
})

const changeToPage = (item: IFormItem) => {
	window.open(item.url as any)
}
</script>

<style lang="scss" scoped>
.box-card {
	padding: 0;
}

.card-bottom {
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 10px;
}

.image {
	width: 100%;
	height: 180px;
	object-fit: fill;
}
</style>
