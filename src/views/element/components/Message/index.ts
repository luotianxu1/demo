import types from "./types"
import MessageComponent from "./Message.vue"
import { findIndex } from "./utils"

const messageArr = ref([])

const Message: any = options => {
	const messageApp = createApp(MessageComponent, options)
	showMessage(messageApp, options.duration)
}

Object.values(types).forEach(type => {
	Message[type] = options => {
		options.type = type
		return Message(options)
	}
})

function showMessage(app, duration) {
	const oFrag = document.createDocumentFragment()
	const vm = app.mount(oFrag)
	messageArr.value.push(vm)
	document.body.appendChild(oFrag)
	setTop(vm)
	vm.setVisible(true)
	watch(messageArr, () => setTop(vm))

	hideMessage(app, vm, duration)
}

function hideMessage(app, vm, duration) {
	vm.timer = setTimeout(async () => {
		await vm.setVisible(false)
		app.unmount()
		messageArr.value = messageArr.value.filter(item => item !== vm)

		clearTimeout(vm.timer)
		vm.timer = null
	}, duration || 3000)
}

function setTop(vm) {
	const { setTop, height, margin } = vm
	const currentIndex = findIndex(messageArr.value, vm)
	setTop(margin * (currentIndex + 1) + height * currentIndex)
}

export { types }

export default Message
