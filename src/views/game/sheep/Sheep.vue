<template>
	<div v-if="step === 0" class="intro">
		<div>
			横向卡片最大平铺排数
			<input v-model="option.x" min="2" max="10" type="range" />
			{{ option.x }}
		</div>
		<div>
			纵向卡片最大平铺排数
			<input v-model="option.y" min="2" max="10" type="range" />
			{{ option.y }}
		</div>
		<div>
			卡片最大堆叠层数
			<input v-model="option.z" min="2" max="10" type="range" />
			{{ option.z }}
		</div>
		<div>
			卡片密度
			<input v-model="option.cardRandom" min="0" max="1" step="0.1" type="range" />
			{{ option.cardRandom }}
		</div>
		<div>
			最大卡片种类
			<input v-model="option.maxCardType" min="3" max="10" step="1" type="range" />
			{{ option.maxCardType }}
		</div>
		<br />
		<el-button type="primary" @click="startGame">开始游戏</el-button>
	</div>
	<div v-else-if="step === 2" class="intro">
		<h1>{{ result ? "You Win!🎉" : "You Lose!😢" }}</h1>
		<el-button type="primary" @click="rePlay">再来一轮</el-button>
		<el-button type="primary" @click="setGame">难度调节</el-button>
	</div>
	<div v-else class="box">
		<div class="card-wrap" :style="cardWrapStyle">
			<!-- 所有卡片 -->
			<div
				v-for="item in cardItemList"
				:key="item.key"
				:class="{ 'item-cover': item.cover }"
				class="card-item"
				:style="item.style"
				@click="clickCard(item)"
			>
				{{ item.content }}
			</div>
			<!-- 已经选中的卡片 -->
			<div v-for="item in penddingList" :key="item.key" class="card-item" :style="item.style">
				{{ item.content }}
			</div>
			<!-- 已经清除的卡片 -->
			<div v-for="item in clearList" :key="item.key" class="card-item clear-item" :style="item.style">
				{{ item.content }}
			</div>
			<p class="card-tips">
				剩余空位:{{ 7 - penddingList.length }}/7;已消除:{{ clearList.length }}/{{
					cardItemList.length + penddingList.length + clearList.length
				}}
			</p>
		</div>
		<div class="tools">
			道具：
			<el-button type="primary" @click="rePlay">再来一轮</el-button>
		</div>
	</div>
</template>

<script lang="ts" setup>
class CardItem {
	x = 20
	y = 21
	z = 0
	key = 0
	val = 0
	style: {}
	content
	static width = 20
	static height = 21
	static colorType = {
		1: { background: "#FFB7DD" },
		2: { background: "#FFCCCC" },
		3: { background: "#FFC8B4" },
		4: { background: "#FFDDAA" },
		5: { background: "#FFEE99" },
		6: { background: "#FFFFBB" },
		7: { background: "#EEFFBB" },
		8: { background: "#CCFF99" },
		9: { background: "#99FF99" },
		10: { background: "#BBFFEE" },
		11: { background: "#AAFFEE" },
		12: { background: "#99FFFF" },
		13: { background: "#CCDDFF" }
	}

	static contentType = {
		1: "🥕",
		2: "✂️",
		3: "🥦",
		4: "🥛",
		5: "🌊",
		6: "🧤",
		7: "🧵",
		8: "🌱",
		9: "🔨",
		10: "🌽",
		11: "🌾",
		12: "🐑",
		13: "🔥"
	}

	constructor({ x, y, z, key }) {
		this.x = x
		this.y = y
		this.z = z
		this.key = key
		const offset = 0
		this.val = key
		this.style = {
			top: y * CardItem.height + offset + "px",
			left: x * CardItem.width + offset + "px",
			width: CardItem.width * 2 - 2 + "px",
			height: CardItem.height * 2 - 8 + "px"
		}
	}

	setValue(val) {
		this.val = val
		this.content = CardItem.contentType[val]
		Object.assign(this.style, CardItem.colorType[val])
	}
}

const step = ref(0)
const option = reactive({
	x: 7,
	y: 4,
	z: 8,
	cardRandom: 0.2,
	maxCardType: 10
})
// 点击开始游戏
const startGame = () => {
	initGame()
}
// 重新开始
const rePlay = () => {
	initGame()
}
// 设置
const setGame = () => {
	step.value = 0
}

// 判断游戏结果
const result = ref<boolean>(false)
// 所有卡片
const cardItemList = ref<Array<any>>([])
// 已经清除的卡片
const clearList = ref<Array<any>>([])
// 已经选中的卡片
const penddingList = ref<Array<any>>([])
const initGame = () => {
	step.value = 1
	getMap()
	penddingList.value = []
	clearList.value = []
	setCardValue()
	calcCover()
}

let maxWidth = 0
let maxHeight = 0
const getMap = () => {
	maxWidth = (option.x - 1) * 2
	maxHeight = (option.y - 1) * 2
	const cardMap = new Array(option.z)
	const itemList: Array<any> = []
	let key = 0
	for (let k = 0; k < option.z; k++) {
		cardMap[k] = new Array(maxHeight)
		for (let i = 0; i < maxHeight; i++) {
			cardMap[k][i] = new Array(maxWidth).fill(0)
		}
	}
	for (let k = 0; k < option.z; k++) {
		const shrink = Math.floor((option.z - k) / 3)
		for (let i = shrink; i < maxHeight - shrink; i++) {
			// 列，对称设置
			const mid = Math.ceil((maxWidth - shrink) / 2)
			for (let j = shrink; j <= mid; j++) {
				let canSetCard = true
				if (j > 0 && cardMap[k][i][j - 1]) {
					// 左边不能有牌
					canSetCard = false
				} else if (i > 0 && cardMap[k][i - 1][j]) {
					// 上边不能有牌
					canSetCard = false
				} else if (i > 0 && j > 0 && cardMap[k][i - 1][j - 1]) {
					// 左上不能有牌
					canSetCard = false
				} else if (i > 0 && cardMap[k][i - 1][j + 1]) {
					// 右上不能有牌
					canSetCard = false
				} else if (k > 0 && cardMap[k - 1][i][j]) {
					// 正底不能有牌
					canSetCard = false
				} else if (Math.random() >= option.cardRandom) {
					canSetCard = false
				}
				if (canSetCard) {
					let cardItem
					key++
					cardItem = new CardItem({
						x: j,
						y: i,
						z: k,
						key
					})
					cardMap[k][i][j] = cardItem
					itemList.push(cardItem)
					// 对称放置
					if (j < mid) {
						key++
						cardItem = new CardItem({
							x: maxWidth - j,
							y: i,
							z: k,
							key
						})
						cardMap[k][i][j] = cardItem
						itemList.push(cardItem)
					}
				}
			}
		}
	}
	itemList.reverse()
	for (let i = 1; i <= key % 3; i++) {
		const clearItem = itemList.pop()
		cardMap[clearItem.z][clearItem.y][clearItem.x] = 0
	}
	itemList.reverse()
	cardItemList.value = itemList
}

// 设置卡片种类
let calcValueList: any = []
const setCardValue = () => {
	const valStack = new Array(option.maxCardType)
	calcValueList = new Array(option.maxCardType + 1).fill(0)
	// 给卡片设置值
	cardItemList.value.forEach(item => {
		const value = Math.ceil(Math.random() * option.maxCardType)
		if (valStack[value]) {
			valStack[value].push(item)
			if (valStack[value].length === 3) {
				valStack[value].forEach(a => {
					a.setValue(value)
				})
				valStack[value] = null
			}
		} else {
			valStack[value] = [item]
		}
	})

	let count = 2
	valStack.forEach(list => {
		list &&
			list.forEach(item => {
				count++
				item.setValue(Math.floor(count / 3))
			})
	})
}

const calcCover = () => {
	// 构建一个遮挡 map
	const coverMap = new Array(maxHeight)
	for (let i = 0; i <= maxHeight; i++) {
		coverMap[i] = new Array(maxWidth).fill(false)
	}

	// 从后往前，后面的层数高
	for (let i = cardItemList.value.length - 1; i >= 0; i--) {
		const item = cardItemList.value[i]
		const { x, y } = item
		if (coverMap[y][x]) {
			item.cover = true
		} else if (coverMap[y][x + 1]) {
			item.cover = true
		} else if (coverMap[y + 1][x]) {
			item.cover = true
		} else if (coverMap[y + 1][x + 1]) {
			item.cover = true
		} else {
			item.cover = false
		}
		coverMap[y][x] = true
		coverMap[y + 1][x] = true
		coverMap[y][x + 1] = true
		coverMap[y + 1][x + 1] = true
	}
}

const leftOffset = computed(() => {
	const wrapWidth = (maxWidth + 2) * CardItem.width
	return (wrapWidth - 7 * CardItem.width * 2) / 2
})

const cardWrapStyle = computed(() => {
	return {
		width: (maxWidth + 2) * CardItem.width + "px",
		height: (maxHeight + 1) * CardItem.height + "px"
	}
})

// 点击卡片
let timer
const clickCard = item => {
	clearTimeout(timer)
	removeThree()
	penddingList.value.push(item)
	const index = cardItemList.value.indexOf(item)
	cardItemList.value = cardItemList.value.slice(0, index).concat(cardItemList.value.slice(index + 1))
	calcCover()
	calcValueList[item.val]++
	setTimeout(() => {
		item.style.top = "160%"
		item.style.left = leftOffset.value + (penddingList.value.length - 1) * CardItem.width * 2 + "px"
	}, 0)
	timer = setTimeout(() => {
		removeThree()
	}, 100)
}

const removeThree = () => {
	penddingList.value.some(item => {
		if (calcValueList[item.val] === 3) {
			penddingList.value.forEach(newItem => {
				if (newItem.val === item.val) {
					clearList.value.push(newItem)
				}
			})
			setTimeout(() => {
				clearList.value.forEach(a => {
					a.style.left = leftOffset.value - 60 + "px"
				})
			}, 300)

			penddingList.value = penddingList.value.filter(newItem => {
				return newItem.val !== item.val
			})
			penddingList.value.forEach((b, index) => {
				b.style.top = "160%"
				b.style.left = leftOffset.value + index * CardItem.width * 2 + "px"
			})
			calcValueList[item.val] = 0
			if (cardItemList.value.length === 0) {
				step.value = 2
				result.value = true
			}
		}
	})

	if (penddingList.value.length >= 7) {
		step.value = 2
		result.value = false
	}
}
</script>

<style scoped lang="scss">
.box {
	position: relative;
}

.intro {
	margin: 10% auto 0 auto;
	text-align: center;
}

.card-wrap {
	position: relative;
	margin: 10% auto 0 auto;
}

.card-item {
	position: absolute;
	font-size: 28px;
	text-align: center;
	cursor: pointer;
	background: #ddd;
	border-radius: 2px;
	opacity: 1;
	box-shadow: 0 3px 0 0 #fff, 0 8px 0 0 #ddd, 0 8px 0 2px #333, 0 0 0 2px #333;
	box-sizing: border-box;
	transition: all 0.3s;
}

.card-item:hover {
	z-index: 1;
	transform: scale3d(1.1, 1.1, 1.1);
}

.item-cover {
	pointer-events: none;
	box-shadow: 0 3px 0 0 #999, 0 8px 0 0 #666, 0 8px 0 2px #000, 0 0 0 2px #000;
}

.item-cover::after {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #000;
	border-radius: 2px;
	content: "";
	opacity: 0.55;
}

.card-tips {
	position: absolute;
	top: 130%;
	left: 50%;
	white-space: nowrap;
	pointer-events: none;
	transform: translate(-50%, 0);
}

.tools {
	position: absolute;
	top: 200%;
	left: 0;
	width: 100%;
	text-align: center;
}

.clear-item {
	pointer-events: none;
}
</style>
