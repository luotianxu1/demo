<template>
	<transition name="jspp-message-fade">
		<div :class="styleClass" v-show="visible" :style="{ top: top + 'px' }">
			{{ message }}
		</div>
	</transition>
</template>
<script setup lang="ts">
import types from "./types"

let t = null

const state = reactive({
	visible: false,
	top: 0
})

const props = defineProps({
	type: {
		type: String,
		default: types.MESSAGE,
		validor(value) {
			return Object.values(types).includes(value)
		}
	},
	message: {
		type: String,
		default: types.MESSAGE
	},
	duration: {
		type: Number,
		default: 3000
	}
})

const setVisible = isVisible => {
	return new Promise(resolve => {
		state.visible = isVisible
		t = setTimeout(() => {
			clearTimeout(t)
			t = null
			resolve("")
		}, 300)
	})
}

const setTop = top => {
	state.top = top
}

const styleClass = computed(() => ["jspp-message", props.type])
const { visible, top } = toRefs(state)

defineExpose({
	setVisible,
	setTop,
	height: 40,
	margin: 20
})
</script>
<style lang="scss" scoped>
.jspp-message {
	position: fixed;
	left: 50%;
	z-index: 9999;
	width: 380px;
	height: 40px;
	margin-left: -190px;
	font-size: 14px;
	line-height: 40px;
	text-align: center;
	border-radius: 5px;
	transition: top 0.3s ease-out;

	&.success {
		color: #529b2e;
		background-color: #f0f9eb;
	}

	&.warning {
		color: #b88230;
		background-color: #fdf6ec;
	}

	&.message {
		color: #73767a;
		background-color: #f4f4f5;
	}

	&.error {
		color: #ce5656;
		background-color: #fef0f0;
	}
}

.jspp-message-fade-enter-active {
	transition: all 0.3s ease-in;
}

.jspp-message-fade-leave-active {
	transition: all 0.3s ease-out;
}

.jspp-message-fade-enter-from,
.jspp-message-fade-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}
</style>
