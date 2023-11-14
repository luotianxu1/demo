import * as THREE from "three"
import WebGl, { type IConfig } from "@utils/three/webGl"
import * as d3 from "d3"
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import gsap from "gsap"

export default class Map extends WebGl {
	offsetXY = d3.geoMercator()
	map = new THREE.Group()
	cityList = []
	prevClick
	raycaster = new THREE.Raycaster()
	constructor(domElement: HTMLDivElement, config: IConfig = {}) {
		super(domElement, config)
		this.camera.position.set(0, 200, 200)
		this.addAmbientLight(0xffffff, 0.5)
		this.addDirectionalLight(0, 10, 10, 0xffffff, 1)

		this.loadMap(100000)

		window.addEventListener("click", this.click.bind(this))
	}
	click(event) {
		if (this.prevClick) {
			gsap.to(this.prevClick.position, {
				z: 0,
				duration: 1
			})
		}
		const mouse = new THREE.Vector2()
		mouse.x = (event.clientX / this.domElement.offsetWidth) * 2 - 1
		mouse.y = -(event.clientY / this.domElement.offsetHeight) * 2 + 1
		this.raycaster.setFromCamera(mouse, this.camera)
		const intersects = this.raycaster.intersectObjects(this.cityList, true)
		if (intersects && intersects.length > 0) {
			const mesh = intersects[0].object.parent
			this.prevClick = mesh
			gsap.to(mesh.position, {
				z: 10,
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
				this.map.rotation.x = -Math.PI / 2
				this.scene.add(this.map)
			})
	}
	createMap(data) {
		const center = data.features[0].properties.centroid
		this.offsetXY.center(center).translate([0, 0])
		const depth = Math.random() * 0.3 + 0.3
		data.features = data.features.filter(item => item.properties.name !== "")
		data.features.forEach(feature => {
			const { centroid, center, name } = feature.properties
			const { coordinates, type } = feature.geometry
			const point = centroid || center
			const label = this.createLabel(name, point, depth)

			const unit = new THREE.Group()
			unit.name = name
			coordinates.forEach(coordinate => {
				if (type === "Polygon") coordinate = [coordinate]
				coordinate.forEach(item => {
					const mesh = this.createMesh(item)
					const line = this.createLine(item)
					if (!mesh || !line) return
					unit.add(mesh, ...line)
				})
			})
			unit.add(label)
			this.map.add(unit)
			this.cityList.push(unit)
		})
		this.setCenter(this.map)
	}
	createLabel(name, point, depth) {
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
		label.position.set(x, -y, depth)
		return label
	}
	createMesh(data) {
		const shape = new THREE.Shape()
		data.forEach((item, idx) => {
			const [x, y] = this.offsetXY(item)
			if (idx === 0) shape.moveTo(x, -y)
			else shape.lineTo(x, -y)
		})
		const geometry = new THREE.ExtrudeGeometry(shape, {
			depth: 1,
			bevelEnabled: false
		})
		const material = new THREE.MeshPhongMaterial({
			color: 0x1479b1
		})
		return new THREE.Mesh(geometry, material)
	}
	createLine(data) {
		const points = []
		data.forEach(item => {
			const [x, y] = this.offsetXY(item)
			points.push(new THREE.Vector3(x, -y, 0))
		})
		const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
		const uplineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
		const downlineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })
		const upLine = new THREE.Line(lineGeometry, uplineMaterial)
		const downLine = new THREE.Line(lineGeometry, downlineMaterial)
		downLine.position.z = -0.0001
		upLine.position.z = 1 + 0.0001
		return [upLine, downLine]
	}
	setCenter(map) {
		const box = new THREE.Box3().setFromObject(map)
		const center = box.getCenter(new THREE.Vector3())
		const offset = [0, 0]
		map.position.x = map.position.x - center.x - offset[0]
		map.position.z = map.position.z - center.z - offset[1]
	}
	mapDestory() {
		window.removeEventListener("click", this.click)
	}
}
