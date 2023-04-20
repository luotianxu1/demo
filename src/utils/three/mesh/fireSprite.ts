import * as THREE from "three"
import fragmentShader from "@/utils/three/shader/fireSprite/fragmentShader.glsl?raw"
import vertexShader from "@/utils/three/shader/fireSprite/vertexShader.glsl?raw"

export default class FireSprite {
	sprite
	spriteMaterial
	mesh

	constructor(position = new THREE.Vector3(-4.9, 1.8, 25.1), scale = 1) {
		// 着色器创建精灵材质
		this.spriteMaterial = new THREE.ShaderMaterial({
			uniforms: {
				rotation: {
					value: 0
				},
				center: {
					value: new THREE.Vector2(0.5, 0.5)
				},
				iTime: {
					value: 0
				},
				iResolution: {
					value: new THREE.Vector2(1000, 1000)
				},
				iMouse: {
					value: new THREE.Vector2(0, 0)
				},
				uFrequency: {
					value: 0
				}
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			// depthTest: false,
			side: THREE.DoubleSide
		})
		this.sprite = new THREE.Sprite(this.spriteMaterial as any)
		this.sprite.scale.set(scale, scale, scale)
		this.sprite.renderOrder = 1
		this.sprite.position.copy(position)
		this.mesh = this.sprite
	}

	update(delta: any) {
		this.spriteMaterial.uniforms.iTime.value += delta
	}
}
