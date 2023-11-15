import * as THREE from "three"
import WebGl, { type IConfig } from "@utils/three/webGl"
import * as d3 from "d3"
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import gsap from "gsap"
import { random } from "@/utils/tools"

const texture = new THREE.TextureLoader()
const textureMap = texture.load("/threejsDemo/map/gz-map.jpg")
textureMap.wrapS = THREE.RepeatWrapping
textureMap.wrapT = THREE.RepeatWrapping
textureMap.flipY = false
textureMap.rotation = THREE.MathUtils.degToRad(45)
const scale = 0.128
textureMap.repeat.set(scale, scale)
const topFaceMaterial = new THREE.MeshPhongMaterial({
	map: textureMap,
	color: 0xb4eeea,
	combine: THREE.MultiplyOperation,
	transparent: true,
	opacity: 1
})
const sideMaterial = new THREE.MeshLambertMaterial({
	color: 0x123024,
	transparent: true,
	opacity: 0.9
})

export default class Map extends WebGl {
	width = 200
	depth = 5
	offsetXY = d3.geoMercator()
	group = new THREE.Group()
	lineGroup = new THREE.Group()
	pillarGroup = new THREE.Group()
	cityMeshList = []
	prevMove
	raycaster = new THREE.Raycaster()
	rotatingApertureMesh
	rotatingPointMesh

	constructor(domElement: HTMLDivElement, config: IConfig = {}) {
		super(domElement, config)
		this.camera.position.set(0, 180, 180)
		this.addAmbientLight(0x7af4ff, 1)
		this.addDirectionalLight(0, 100, 100, 0x7af4ff, 1)
		this.orbitControls.maxPolarAngle = (Math.PI / 2) * 0.98
		this.orbitControls.enablePan = false

		this.loadMap(120000)

		this.rotatingApertureMesh = this.initRotatingAperture()
		this.rotatingPointMesh = this.initRotatingPoint()
		this.initSceneBg()
		this.initCirclePoint()
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

	loadMap(city) {
		const url = `https://geo.datav.aliyun.com/areas_v3/bound/${city}_full.json`
		fetch(url)
			.then(res => res.json())
			.then(data => {
				this.createMap(data)
				this.group.rotation.x = -Math.PI / 2
				this.group.add(this.lineGroup)
				this.group.add(this.pillarGroup)
				this.setCenter(this.group)
				this.scene.add(this.group)
				window.addEventListener("mousemove", this.mousemove.bind(this))
			})
	}
	createMap(data) {
		const center = data.features[0].properties.centroid
		this.offsetXY.center(center).translate([0, 0])
		data.features = data.features.filter(item => item.properties.name !== "")
		data.features.forEach(feature => {
			const { centroid, center, name, adcode } = feature.properties
			const { coordinates, type } = feature.geometry
			const point = centroid || center
			const label = this.createLabel(name, point)

			const unit = new THREE.Group()
			unit.name = name
			coordinates.forEach(coordinate => {
				if (type === "Polygon") coordinate = [coordinate]
				coordinate.forEach(item => {
					const mesh = this.createMesh(item, adcode)
					const line = this.createLine(item)
					this.lineGroup.add(line[1])
					unit.add(mesh, line[0])
				})
			})

			// const light = this.createLightPillar(point)
			// this.pillarGroup.add(light)

			unit.add(label)
			this.group.add(unit)
		})
	}

	setCenter(map) {
		const box = new THREE.Box3().setFromObject(map)
		const x = box.max.x - box.min.x
		const y = box.max.y - box.min.y
		const maxDim = Math.max(x, y)
		const scale = (this.width - 20) / maxDim
		map.scale.set(scale, scale, 1)

		const center = box.getCenter(new THREE.Vector3())
		const offset = [0, 0]
		map.position.x = (map.position.x - center.x - offset[0]) * scale
		map.position.z = (map.position.z - center.z - offset[1]) * scale
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
		const mesh = new THREE.Mesh(geometry, [topFaceMaterial, sideMaterial])
		mesh.name = adcode
		this.cityMeshList.push(mesh)
		return mesh
	}
	createLightPillar(point, heightScaleFactor = 10) {
		const [x, y] = this.offsetXY(point)
		const group = new THREE.Group()
		// 柱体高度
		const height = heightScaleFactor
		// 柱体的geo,6.19=柱体图片高度/宽度的倍数
		const geometry = new THREE.PlaneGeometry(height / 6.219, height)
		// 柱体旋转90度，垂直于Y轴
		geometry.rotateX(Math.PI / 2)
		// 柱体的z轴移动高度一半对齐中心点
		geometry.translate(0, 0, height / 2)
		// 柱子材质
		const textureLoader = new THREE.TextureLoader()
		const material = new THREE.MeshBasicMaterial({
			map: textureLoader.load("./threejsDemo/map/光柱.png"),
			color: 0x00ffff,
			transparent: true,
			depthWrite: false,
			side: THREE.DoubleSide
		})
		// 光柱01
		const light01 = new THREE.Mesh(geometry, material)
		light01.name = "createLightPillar01"
		// 光柱02：复制光柱01
		const light02 = light01.clone()
		light02.name = "createLightPillar02"
		// 光柱02，旋转90°，跟 光柱01交叉
		light02.rotateZ(Math.PI / 2)
		// 创建底部标点
		const bottomMesh = this.createPointMesh()
		// 创建光圈
		const lightHalo = this.createLightHalo()
		// 将光柱和标点添加到组里
		group.add(lightHalo, bottomMesh, light01, light02)
		// 设置组对象的姿态
		group.position.set(x, -y, this.depth + 0.1)
		return group
	}
	// 创建光圈
	createLightHalo() {
		const geometry = new THREE.PlaneGeometry(1, 1)
		const textureLoader = new THREE.TextureLoader()
		const material = new THREE.MeshBasicMaterial({
			map: textureLoader.load("./threejsDemo/map/标注光圈.png"),
			color: 0x00ffff,
			side: THREE.DoubleSide,
			opacity: 0,
			transparent: true,
			depthWrite: false
		})
		const mesh = new THREE.Mesh(geometry, material)
		mesh.name = "createLightHalo"
		const timeLine = gsap.timeline({
			repeat: -1,
			delay: random(0, 10)
		})
		timeLine.to(mesh.scale, {
			x: 1.5,
			y: 1.5,
			z: 1.5,
			duration: 2,
			ease: "none"
		})
		timeLine.to(
			material,
			{
				opacity: 1,
				duration: 1,
				ease: "none"
			},
			"<"
		)
		timeLine.to(mesh.scale, {
			x: 5,
			y: 5,
			z: 5,
			duration: 2,
			ease: "none"
		})
		timeLine.to(
			material,
			{
				opacity: 0,
				duration: 2,
				ease: "none"
			},
			"<"
		)
		return mesh
	}
	// 创建标记点
	createPointMesh() {
		const geometry = new THREE.PlaneGeometry(1, 1)
		const textureLoader = new THREE.TextureLoader()
		const material = new THREE.MeshBasicMaterial({
			map: textureLoader.load("./threejsDemo/map/标注.png"),
			color: 0x00ffff,
			side: THREE.DoubleSide,
			transparent: true,
			depthWrite: false //禁止写入深度缓冲区数据
		})
		const mesh = new THREE.Mesh(geometry, material)
		mesh.name = "createPointMesh"
		return mesh
	}
	// 创建线
	createLine(data) {
		const points = []
		data.forEach(item => {
			const [x, y] = this.offsetXY(item)
			points.push(new THREE.Vector3(x, -y, 0))
		})
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
		const uplineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 20 })
		const downlineMaterial = new THREE.LineBasicMaterial({ color: 0x61fbfd, linewidth: 20, depthTest: false })
		const upLine = new THREE.Line(lineGeometry, uplineMaterial)
		const downLine = new THREE.Line(lineGeometry, downlineMaterial)
		downLine.position.z = -0.2
		upLine.position.z = this.depth + 0.0001
		return [upLine, downLine]
	}
	// 创建标签
	createLabel(name, point) {
		if (!point) {
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
		return label
	}
	// 初始化旋转光圈
	initRotatingAperture() {
		const texture = new THREE.TextureLoader()
		const rotatingApertureTexture = texture.load("/threejsDemo/map/rotatingAperture.png")
		const plane = new THREE.PlaneGeometry(this.width, this.width)
		const material = new THREE.MeshBasicMaterial({
			map: rotatingApertureTexture,
			transparent: true,
			opacity: 1,
			depthTest: true
		})
		const mesh = new THREE.Mesh(plane, material)
		mesh.position.set(0, -1.9, 0)
		mesh.rotation.x = -Math.PI / 2
		this.scene.add(mesh)
		return mesh
	}
	// 初始化旋转点
	initRotatingPoint() {
		const texture = new THREE.TextureLoader()
		const rotatingPointTexture = texture.load("/threejsDemo/map/rotating-point2.png")
		rotatingPointTexture.magFilter = THREE.LinearFilter
		rotatingPointTexture.minFilter = THREE.LinearMipMapLinearFilter
		const plane = new THREE.PlaneGeometry(this.width - 20, this.width - 20)
		const material = new THREE.MeshBasicMaterial({
			map: rotatingPointTexture,
			transparent: true,
			opacity: 1,
			depthTest: true
		})
		const mesh = new THREE.Mesh(plane, material)
		mesh.position.set(0, -0.2, 0)
		mesh.rotation.x = -Math.PI / 2
		this.scene.add(mesh)
		return mesh
	}
	// 初始化背景
	initSceneBg() {
		const texture = new THREE.TextureLoader()
		const sceneBg = texture.load("/threejsDemo/map/scene-bg2.png")
		const plane = new THREE.PlaneGeometry(this.width * 4, this.width * 4)
		const material = new THREE.MeshPhongMaterial({
			map: sceneBg,
			transparent: true,
			opacity: 1,
			depthTest: true
		})

		const mesh = new THREE.Mesh(plane, material)
		mesh.rotation.x = -Math.PI / 2
		mesh.position.set(0, -2.2, 0)
		this.scene.add(mesh)
	}
	// 初始化原点
	initCirclePoint() {
		const texture = new THREE.TextureLoader()
		const circlePoint = texture.load("/threejsDemo/map/circle-point.png")
		const plane = new THREE.PlaneGeometry(this.width, this.width)
		const material = new THREE.MeshPhongMaterial({
			map: circlePoint,
			transparent: true,
			opacity: 1
		})
		const mesh = new THREE.Mesh(plane, material)
		mesh.rotation.x = -Math.PI / 2
		mesh.position.set(0, -2.1, 0)
		this.scene.add(mesh)
	}
	mapDestory() {
		window.removeEventListener("click", this.mousemove)
	}
	updateMap() {
		if (this.rotatingApertureMesh) {
			this.rotatingApertureMesh.rotation.z += 0.0005
		}
		if (this.rotatingPointMesh) {
			this.rotatingPointMesh.rotation.z -= 0.0005
		}
	}
}
