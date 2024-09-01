<template>
	<div class="virtualList">
		<!-- 用户视口：超出部分滚动 -->
		<div class="viewPort" ref="viewPortRef" :style="{ '--rowHeight': rowHeight + 'px' }" @scroll="onScroll">
			<!-- 子元素超出父元素 -->
			<div class="scrollbar" ref="scrollBarRef"></div>
			<!-- 数据列表  -->
			<div class="list" ref="listRef">
				<div class="row" v-for="(item, i) in showList" :key="i">{{ item.n }}</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const viewPortRef = ref<HTMLElement>()
const scrollBarRef = ref<HTMLElement>()
const listRef = ref<HTMLElement>()

const viewCount = 10 //显示多少数据
const rowHeight = 30 //每行高度
let start = ref(0) //开始索引
let end = ref(viewCount) //结束索引
const list = new Array(200000).fill(null).map((ele, i) => ({ n: i + 1 }))

const showList = computed(() => {
	return list.slice(start.value, end.value)
})

onMounted(() => {
	viewPortRef.value.style.height = rowHeight * viewCount + "px"
	scrollBarRef.value.style.height = rowHeight * list.length + "px"
})

const onScroll = () => {
	let offset = viewPortRef.value.scrollTop
	start.value = Math.round(offset / rowHeight)
	end.value = start.value + viewCount
	listRef.value.style.transform = `translateY(${offset}px)`
}
</script>

<style lang="scss" scoped>
.virtualList {
	.viewPort {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 300px;
		height: 400px;
		margin: auto;
		overflow-y: scroll;
		background-color: yellowgreen;

		.scrollbar {
			height: 3000px;
		}

		.list {
			position: absolute;
			top: 0;
			left: 0;

			.row {
				height: var(--rowHeight);
			}
		}
	}
}
</style>
