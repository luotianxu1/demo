<template>
	<div class="interface">
		<div class="btn">
			<el-button type="primary" @click="toggleAction(0)">设置热气球以横穿园区的动画显示</el-button>
			<el-button type="primary" @click="toggleAction(1)">设置热气球以环绕园区的动画显示</el-button>
			<el-button type="primary" @click="toggleCamera('carcamera_Orientation')">设置相机追随汽车</el-button>
			<el-button type="primary" @click="toggleCamera('rightcamera_Orientation')">司机视角</el-button>
			<el-button type="primary" @click="toggleCamera('1')">默认视角</el-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import eventHub from "@utils/eventHub"
const toggleAction = (i: unknown) => {
	eventHub.emit("actionClick", i)
}

const toggleCamera = (camera: string) => {
	eventHub.emit("toggleCamera", camera)
}
</script>

<style lang="scss" scoped>
.interface {
	width: 100vw;
	height: 100vh;
	position: fixed;
	z-index: 100;
	left: 0;
	top: 0;
	pointer-events: none;
	display: flex;
	flex-direction: column;
}

.btn {
	pointer-events: auto;
}
</style>
