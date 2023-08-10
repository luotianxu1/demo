<template>
	<div>
		<el-button @click="Message.success({ type: types.MESSAGE, message: 'This is a SUCCESS test' })">SHOW SUCCESS</el-button>
		<el-button @click="Message.warning({ type: types.MESSAGE, message: 'This is a WARNING test' })">SHOW WARNING</el-button>
		<el-button @click="Message.message({ type: types.ERROR, message: 'This is a MESSAGE test' })">SHOW MESSAGE</el-button>
		<el-button @click="Message.error({ type: types.ERROR, message: 'This is a ERROR test' })">SHOW ERROR</el-button>
	</div>
</template>
<script setup lang="ts">
import Message from "../components/Message"
import { types } from "../components/Message"
</script>
<style lang="scss" scoped></style>
