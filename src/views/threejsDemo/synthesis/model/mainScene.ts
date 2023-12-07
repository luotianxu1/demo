import WebGlRenderer from "@/utils/three/webGLRenderer"
import Earth from "./earth"
import Map from "./map"

export interface IConfig {
	render?: THREE.WebGLRendererParameters
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

export default class MainScene {
	domElement: HTMLDivElement
	webGlRender: THREE.WebGLRenderer
	config
	earth: Earth
	map: Map
	active: "map" | "earth" = "earth"
	eventEvent

	constructor(domElement: HTMLDivElement, config: IConfig = {}) {
		this.domElement = domElement
		this.config = config
		this.webGlRender = WebGlRenderer(domElement, this.config.render)

		this.earth = new Earth(domElement, this.webGlRender)
		this.earth.orbitControls.enabled = true
		this.earth.load()
		this.earth.show()

		this.map = new Map(domElement, this.webGlRender, {
			css2DRender: true
		})

		this.eventEvent = this.resize.bind(this)
		window.addEventListener("resize", this.eventEvent)
	}

	changeScene(type) {
		if (this.active === type) {
			return
		} else if (type === "earth") {
			this.map.hide(() => {
				this.earth.show()
				this.active = type
			})
		} else if (type === "map") {
			this.earth.hide(() => {
				this.map.show()
				this.active = type
			})
		}
	}

	update() {
		if (this.active === "earth") {
			this.earth.updateEarth()
		} else if (this.active === "map") {
			this.map.updateMap()
		}
	}

	resize() {
		this.earth.resize()
		this.map.resize()
	}

	destroy() {
		window.removeEventListener("resize", this.eventEvent)
		this.earth.destroy()
		this.map.destroy()
		this.earth = null
		this.map = null
		this.domElement = null
		this.webGlRender = null
		this.eventEvent = null
	}
}
