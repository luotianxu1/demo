<template>
	<el-card :body-style="{ padding: '0px' }" shadow="hover">
		<el-popover width="900" trigger="click">
			<template #reference>
				<img :src="getAssetsFile(props.card.img)" class="image" />
			</template>
			<template #default>
				<div class="content">
					<img :src="getAssetsFile(props.card.img)" />
				</div>
			</template>
		</el-popover>

		<div class="card-bottom">
			<span>{{ props.card.title }}</span>
			<el-button :icon="ArrowRight" circle @click="changeToPage(props.card)" />
		</div>
	</el-card>
</template>

<script lang="ts" setup>
import { ArrowRight } from "@element-plus/icons-vue"
import type { IFormItem } from "../data"
import { getAssetsFile } from "@utils/tools"

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

const router = useRouter()
const changeToPage = (item: IFormItem) => {
	router.push(item.url)
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

.content {
	width: 100%;

	img {
		width: 100%;
	}
}
</style>
