import type { App } from "vue"
import lazy from "./modules/lazy"

const directivesList: any = {
	lazy
}

const directives = {
	install: function (app: App<Element>) {
		Object.keys(directivesList).forEach(key => {
			// 注册自定义指令
			app.directive(key, directivesList[key])
		})
	}
}

export default directives
