import * as THREE from "three"
import WebGl, { type IConfig } from "@utils/three/webGl"
import * as TWEEN from "three/examples/jsm/libs/tween.module.js"

export default class Earth extends WebGl {
	objGroup: THREE.Group
	lonHelper
	latHelper
	positionHelper
	originHelper
	min
	max
	boxGeometry
	boxMaterial
	range
	mesh
	currentBarH = 0.01

	constructor(domElement: HTMLDivElement, config: IConfig = {}) {
		super(domElement, config)
		this.camera.position.set(0, 0, 10)
		this.camera.near = 0.01
		this.camera.updateProjectionMatrix()
		this.objGroup = new THREE.Group()
		this.scene.add(this.objGroup)

		this.createChart()
	}

	async createChart() {
		const canvas: any = await this.drawEarthTex()
		const map = new THREE.CanvasTexture(canvas)

		map.wrapS = THREE.RepeatWrapping
		map.wrapT = THREE.RepeatWrapping
		const geometry = new THREE.SphereGeometry(1, 32, 32)
		const material = new THREE.MeshBasicMaterial({
			map: map,
			transparent: true
		})
		const sphere = new THREE.Mesh(geometry, material)
		sphere.visible = false
		this.objGroup.add(sphere)

		this.lonHelper = new THREE.Object3D()
		this.scene.add(this.lonHelper)
		this.latHelper = new THREE.Object3D()
		this.lonHelper.add(this.latHelper)

		this.positionHelper = new THREE.Object3D()
		this.positionHelper.position.z = 1
		this.latHelper.add(this.positionHelper)

		this.originHelper = new THREE.Object3D()
		this.originHelper.position.z = 0.5
		this.positionHelper.add(this.originHelper)

		this.min = Number.MAX_SAFE_INTEGER
		this.max = Number.MIN_SAFE_INTEGER
		this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)

		this.boxMaterial = new THREE.MeshBasicMaterial({
			color: "#FFFFFF"
		})

		const quake: any = await this.queryEarthQuake()
		quake.forEach(a => {
			if (this.min > a.mag) {
				this.min = a.mag
			}
			if (this.max < a.mag) {
				this.max = a.mag
			}
		})
		this.range = this.max - this.min
		this.mesh = new THREE.InstancedMesh(this.boxGeometry, this.boxMaterial, quake.length)
		this.objGroup.add(this.mesh)

		this.addBars(quake)

		this.drawEarthTex().then(canvas => {
			fetch("./threejsDemo/earth/earthquake.json")
				.then(res => res.json())
				.then(res => {
					this.objGroup.scale.set(0.1, 0.1, 0.1)
					sphere.visible = true
					const orgCamera = this.camera.position
					const orgControl = this.orbitControls.target
					const tween = new TWEEN.Tween({
						scale: 0.1,
						rotate: 0,
						cameraX: orgCamera.x,
						cameraY: orgCamera.y,
						cameraZ: orgCamera.z,
						controlsX: orgControl.x,
						controlsY: orgControl.y,
						controlsZ: orgControl.z
					})
						.to(
							{
								scale: 1,
								rotate: Math.PI,
								cameraX: 0.27000767404584447,
								cameraY: 1.0782003329514755,
								cameraZ: 3.8134631736522793,
								controlsX: 0,
								controlsY: 0,
								controlsZ: 0
							},
							2000
						)
						.easing(TWEEN.Easing.Quadratic.Out)
						.onUpdate(obj => {
							this.objGroup.scale.set(obj.scale, obj.scale, obj.scale)
							this.objGroup.rotation.y = obj.rotate
							this.camera.position.set(obj.cameraX, obj.cameraY, obj.cameraZ)
							this.orbitControls.target.set(obj.controlsX, obj.controlsY, obj.controlsZ)
						})
						.chain(
							new TWEEN.Tween({ h: 0.01 })
								.to({ h: 0.5 }, 2000)
								.easing(TWEEN.Easing.Quadratic.Out)
								.onUpdate(obj => {
									this.currentBarH = obj.h
									this.addBars(res)
								})
						)
						.start()
					TWEEN.add(tween)
				})
		})
	}

	drawEarthTex() {
		return new Promise(resolve => {
			fetch("./threejsDemo/earth/world.zh.json")
				.then(res => res.json())
				.then(geojson => {
					const canvas = document.createElement("canvas")

					canvas.width = 3600
					canvas.height = 1800

					const ctx = canvas.getContext("2d")
					ctx.fillStyle = "rgb(10 ,20 ,28)"
					ctx.rect(0, 0, canvas.width, canvas.height)
					ctx.fill()
					//设置地图样式
					ctx.strokeStyle = "rgb(10 ,20 ,28)"
					ctx.lineWidth = 2
					ctx.fillStyle = "rgb(26, 35, 44)"

					geojson.features.forEach(a => {
						if (a.geometry.type === "MultiPolygon") {
							a.geometry.coordinates.forEach(b => {
								b.forEach(c => {
									this.drawRegion(ctx, c)
								})
							})
						} else {
							a.geometry.coordinates.forEach(c => {
								this.drawRegion(ctx, c)
							})
						}
					})
					resolve(canvas)
				})
		})
	}

	drawRegion(ctx, c, geoInfo?) {
		ctx.beginPath()
		c.forEach((item, i) => {
			const pos = [(item[0] + 180) * 10, (-item[1] + 90) * 10]
			if (i === 0) {
				ctx.moveTo(pos[0], pos[1])
			} else {
				ctx.lineTo(pos[0], pos[1])
			}
		})
		ctx.closePath()
		ctx.fill()
		ctx.stroke()
	}

	queryEarthQuake() {
		return new Promise(resolve => {
			fetch("./threejsDemo/earth/earthquake.json")
				.then(res => res.json())
				.then(res => {
					resolve(res)
				})
		})
	}

	addBars(res) {
		res.forEach((a, i) => {
			this.addBar(i, a.lon, a.lat, a.mag)
		})
		this.mesh.instanceColor.needsUpdate = true
		this.mesh.instanceMatrix.needsUpdate = true
	}

	addBar(i, lon, lat, value) {
		const { lonHelper, latHelper, positionHelper, originHelper } = this
		const amount = (value - this.min) / this.range

		const hue = THREE.MathUtils.lerp(0.7, 0.2, amount)
		const saturation = 1
		const lightness = THREE.MathUtils.lerp(0.1, 1.0, amount)
		const color = new THREE.Color()
		color.setHSL(hue, saturation, lightness)
		this.mesh.setColorAt(i, color)

		lonHelper.rotation.y = THREE.MathUtils.degToRad(lon) + Math.PI * 0.5
		latHelper.rotation.x = THREE.MathUtils.degToRad(-lat)

		positionHelper.updateWorldMatrix(true, false)
		const h = THREE.MathUtils.lerp(0.01, 0.5, amount)
		positionHelper.scale.set(0.01, 0.01, h <= this.currentBarH ? h : this.currentBarH)
		originHelper.updateWorldMatrix(true, false)

		this.mesh.setMatrixAt(i, originHelper.matrixWorld)
	}

	animateAction() {
		TWEEN.update()
	}

	update() {
		this.animateAction()
		super.update()
	}
}
