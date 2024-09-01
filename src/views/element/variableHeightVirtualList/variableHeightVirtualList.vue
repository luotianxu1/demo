<template>
	<div class="fs-estimated-virtuallist-container" v-loading="props.loading">
		<div class="fs-estimated-virtuallist-content" ref="contentRef">
			<div class="fs-estimated-virtuallist-list" ref="listRef">
				<div clss="virtimated-virtuallist-list-item" v-for="i in rendenList" :key="i.id" :id="String(i.id)">
					<slot name="item" :item="i"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts" generic="T extends{id:number}">
import type { IEstimatedListProps, IPosInfo } from "./types"

const props = defineProps<IEstimatedListProps<T>>()
defineSlots<{
	item(props: { item: T }): any
}>()
const contentRef = ref<HTMLDivElement>()

const listRef = ref<HTMLDivElement>()
const positions = ref<IPosInfo[]>([])

const state = reactive({
	viewHeight: 0,
	listHeight: 0,
	stantIndex: 0,
	maxCount: 0,
	preLen: 0
})

const endIndex = computed(() => Math.min(props.dataSource.length, state.stantIndex + state.maxCount))

const rendenList = computed(() => props.dataSource.slice(state.stantIndex, endIndex.value))

// 拿到数据源，初始化数组
const initPosition = () => {
	const pos: IPosInfo[] = []
	for (let i = 0; i < props.dataSource.length; i++) {
		pos.push({
			index: i,
			height: props.estimatedHeight,
			top: i * props.estimatedHeight,
			bottom: (i + 1) * props.estimatedHeight,
			dHeight: 0
		})
	}
	positions.value = [...positions.value, ...pos]
}

// 数据item渲染完成后，更新数据item的真实高度
const setPosition = () => {
	const nodes = listRef.value?.children
	if (!nodes || !nodes.length) return
	;[...nodes].forEach(node => {
		const rect = node.getBoundingClientRect()
		const item = positions.value[+node.id]
		const dHeight = item.height - rect.height
		if (dHeight) {
			item.height = rect.height
			item.bottom = item.bottom - dHeight
			item.dHeight = dHeight
		}
	})

	const startId = +nodes[0].id
	const len = positions.value.length
	let startHeight = positions.value[startId].dHeight
	positions.value[startId].dHeight = 0
	for (let i = startId + 1; i < len; i++) {
		const item = positions.value[i]
		item.top = positions.value[i - 1].bottom
		item.bottom = item.bottom - startHeight
		if (item.dHeight !== 0) {
			startHeight += item.dHeight
			item.dHeight = 0
		}
	}
}
</script>

<style lang="scss" scoped>
.fs-estimated-virtuallist {
	&-container {
		width: 100%;
		height: 100%;
	}

	&-content {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	&-list-item {
		width: 100%;
		box-sizing: border-box;
	}
}
</style>
