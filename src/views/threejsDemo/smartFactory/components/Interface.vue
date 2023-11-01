<template>
	<div class="interface">
		<div class="btn">
			<el-button type="primary" @click="showWall">厂房外形展示</el-button>
			<el-button type="primary" @click="showAll">厂房分层展开</el-button>
			<el-button type="primary" @click="showFloor1">展示第一层楼房</el-button>
			<el-button type="primary" @click="showFloor2">展示第二层楼房</el-button>
			<el-button type="primary" @click="flat">展开飞机</el-button>
			<el-button type="primary" @click="recoverFlat">恢复飞机</el-button>
			<el-button type="primary" @click="pointFighter">粒子特效</el-button>
			<el-button type="primary" @click="pointBlast">粒子爆炸</el-button>
			<el-button type="primary" @click="pointBack">粒子复原</el-button>
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

const flat = () => {
	eventHub.emit("flat")
}

const recoverFlat = () => {
	eventHub.emit("recoverFlat")
}

const pointBlast = () => {
	eventHub.emit("pointBlast")
}

const pointBack = () => {
	eventHub.emit("pointBack")
}

const pointFighter = () => {
	eventHub.emit("pointFighter")
}
</script>

<style lang="scss" scoped>
.interface {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 100;
	display: flex;
	width: 100vw;
	height: 100vh;
	pointer-events: none;
	flex-direction: column;
}

.btn {
	pointer-events: auto;
}
</style>
