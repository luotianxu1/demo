/**
 * v-lazy
 * 图片懒加载
 */

import type { Directive } from "vue"

const copy: Directive = {
	mounted(el: HTMLImageElement) {
		const imgSrc = el.src
		el.src = ""
		const observer = new IntersectionObserver(([{ isIntersecting }]) => {
			// 元素出现在可视区域和离开可视区域触发
			if (isIntersecting) {
				// 加载图片
				el.src = imgSrc
				// 停止观察
				observer.unobserve(el)
			}
		})
		observer.observe(el)
	}
}

export default copy
