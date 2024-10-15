<template>
	<div
		class="grid-item"
		:class="{ opened: isOpen }"
		@click="onClick"
		@contextmenu.prevent="onRightClick"
		@dblclick.prevent="onDoubleClick"
	>
		<template v-if="isFlag">🚩</template>
		<template v-else-if="isOpen">
			<template v-if="isBomb">💥</template>
			<template v-else>{{ count ? count : "" }}</template>
		</template>
	</div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["open", "openAll"])
const props = defineProps({
	count: {
		type: Number,
		default: 0
	},
	isBomb: {
		type: Boolean,
		default: false
	}
})
const { count, isBomb } = toRefs(props)
const isOpen = ref(false)
const isFlag = ref(false)

const onClick = () => {
	open()
}

const onRightClick = () => {
	if (isOpen.value) {
		return
	}
	isFlag.value = !isFlag.value
}

const onDoubleClick = () => {
	if (!isOpen.value) {
		return
	}
	emit("openAll")
}

const open = () => {
	if (isOpen.value || isFlag.value) {
		return
	}
	isOpen.value = true
	emit("open")
}

const reset = () => {
	isOpen.value = false
	isFlag.value = false
}

defineExpose({
	reset,
	open,
	isFlag
})
</script>

<style scoped lang="scss">
.grid-item {
	display: flex;
	width: 100%;
	height: 100%;
	cursor: pointer;
	background-color: #ddd;
	border: solid 1px #eee;
	border-top-color: #eee;
	border-right-color: #ccc;
	border-bottom-color: #ccc;
	border-left-color: #eee;
	justify-content: center;
	align-items: center;
}

.opened {
	background-color: #fff !important;
}
</style>
