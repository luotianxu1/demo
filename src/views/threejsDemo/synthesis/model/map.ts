import * as THREE from "three"
import WebGlScene from "@utils/three/webGlScene"
import * as d3 from "d3"
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import gsap from "gsap"
import { Line2 } from "three/examples/jsm/lines/Line2"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry"
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial"
import LightPillar from "@/utils/three/mesh/lightPillar/lightPillar"

export interface IConfig {
	controls?: {
		type: "OrbitControls" | "FlyControls" | false
	}
	camera?: {
		type: "PerspectiveCamera" | "OrthographicCamera"
	}
	css3DRender?: boolean
	css2DRender?: boolean
	effect?: boolean
	loading?: {
		show?: boolean
		html?: boolean
		loadingId?: string
		callback?: Function
	}
}

export default class Map extends WebGlScene {
	width = 240
	depth = 8
	bottom = -3
	scale: number
	center: THREE.Vector3
	offsetXY = d3.geoMercator()
	group: THREE.Group
	mapGroup: THREE.Group
	bottomLineGroup: THREE.Group
	lightColumnGroup: THREE.Group
	cityMeshList: THREE.Mesh[] = []
	prevMove: THREE.Object3D
	raycaster = new THREE.Raycaster()
	rotatingApertureMesh
	rotatingPointMesh
	topFaceMaterial
	sideMaterial
	labelList = []

	constructor(domElement: HTMLDivElement, webGlRenderer: THREE.WebGLRenderer, config: IConfig = {}) {
		super(domElement, webGlRenderer, config)

		this.camera.position.set(0, 180, 180)
		this.addAmbientLight(0x7af4ff, 1)
		this.addDirectionalLight(0, 100, 100, 0x7af4ff, 1)
		this.orbitControls.maxPolarAngle = (Math.PI / 2) * 0.98
		this.orbitControls.enablePan = false
		this.orbitControls.target.set(0, -40, 0)
		this.orbitControls.enabled = false

		this.initMaterial()
		this.initRotatingAperture()
		this.initRotatingPoint()
		this.initSceneBg()
		this.initCirclePoint()
	}

	show() {
		this.loadMap(100000)
		this.orbitControls.enabled = true
	}

	hide(callBack?) {
		this.labelList.forEach(item => {
			item.element.style.display = "none"
		})
		this.orbitControls.enabled = false
		callBack && callBack()
	}
	// 加载地图
	loadMap(city) {
		this.orbitControls.target.set(0, -40, 0)
		this.camera.position.set(0, 180, 180)

		if (this.group) {
			this.destroyMesh(this.group)
			this.destroyMesh(this.lightColumnGroup)
			this.cityMeshList = []
		}
		return new Promise((res, rej) => {
			const url = `./threejsDemo/map/geojson/${city}.json`
			fetch(url)
				.then(res => res.json())
				.then(data => {
					this.initGroup()
					this.createMap(data)
					this.setCenter(this.group)
					this.createlightColumn(data)
					this.domElement.addEventListener("mousemove", this.mousemove.bind(this))
					res(true)
				})
		})
	}
	mousemove(event) {
		if (this.prevMove) {
			gsap.to(this.prevMove.position, {
				z: 0,
				duration: 1
			})
		}
		const mouse = new THREE.Vector2()
		mouse.x = (event.clientX / this.domElement.offsetWidth) * 2 - 1
		mouse.y = -(event.clientY / this.domElement.offsetHeight) * 2 + 1
		this.raycaster.setFromCamera(mouse, this.camera)
		const intersects = this.raycaster.intersectObjects(this.cityMeshList, true)

		if (intersects && intersects.length > 0) {
			const mesh = intersects[0].object.parent
			this.prevMove = mesh
			gsap.to(mesh.position, {
				z: 2,
				duration: 1
			})
		}
	}
	createMap(data) {
		const center = data.features[0].properties.centroid
		this.offsetXY.center(center).translate([0, 0])
		data.features = data.features.filter(item => item.properties.name !== "")
		data.features.forEach(feature => {
			const { centroid, center, name, adcode } = feature.properties
			const { coordinates, type } = feature.geometry
			const point = centroid || center
			const label = this.createLabel(point, name)

			const unit = new THREE.Group()
			unit.name = name
			coordinates.forEach(coordinate => {
				if (type === "Polygon") coordinate = [coordinate]
				coordinate.forEach(item => {
					const mesh = this.createMesh(item, adcode)
					const line = this.createLine(item)
					unit.add(mesh, line[0])
					this.bottomLineGroup.add(line[1])
				})
			})
			unit.add(label)
			this.mapGroup.add(unit)
		})
	}
	setCenter(map) {
		const box = new THREE.Box3().setFromObject(map)
		const x = box.max.x - box.min.x
		const z = box.max.z - box.min.z
		const maxDim = Math.max(x, z)
		this.scale = (this.width - 20) / maxDim
		map.scale.set(this.scale, this.scale, 1)

		this.center = box.getCenter(new THREE.Vector3())
		map.position.x = (map.position.x - this.center.x) * this.scale
		map.position.z = (map.position.z - this.center.z) * this.scale
	}
	createMesh(data, adcode) {
		const shape = new THREE.Shape()
		data.forEach((item, idx) => {
			const [x, y] = this.offsetXY(item)
			if (idx === 0) shape.moveTo(x, -y)
			else shape.lineTo(x, -y)
		})

		const geometry = new THREE.ExtrudeGeometry(shape, {
			depth: this.depth,
			bevelEnabled: false
		})
		const mesh = new THREE.Mesh(geometry, [this.topFaceMaterial, this.sideMaterial])
		mesh.name = adcode
		this.cityMeshList.push(mesh)
		return mesh
	}
	// 创建光柱组
	createlightColumn(data) {
		data.features = data.features.filter(item => item.properties.name !== "")
		data.features.forEach(feature => {
			const { centroid, center } = feature.properties
			const [x, y] = this.offsetXY(centroid || center)
			const lightPillar = new LightPillar({
				point: {
					x: x,
					y: -y,
					z: this.depth + 0.1
				}
			})
			const light = lightPillar.group
			light.scale.set(1 / this.scale, 1 / this.scale, 1)
			this.lightColumnGroup.add(light)
		})
		this.lightColumnGroup.scale.set(this.scale, this.scale, 1)
		this.lightColumnGroup.position.x = (this.lightColumnGroup.position.x - this.center.x) * this.scale
		this.lightColumnGroup.position.z = (this.lightColumnGroup.position.z - this.center.z) * this.scale
	}
	// 创建线
	createLine(data) {
		const points = []
		data.forEach(item => {
			const [x, y] = this.offsetXY(item)
			points.push(...[x, -y, 0])
		})
		const lineGeometry = new LineGeometry()
		lineGeometry.setPositions(points)
		const uplineMaterial = new LineMaterial({
			color: 0xffffff,
			linewidth: 1
		})
		uplineMaterial.resolution.set(this.domElement.offsetWidth, this.domElement.offsetHeight)
		const downlineMaterial = new LineMaterial({
			color: 0x61fbfd,
			linewidth: 4,
			depthTest: true,
			depthWrite: true
		})
		downlineMaterial.resolution.set(this.domElement.offsetWidth, this.domElement.offsetHeight)
		const upLine = new Line2(lineGeometry, uplineMaterial)
		const downLine = new Line2(lineGeometry, downlineMaterial)
		downLine.position.z = this.bottom
		upLine.position.z = this.depth + 0.5
		return [upLine, downLine]
	}
	// 创建标签
	createLabel(point, name) {
		if (!point || !name) {
			return
		}
		const div = document.createElement("div")
		div.style.color = "#fff"
		div.style.fontSize = "12px"
		div.style.textShadow = "1px 1px 2px #047cd6"
		div.textContent = name
		const label = new CSS2DObject(div)
		label.scale.set(0.01, 0.01, 0.01)
		const [x, y] = this.offsetXY(point)
		label.position.set(x, -y, this.depth)
		this.labelList.push(label)
		return label
	}
	// 加载贴图
	initMaterial() {
		this.loaderMap("/threejsDemo/map/gz-map.jpg").then(textureMap => {
			textureMap.wrapS = THREE.RepeatWrapping
			textureMap.wrapT = THREE.RepeatWrapping
			textureMap.flipY = false
			textureMap.rotation = THREE.MathUtils.degToRad(45)
			const scale = 0.128
			textureMap.repeat.set(scale, scale)
			this.topFaceMaterial = new THREE.MeshPhongMaterial({
				map: textureMap,
				color: 0xb4eeea,
				combine: THREE.MultiplyOperation,
				transparent: false,
				opacity: 1
			})
		})
		this.sideMaterial = new THREE.MeshLambertMaterial({
			color: 0x123024,
			transparent: false,
			opacity: 0.9
		})
	}
	// 初始化组
	initGroup() {
		this.group = this.createGroup("group")
		this.group.rotation.x = -Math.PI / 2
		this.bottomLineGroup = this.createGroup("bottomLineGroup")
		this.mapGroup = this.createGroup("mapGroup")
		this.group.add(this.bottomLineGroup)
		this.group.add(this.mapGroup)
		this.scene.add(this.group)
		this.lightColumnGroup = this.createGroup("lightColumnGroup")
		this.scene.add(this.lightColumnGroup)
		this.lightColumnGroup.rotation.x = -Math.PI / 2
	}
	// 初始化旋转光圈
	initRotatingAperture() {
		this.loaderMap("/threejsDemo/map/rotatingAperture.png").then(rotatingApertureTexture => {
			const plane = new THREE.PlaneGeometry(this.width, this.width)
			const material = new THREE.MeshBasicMaterial({
				map: rotatingApertureTexture,
				transparent: true,
				opacity: 1,
				depthTest: false,
				side: THREE.DoubleSide
			})
			const mesh = new THREE.Mesh(plane, material)
			mesh.position.set(0, this.bottom - 0.1, 0)
			mesh.rotation.x = -Math.PI / 2
			this.rotatingApertureMesh = mesh
			this.scene.add(mesh)
		})
	}
	// 初始化旋转点
	initRotatingPoint() {
		this.loaderMap("/threejsDemo/map/rotating-point2.png").then(rotatingPointTexture => {
			rotatingPointTexture.magFilter = THREE.LinearFilter
			rotatingPointTexture.minFilter = THREE.LinearMipMapLinearFilter
			const plane = new THREE.PlaneGeometry(this.width - 20, this.width - 20)
			const material = new THREE.MeshBasicMaterial({
				map: rotatingPointTexture,
				transparent: true,
				opacity: 1,
				depthTest: false,
				side: THREE.DoubleSide
			})
			const mesh = new THREE.Mesh(plane, material)
			mesh.position.set(0, this.bottom - 0.2, 0)
			mesh.rotation.x = -Math.PI / 2
			this.rotatingPointMesh = mesh
			this.scene.add(mesh)
		})
	}
	// 初始化背景
	initSceneBg() {
		this.loaderMap("/threejsDemo/map/scene-bg2.png").then(sceneBg => {
			const plane = new THREE.PlaneGeometry(this.width * 4, this.width * 4)
			const material = new THREE.MeshPhongMaterial({
				map: sceneBg,
				transparent: true,
				opacity: 1,
				depthTest: true,
				side: THREE.DoubleSide
			})
			const mesh = new THREE.Mesh(plane, material)
			mesh.rotation.x = -Math.PI / 2
			mesh.position.set(0, this.bottom - 0.3, 0)
			this.scene.add(mesh)
		})
	}
	// 初始化原点
	initCirclePoint() {
		this.loaderMap("/threejsDemo/map/circle-point.png").then(circlePoint => {
			const plane = new THREE.PlaneGeometry(this.width, this.width)
			const material = new THREE.MeshPhongMaterial({
				map: circlePoint,
				transparent: true,
				opacity: 1,
				side: THREE.DoubleSide
			})
			const mesh = new THREE.Mesh(plane, material)
			mesh.rotation.x = -Math.PI / 2
			mesh.position.set(0, this.bottom, 0)
			this.scene.add(mesh)
		})
	}
	mapDestory() {
		this.domElement.removeEventListener("mousemove", this.mousemove.bind(this))
		this.raycaster = null
		this.destroy()
	}
	updateMap() {
		if (this.rotatingApertureMesh) {
			this.rotatingApertureMesh.rotation.z += 0.0005
		}
		if (this.rotatingPointMesh) {
			this.rotatingPointMesh.rotation.z -= 0.0005
		}
		this.update()
	}
}
