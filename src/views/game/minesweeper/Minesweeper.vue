<template>
	<div class="page">
		<header style="margin-bottom: 0.2rem">
			<template v-if="isSuccess">😀</template>
			<template v-else-if="isFail">
				😭
				<button type="button" @click="doStartGame">🎮</button>
			</template>
			<template v-else>
				<button type="button" @click="doStartGame">🎮</button>
			</template>
			<div class="flex" @change="onLevelChange">
				<label v-for="(config, key) in Levels" :key="key">
					<input v-model="level" :value="key" type="radio" name="level" />
					{{ key }}
				</label>
			</div>
		</header>
		<div id="game-grid" :class="{ 'game-over': isGameOver }" :style="gridStyle">
			<GridItem
				v-for="(item, index) in grid"
				:key="index"
				ref="gridItems"
				class="grid-item"
				:is-bomb="item.isBomb"
				:count="item.count"
				@open="onItemOpen(item, index)"
				@open-all="onItemOpenAll(item, index)"
			></GridItem>
		</div>
	</div>
</template>

<script lang="ts" setup>
import GridItem from "./GridItem.vue"
const Levels = {
	Easy: {
		row: 10,
		column: 10,
		bomb: 10
	},
	Medium: {
		row: 16,
		column: 12,
		bomb: 30
	},
	Hard: {
		row: 25,
		column: 12,
		bomb: 99
	}
}
const level = ref("Easy")
const row = ref(10)
const column = ref(10)
const bombNumber = ref(10)
const isGameOver = ref(false)
const grid = ref()
const gridItems = ref()
const opened = ref(0)
const isSuccess = ref(false)
const isFail = ref(false)

const total = computed(() => {
	return row.value * column.value
})

const gridStyle = computed(() => {
	return `--row:${row.value};--column:${column.value}`
})

const doStartGame = (event?) => {
	const arr: Array<number> = []
	opened.value = 0
	isSuccess.value = isFail.value = false

	for (let i = 0; i < total.value; i++) {
		arr.push(0)
	}

	let bomb = bombNumber.value
	console.log(bomb)

	while (bomb) {
		const index = (Math.random() * total.value) >> 0
		if (arr[index]) {
			continue
		}
		arr[index] = 1
		bomb--
	}
	console.log(arr)

	grid.value = arr.map((item, index) => {
		const x = index % column.value
		const y = (index / column.value) >> 0
		let count = 0
		for (let i = Math.max(0, y - 1); i < Math.min(y + 2, row.value); i++) {
			for (let j = Math.max(0, x - 1); j < Math.min(x + 2, column.value); j++) {
				if (arr[i * column.value + j] && !(i === y && j === x)) {
					count++
				}
			}
		}
		return {
			isBomb: Boolean(item),
			count
		}
	})
	if (event && gridItems.value) {
		gridItems.value.forEach(item => {
			item.reset()
		})
	}
	isGameOver.value = false
}

const stopGame = (isWin = false) => {
	isGameOver.value = true
	if (isWin) {
		isSuccess.value = isWin
	} else {
		isFail.value = true
	}
}

const onItemOpen = (item, index) => {
	if (grid.value[index].isBomb) {
		return stopGame()
	}
	opened.value += 1
	openGridItem(item, index)
	if (opened.value >= total.value - bombNumber.value) {
		stopGame(true)
	}
}

const onItemOpenAll = (item, index) => {
	if (item.count === 0) {
		return
	}
	const x = index % column.value
	const y = (index / column.value) >> 0
	const itemsToOpen: any = []
	let num = 0
	for (let i = Math.max(0, y - 1); i < Math.min(y + 2, row.value); i++) {
		for (let j = Math.max(0, x - 1); j < Math.min(x + 2, column.value); j++) {
			if (i === y && j === x) {
				continue
			}
			const gridItem = gridItems.value[i * column.value + j]
			if (gridItem.isFlag) {
				num++
			} else {
				itemsToOpen.push(gridItem)
			}
		}
	}
	if (num === item.count) {
		for (const itemTopOpen of itemsToOpen) {
			itemTopOpen.open()
		}
	}
}

const openGridItem = (item, index) => {
	if (item.count) {
		return
	}
	const x = index % column.value
	const y = (index / column.value) >> 0
	for (let i = Math.max(0, y - 1); i < Math.min(y + 2, row.value); i++) {
		for (let j = Math.max(0, x - 1); j < Math.min(x + 2, column.value); j++) {
			if (i === y && j === x) {
				continue
			}
			const gridItem = gridItems.value[i * column.value + j]
			gridItem.open()
		}
	}
}

const onLevelChange = () => {
	const item = Levels[level.value]
	console.log(item)

	row.value = item.row
	column.value = item.column
	bombNumber.value = item.bomb
	doStartGame(true)
}

doStartGame()
</script>

<style scoped lang="scss">
:root {
	--row: 10;
	--column: 10;
}

.page {
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

#game-grid {
	display: grid;
	grid-template-rows: repeat(var(--row), 30px);
	grid-template-columns: repeat(var(--column), 30px);
}

.game-over {
	pointer-events: none;
}

header {
	display: flex;
}
</style>
