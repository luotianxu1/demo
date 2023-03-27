import * as THREE from "three"
import startPointFragment from "./shader/startPoint/fragment.glsl?raw"
import startPointVertex from "./shader/startPoint/vertex.glsl?raw"
import fireworkFragment from "./shader/fireworks/fragment.glsl?raw"
import fireworkVertex from "./shader/fireworks/vertex.glsl?raw"

export default class Fireworks {
	startGeometry: THREE.BufferGeometry
	startMaterial: THREE.ShaderMaterial
	startPoint: THREE.Points
	scene: THREE.Scene | undefined
	clock: THREE.Clock
	fireworkGeometry
	FireworkCount
	fireworkMaterial
	fireworks
	color
	listener
	sound
	listener2
	sendSound
	play: boolean = false
	sendSoundplay: boolean = false

	constructor(color: THREE.ColorRepresentation, to: { x: number; z: number; y: number }, from = { x: 0, y: 0, z: 10 }) {
		this.color = new THREE.Color(color)
		// 创建烟花发射的球
		this.startGeometry = new THREE.BufferGeometry()
		const startPositionArray = new Float32Array(3)
		startPositionArray[0] = from.x
		startPositionArray[1] = from.y
		startPositionArray[2] = from.z
		this.startGeometry.setAttribute("position", new THREE.BufferAttribute(startPositionArray, 3))

		const astepArray = new Float32Array(3)
		astepArray[0] = to.x - from.x
		astepArray[1] = to.y - from.y
		astepArray[2] = to.z - from.z
		this.startGeometry.setAttribute("aStep", new THREE.BufferAttribute(astepArray, 3))

		// 设置着色器材质
		this.startMaterial = new THREE.ShaderMaterial({
			vertexShader: startPointVertex,
			fragmentShader: startPointFragment,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			uniforms: {
				uTime: {
					value: 0
				},
				uSize: {
					value: 20
				},
				uColor: {
					value: this.color
				}
			}
		})

		// 创建烟花点
		this.startPoint = new THREE.Points(this.startGeometry, this.startMaterial)

		this.clock = new THREE.Clock()

		// 创建爆炸点
		this.fireworkGeometry = new THREE.BufferGeometry()
		this.FireworkCount = 180 + Math.floor(Math.random() * 180)
		const positionFireworksArray = new Float32Array(this.FireworkCount * 3)
		const scaleFireworksArray = new Float32Array(this.FireworkCount)
		const directionArray = new Float32Array(this.FireworkCount * 3)
		for (let i = 0; i < this.FireworkCount; i++) {
			// 一开始烟花的位置
			positionFireworksArray[i * 3 + 0] = to.x
			positionFireworksArray[i * 3 + 1] = to.y
			positionFireworksArray[i * 3 + 2] = to.z
			// 设置烟花所有例子初始化大小
			scaleFireworksArray[i] = Math.random()
			// 设置四周发射的角度
			const theta = Math.random() * 2 * Math.PI
			const beta = Math.random() * 2 * Math.PI
			const r = Math.random()
			directionArray[i * 3 + 0] = r * Math.sin(theta) + r * Math.sin(beta)
			directionArray[i * 3 + 1] = r * Math.cos(theta) + r * Math.cos(beta)
			directionArray[i * 3 + 2] = r * Math.sin(theta) + r * Math.cos(beta)
		}
		this.fireworkGeometry.setAttribute("position", new THREE.BufferAttribute(positionFireworksArray, 3))
		this.fireworkGeometry.setAttribute("aScale", new THREE.BufferAttribute(scaleFireworksArray, 1))
		this.fireworkGeometry.setAttribute("aRandom", new THREE.BufferAttribute(directionArray, 3))
		this.fireworkMaterial = new THREE.ShaderMaterial({
			uniforms: {
				uTime: {
					value: 0
				},
				uSize: {
					value: 0
				},
				uColor: {
					value: this.color
				}
			},
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			vertexShader: fireworkVertex,
			fragmentShader: fireworkFragment
		})
		this.fireworks = new THREE.Points(this.fireworkGeometry, this.fireworkMaterial)

		// 创建音频
		this.listener = new THREE.AudioListener()
		this.sound = new THREE.Audio(this.listener)
		// 创建音频加载器
		const audioLoader = new THREE.AudioLoader()
		audioLoader.load(`./audio/firework/pow${Math.floor(Math.random() * 4) + 1}.ogg`, buffer => {
			this.sound.setBuffer(buffer)
			this.sound.setLoop(false)
			this.sound.setVolume(1)
		})

		this.listener2 = new THREE.AudioListener()
		this.sendSound = new THREE.Audio(this.listener2)
		audioLoader.load(`./audio/firework/send.mp3`, buffer => {
			this.sendSound.setBuffer(buffer)
			this.sendSound.setLoop(false)
			this.sendSound.setVolume(0.1)
		})
	}
	addScene(scene: THREE.Scene) {
		scene.add(this.startPoint)
		scene.add(this.fireworks)
		this.scene = scene
	}
	update() {
		const elapsedTime = this.clock.getElapsedTime()
		if (elapsedTime > 0.1 && elapsedTime < 1) {
			if (!this.sendSound.isPlaying && !this.sendSoundplay) {
				this.sendSound.play()
				this.sendSoundplay = true
			}
			this.startMaterial.uniforms.uTime.value = elapsedTime
			this.startMaterial.uniforms.uSize.value = 20
		} else if (elapsedTime > 0.2) {
			const time = elapsedTime - 1
			this.startMaterial.uniforms.uSize.value = 0
			this.startPoint.clear()
			this.startGeometry.dispose()
			this.startMaterial.dispose()

			if (!this.sound.isPlaying && !this.play) {
				this.sound.play()
				this.play = true
			}

			// 设置烟花显示
			this.fireworkMaterial.uniforms.uSize.value = 20
			this.fireworkMaterial.uniforms.uTime.value = time
			if (time > 5) {
				this.fireworkMaterial.uniforms.uSize.value = 0
				this.fireworks.clear()
				this.fireworkMaterial.dispose()
				this.fireworkGeometry.dispose()
				this.scene?.remove(this.fireworks)
				this.scene?.remove(this.startPoint)
				return "remove"
			}
		}
	}
}
