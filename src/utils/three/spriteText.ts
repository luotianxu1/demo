import * as THREE from "three"

/**
 * 创建文字
 * @param x
 * @param y
 * @param z
 * @param text 文字
 * @param options
 * @returns THREE.Sprite
 */
export default function spriteText(
	x: number,
	y: number,
	z: number,
	text: string,
	options?: { fontSize?: number; backgroundColor?: string; color?: string }
) {
	if (!options) options = {}
	options.fontSize = options.fontSize || 12
	const average = 100
	const canvas = document.createElement("canvas")
	canvas.width = text.length * options.fontSize * average
	canvas.height = options.fontSize * average
	const ctx = canvas.getContext("2d")
	ctx.fillStyle = options.backgroundColor || "transparent"
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.font = canvas.height + "px '微软雅黑'"
	ctx.textAlign = "center"
	ctx.textBaseline = "middle"
	ctx.fillStyle = options.color || "#666"
	ctx.fillText(text, canvas.width / 2, (canvas.height / 2) * 1.15)
	const texture = new THREE.Texture(canvas)
	texture.needsUpdate = true
	const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }))
	sprite.scale.set((options.fontSize / average) * text.length, options.fontSize / average, 1)
	sprite.userData.domWidth = canvas.width
	sprite.userData.domHeight = canvas.height
	sprite.position.set(x, y, z)
	return sprite
}
