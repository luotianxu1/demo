import * as THREE from "three"

/**
 * 创建一个WebGlRenderer
 * @param domElement DOMElement
 * @param antialias 是否执行抗锯齿
 * @returns WebGlRenderer
 */
export default function WebGlRenderer(
	domElement: HTMLDivElement,
	config: THREE.WebGLRendererParameters | undefined
): THREE.WebGLRenderer {
	const configParam = Object.assign(
		{
			antialias: true,
			logarithmicDepthBuffer: false
		},
		{ ...config }
	)
	const renderer = new THREE.WebGLRenderer(configParam)
	renderer.setPixelRatio(window.devicePixelRatio)
	renderer.setSize(domElement.offsetWidth, domElement.offsetHeight)
	renderer.shadowMap.enabled = true
	domElement.appendChild(renderer.domElement)
	return renderer
}
