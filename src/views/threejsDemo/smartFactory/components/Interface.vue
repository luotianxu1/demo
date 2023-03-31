<template>
	<div class="interface">
		<div class="btn">
			<el-button type="primary" @click="showWall">厂房外形展示</el-button>
			<el-button type="primary" @click="showAll">厂房分层展开</el-button>
			<el-button type="primary" @click="showFloor1">展示第一层楼房</el-button>
			<el-button type="primary" @click="showFloor2">展示第二层楼房</el-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
import eventHub from "@utils/eventHub"

const showWall = () => {
	eventHub.emit("showWall")
}

const showFloor1 = () => {
	eventHub.emit("showFloor1")
}

const showFloor2 = () => {
	eventHub.emit("showFloor2")
}

let open = false
const showAll = () => {
	if (open) {
		eventHub.emit("hideAll")
		open = false
	} else {
		eventHub.emit("showAll")
		open = true
	}
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
