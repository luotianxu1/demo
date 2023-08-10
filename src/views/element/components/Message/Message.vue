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
	width: 380px;
	height: 40px;
	z-index: 9999;
	margin-left: -190px;
	text-align: center;
	line-height: 40px;
	font-size: 14px;
	border-radius: 5px;
	transition: top 0.3s ease-out;

	&.success {
		background-color: #f0f9eb;
		color: #529b2e;
	}
	&.warning {
		background-color: #fdf6ec;
		color: #b88230;
	}
	&.message {
		background-color: #f4f4f5;
		color: #73767a;
	}
	&.error {
		background-color: #fef0f0;
		color: #ce5656;
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
	transform: translateY(-20px);
	opacity: 0;
}
</style>
