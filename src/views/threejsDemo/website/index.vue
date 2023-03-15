<template>
	<div class="main">
		<div class="page page1">
			<h1>111111</h1>
			<h3>11111111111</h3>
		</div>
		<div class="page page2">
			<h1>222222</h1>
			<h3>222222222222</h3>
		</div>
		<div class="page page3">
			<h1>333333</h1>
			<h3>333333333333</h3>
		</div>
	</div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.main {
	width: 100vw;
	height: 100vh;
	background-color: rgb(36, 58, 66);
	overflow: auto;
}

canvas {
	position: fixed;
	top: 0;
	left: 0;
}

.page {
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #fff;
}

h1 {
	margin-top: 60px;
	font-size: 40px;
}

h3 {
	font-size: 30px;
}
</style>
