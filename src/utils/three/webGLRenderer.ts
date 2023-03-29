import * as THREE from "three"

/**
 * 创建一个WebGlRenderer
 * @param domElement DOMElement
 * @param antialias 是否执行抗锯齿
 * @returns WebGlRenderer
 */
export default function WebGlRenderer(domElement: HTMLDivElement, antialias?: true): THREE.WebGLRenderer {
	const renderer = new THREE.WebGLRenderer({
		// 抗锯齿
		antialias: antialias,
		// 深度 防止闪烁
		logarithmicDepthBuffer: true
	})
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(domElement.offsetWidth, domElement.offsetHeight)
	renderer.shadowMap.enabled = true
	domElement.appendChild(renderer.domElement)
	return renderer
}
