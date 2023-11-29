import * as THREE from "three"
import gsap from "gsap"
import Stats from "three/examples/jsm/libs/stats.module"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader"
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer"
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer"
import Scene from "./scene"
import PerspectiveCamera from "./perspectiveCamera"
import WebGlRenderer from "./webGLRenderer"
import OControls from "./orbitControls"
import FControls from "./flyControls"
import AxesHelper from "./axesHelper"
import GridHelper from "./gridHelper"
import VertexNormalsHelperCustom from "./vertexNormalsHelper"
import AmbientLight from "./ambientLight"
import DirectionLight from "./directionLight"
import PointLight from "./pointLight"
import SpotLight from "./spotLight"
import HemisphereLight from "./hemisphereLight"
import RectAreaLight from "./rectAreaLight"
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import type { FlyControls } from "three/examples/jsm/controls/FlyControls"
import type { Group, WebGLRendererParameters } from "three"
import spriteText from "./spriteText"
import { isType } from "../tools"

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

const defaultConfig: IConfig = {
	controls: {
		type: "OrbitControls"
	},
	camera: {
		type: "PerspectiveCamera"
	},
	loading: {
		show: false,
		html: false
	}
}

export default class WebGl {
	config: IConfig
	domElement: HTMLDivElement
	scene: THREE.Scene
	camera
	cameraList: any = {}
	webGlRender: THREE.WebGLRenderer
	orbitControls: OrbitControls
	flyControls: FlyControls
	clock: THREE.Clock
	stats: Stats
	gui: GUI
	css3dRednerer: CSS3DRenderer
	css2DRenderer: CSS2DRenderer
	composer: EffectComposer
	renderPass: RenderPass
	effect: boolean
	loading = {
		loadingManager: null as THREE.LoadingManager,
		url: "",
		loaded: 0,
		total: 0,
		progress: "0"
	}

	constructor(domElement: HTMLDivElement, config: IConfig = {}) {
		const threeConfig = JSON.parse(JSON.stringify(defaultConfig))
		this.config = Object.assign(threeConfig, config)
		this.domElement = domElement
		this.scene = this.createScene()
		this.camera = this.createPerspectiveCamera(50, 50, 50)
		this.camera.lookAt(this.scene.position)
		this.scene.add(this.camera)
		this.webGlRender = this.createWebGlRender(this.domElement, this.config.render)
		this.webGlRender.render(this.scene, this.camera)
		this.clock = new THREE.Clock()
		this.initControls(this.config.controls.type)
		config.css3DRender && this.addCSS3dRenderer()
		config.css2DRender && this.addCSS2dRenderer()
		config.effect && this.addEffect()
		this.loading.loadingManager = this.createLoadingManager()
		window.addEventListener("resize", this.resize.bind(this))
	}

	/**
	 * 创建场景
	 * @returns THREE.Scene
	 */
	createScene() {
		return Scene()
	}

	/**
	 * 添加后期处理
	 */
	addEffect() {
		this.composer = new EffectComposer(this.webGlRender)
		this.composer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		this.renderPass = new RenderPass(this.scene, this.camera)
		this.composer.addPass(this.renderPass)
	}

	/**
	 * 创建一个透视相机
	 * @param x
	 * @param y
	 * @param z
	 * @param fov 摄像机视锥体垂直视野角度
	 * @param name 摄像机名称
	 * @param width 场景宽度
	 * @param height 场景高度
	 * @returns 透视相机
	 */
	createPerspectiveCamera(
		x: number,
		y: number,
		z: number,
		fov: number = 45,
		name: string | number = Object.keys(this.cameraList).length + 1,
		width = this.domElement.offsetWidth,
		height = this.domElement.offsetHeight,
		near: number = 0.01,
		far: number = 50000
	): THREE.PerspectiveCamera {
		const perspectiveCamera = PerspectiveCamera(x, y, z, fov, name, width, height, near, far)
		perspectiveCamera.aspect = this.domElement.offsetWidth / this.domElement.offsetHeight
		perspectiveCamera.updateProjectionMatrix()
		this.cameraList[perspectiveCamera.name] = perspectiveCamera
		return perspectiveCamera
	}

	/**
	 * 切换相机
	 * @param name
	 */
	switchCamera(name: string | number) {
		this.camera = this.cameraList[name]
		if (this.orbitControls) {
			this.orbitControls.object = this.camera
		}
		if (this.flyControls) {
			this.flyControls.object = this.camera
		}
	}

	/**
	 * 创建轨道控制器
	 * @param camera
	 * @param renderer
	 * @returns
	 */
	createOrbitControls(
		camera: THREE.Camera = this.camera,
		renderer: THREE.WebGLRenderer | CSS3DRenderer = this.webGlRender
	): OrbitControls {
		return OControls(camera, renderer)
	}

	/**
	 * 创建飞行控制器
	 * @param camera
	 * @param renderer
	 * @returns
	 */
	createFlyControls(
		camera: THREE.Camera = this.camera,
		renderer: THREE.WebGLRenderer | CSS3DRenderer = this.webGlRender
	): FlyControls {
		return FControls(camera, renderer)
	}

	/**
	 * 初始化控制器
	 * @param 控制器类型 "OrbitControls" | "FlyControls" | false
	 * @returns "OrbitControls" | "FlyControls" | undefind
	 */
	initControls(type) {
		if (!type) return
		switch (type) {
			case "OrbitControls":
				this.orbitControls = this.createOrbitControls()
				break
			case "FlyControls":
				this.flyControls = this.createFlyControls()
				break
		}
	}

	/**
	 * 创建渲染器
	 * @param domElement DOMElement
	 * @param config 配置
	 * @returns
	 */
	createWebGlRender(domElement: HTMLDivElement, config: WebGLRendererParameters = {}) {
		return WebGlRenderer(domElement, config)
	}

	/**
	 * 创建组
	 * @param name 名称
	 * @returns THREE.Group
	 */
	createGroup(name: string = "group") {
		const group = new THREE.Group()
		group.name = name
		return group
	}

	/**
	 * 添加css3d渲染
	 */
	addCSS3dRenderer() {
		this.css3dRednerer = new CSS3DRenderer()
		this.css3dRednerer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		this.domElement.appendChild(this.css3dRednerer.domElement)
		this.css3dRednerer.domElement.style.position = "absolute"
		this.css3dRednerer.domElement.style.top = "0"
		this.css3dRednerer.domElement.style.left = "0"
		this.css3dRednerer.domElement.style.zIndex = "999"
		this.css3dRednerer.domElement.style.transformOrigin = "0px 0px"
		this.css3dRednerer.domElement.style.pointerEvents = "none"
	}

	/**
	 * 添加css2d渲染
	 */
	addCSS2dRenderer() {
		this.css2DRenderer = new CSS2DRenderer()
		this.css2DRenderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		this.domElement.appendChild(this.css2DRenderer.domElement)
		this.css2DRenderer.domElement.style.position = "absolute"
		this.css2DRenderer.domElement.style.top = "0"
		this.css2DRenderer.domElement.style.left = "0"
		this.css2DRenderer.domElement.style.zIndex = "999"
		this.css2DRenderer.domElement.style.transformOrigin = "0px 0px"
		this.css2DRenderer.domElement.style.pointerEvents = "none"
	}

	/**
	 * 添加环境光
	 * @param color 颜色
	 * @param intensity 光照的强度
	 * @returns 环境光
	 */
	addAmbientLight(color: string | number = 0xffffff, intensity: number = 1): THREE.AmbientLight {
		const ambientLight = AmbientLight(color, intensity)
		this.scene.add(ambientLight)
		return ambientLight
	}

	/**
	 * 添加平行光
	 * @param x
	 * @param y
	 * @param z
	 * @param color 颜色
	 * @param intensity 光照强度
	 * @param isCastShadow 是否产生阴影
	 * @returns DirectionalLight
	 */
	addDirectionalLight(
		x: number,
		y: number,
		z: number,
		color: number | string = 0xffffff,
		intensity: number = 1,
		isCastShadow: boolean = true
	): THREE.DirectionalLight {
		const directionalLight = DirectionLight(x, y, z, color, intensity, isCastShadow)
		this.scene.add(directionalLight)
		return directionalLight
	}

	/**
	 * 添加点光源
	 * @param x
	 * @param y
	 * @param z
	 * @param color 颜色
	 * @param intensity 光照强度
	 * @param distance 光源照射的最大距离
	 * @param decay 沿着光照距离的衰退量
	 * @returns PointLight
	 */
	addPointLight(
		x: number = 0,
		y: number = 300,
		z: number = 300,
		color: number | string = 0xffffff,
		intensity: number = 1,
		distance: number = 0,
		decay: number = 2
	): THREE.PointLight {
		const pointLight = PointLight(x, y, z, color, intensity, distance, decay)
		this.scene.add(pointLight)
		return pointLight
	}

	/**
	 * 添加聚光灯
	 * @param x
	 * @param y
	 * @param z
	 * @param color 颜色
	 * @param intensity 强度
	 * @param isCastShadow 阴影
	 * @returns SpotLight
	 */
	addSpotLight(
		x: number = 100,
		y: number = 100,
		z: number = 100,
		color: number | string = 0xffffff,
		intensity: number = 1,
		penumbra: number = 0,
		decay: number = 2,
		isCastShadow: boolean = true
	): THREE.SpotLight {
		const spotLight = SpotLight(x, y, z, color, intensity, penumbra, decay, isCastShadow)
		this.scene.add(spotLight)
		return spotLight
	}

	/**
	 * 添加半球光
	 * @param skyColor 空中发出光线的颜色
	 * @param groundColor 地面发出光线的颜色
	 * @param intensity 光照强度
	 * @returns HemisphereLight
	 */
	addHemisphereLight(
		skyColor: number | string = 0x0000ff,
		groundColor: number | string = 0x00ff00,
		intensity = 1
	): THREE.HemisphereLight {
		const hemisphereLight = HemisphereLight(skyColor, groundColor, intensity)
		this.scene.add(hemisphereLight)
		return hemisphereLight
	}

	/**
	 * 添加平面光
	 * @param x
	 * @param y
	 * @param z
	 * @param color 光照颜色
	 * @param width 光源宽度
	 * @param height 光源高度
	 * @param intensity 光源强度
	 * @returns RectAreaLight
	 */
	addRectAreaLight(
		x: number = 0,
		y: number = 300,
		z: number = 300,
		color: number | string = 0xffffff,
		width: number = 50,
		height: number = 50,
		intensity: number = 1
	): THREE.RectAreaLight {
		const rectAreaLight = RectAreaLight(x, y, z, color, width, height, intensity)
		this.scene.add(rectAreaLight)
		return rectAreaLight
	}

	/**
	 * 加载管理器
	 * @returns THREE.LoadingManager
	 */
	createLoadingManager() {
		let divBackground
		let divLoadingProgress
		let divLoadingText
		if (this.config.loading.html) {
			this.domElement.style.position = "relative"
			divBackground = document.createElement("div")
			divBackground.setAttribute("id", "web3dLoading")
			divBackground.style.width = this.domElement.offsetWidth + "px"
			divBackground.style.height = this.domElement.offsetHeight + "px"
			divBackground.style.backgroundColor = "#000"
			divBackground.style.position = "absolute"
			divBackground.style.top = "0"
			divBackground.style.left = "0"
			divBackground.style.display = "flex"
			divBackground.style.alignItems = "center"
			divBackground.style.justifyContent = "center"
			divBackground.style.flexDirection = "column"
			divBackground.style.zIndex = "9999"
			divBackground.style.color = "#fff"
			if (this.config.loading.loadingId) {
				const fullScreenDiv = document.getElementById(this.config.loading.loadingId)
				fullScreenDiv.appendChild(divBackground)
			} else {
				this.domElement.appendChild(divBackground)
			}

			const divLoadingBody = document.createElement("div")
			divLoadingBody.setAttribute("id", "web3dLoadingBody")
			divLoadingBody.style.position = "relative"
			divLoadingBody.style.width = "40%"
			divLoadingBody.style.height = "4%"
			divLoadingBody.style.backgroundColor = "#fff"
			divLoadingBody.style.border = "2px solid #ccc"
			divLoadingBody.style.borderRadius = "50px"
			divBackground.appendChild(divLoadingBody)

			divLoadingProgress = document.createElement("div")
			divLoadingProgress.setAttribute("id", "web3dLoadingProgress")
			divLoadingProgress.style.position = "absolute"
			divLoadingProgress.style.width = "0%"
			divLoadingProgress.style.height = "100%"
			divLoadingProgress.style.backgroundColor = "#3087da"
			divLoadingProgress.style.borderRadius = "50px"
			divLoadingBody.appendChild(divLoadingProgress)

			divLoadingText = document.createElement("div")
			divLoadingText.setAttribute("id", "web3dLoadingText")
			divLoadingText.style.width = "40%"
			divLoadingText.style.height = "4%"
			divLoadingText.style.textAlign = "center"
			divLoadingText.style.marginTop = "20px"
			divBackground.appendChild(divLoadingText)
		}

		const loadingManager = new THREE.LoadingManager()
		loadingManager.onProgress = (url, loaded, total) => {
			this.loading.url = url
			this.loading.loaded = loaded
			this.loading.total = total
			this.loading.progress = ((loaded / total) * 100).toFixed(2)
			if (this.config.loading.html) {
				divLoadingProgress.style.width = this.loading.progress + "%"
				divLoadingText.innerHTML = "已加载 " + loaded + "件 共 " + total + " 件 进度 " + this.loading.progress + "%"
			}
		}
		loadingManager.onLoad = () => {
			if (this.config.loading.html) {
				divBackground.remove()
			}
			this.config.loading.callback && this.config.loading.callback()
		}
		return loadingManager
	}

	/**
	 * 加载纹理
	 * @param url 图片路径
	 * @param loading 首次加载时显示loading
	 * @returns Promise<THREE.Texture>
	 */
	loaderMap(url: string, loading: boolean = true): Promise<THREE.Texture> {
		const textureLoader = new THREE.TextureLoader(loading && this.config.loading.show ? this.loading.loadingManager : undefined)
		return new Promise(resolve => {
			textureLoader.load(url, texture => {
				resolve(texture)
			})
		})
	}

	/**
	 * 设置全景图
	 * @param url 图片路径
	 * @param loading 首次加载时显示loading
	 * @returns Promise<THREE.Texture>
	 */
	setBgPicture(url: string, loading: boolean = true): Promise<THREE.Texture> {
		const textureLoader = new THREE.TextureLoader(loading && this.config.loading.show ? this.loading.loadingManager : undefined)
		return new Promise(resolve => {
			textureLoader.load(url, texture => {
				texture.mapping = THREE.EquirectangularRefractionMapping
				this.scene.background = texture
				this.scene.environment = texture
				resolve(texture)
			})
		})
	}

	/**
	 * 添加场景盒
	 * @param imgArray 图片数组
	 * @param loading 首次加载时显示loading
	 * @returns Promise<THREE.CubeTextureLoader>
	 */
	setBgCube(imgArray: string[], loading: boolean = true) {
		return new Promise(resolve => {
			const textureCubeLoader = new THREE.CubeTextureLoader(
				loading && this.config.loading.show ? this.loading.loadingManager : undefined
			)
			const textureCube = textureCubeLoader.load(imgArray)
			this.scene.background = textureCube
			this.scene.environment = textureCube
			resolve(textureCube)
		})
	}

	/**
	 * 加载hdr
	 * @param url hdr图片地址
	 * @param loading 首次加载时显示loading
	 * @returns Promise<THREE.DataTexture>
	 */
	hdrLoader(url: string, loading: boolean = true): Promise<THREE.DataTexture> {
		const hdrLoader = new RGBELoader(loading && this.config.loading.show ? this.loading.loadingManager : undefined)
		return new Promise(resolve => {
			hdrLoader.load(url, hdr => {
				resolve(hdr)
			})
		})
	}

	/**
	 * 设置hdr全景图
	 * @param url hdr图片地址
	 * @param loading 首次加载时显示loading
	 * @returns Promise<THREE.DataTexture>
	 */
	setBgHdr(url: string, loading: boolean = true): Promise<THREE.DataTexture> {
		return new Promise(resolve => {
			this.hdrLoader(url, loading).then(texture => {
				texture.mapping = THREE.EquirectangularReflectionMapping
				texture.format = THREE.RGBAFormat
				this.scene.background = texture
				this.scene.environment = texture
				resolve(texture)
			})
		})
	}

	/**
	 * 加载gltf模型
	 * @param url 模型地址
	 * @param loading 首次加载时显示loading
	 * @returns Primise<GLTF>
	 */
	addGltf(url: string, loading: boolean = true): Promise<GLTF> {
		const gltfLoader = new GLTFLoader(loading && this.config.loading.show ? this.loading.loadingManager : undefined)
		const dracoLoader = new DRACOLoader()
		dracoLoader.setDecoderPath("./draco/gltf/")
		dracoLoader.setDecoderConfig({ type: "js" })
		dracoLoader.preload()
		gltfLoader.setDRACOLoader(dracoLoader)

		return new Promise(resolve => {
			gltfLoader.load(url, gltf => {
				resolve(gltf)
			})
		})
	}

	/**
	 * 加载glb模型
	 * @param url 模型地址
	 * @param loading 首次加载时显示loading
	 * @returns Promise<GLB>
	 */
	addGlb(url: string, loading: boolean = true): Promise<GLTF> {
		const gltfLoader = new GLTFLoader(loading && this.config.loading.show ? this.loading.loadingManager : undefined)
		return new Promise(resolve => {
			gltfLoader.load(url, glb => {
				resolve(glb)
			})
		})
	}

	/**
	 * 加载fbx模型
	 * @param url 模型地址
	 * @param loading 首次加载时显示loading
	 * @returns Promise<THREE.Group>
	 */
	addFbx(url: string, loading: boolean = true): Promise<Group> {
		const fbxLoader = new FBXLoader(loading && this.config.loading.show ? this.loading.loadingManager : undefined)
		return new Promise(resolve => {
			fbxLoader.load(url, gltf => {
				resolve(gltf)
			})
		})
	}

	/**
	 * 加载json文件
	 * @param url json链接
	 * @returns
	 */
	addJSON(url) {
		const loader = new THREE.FileLoader()
		loader.setResponseType("json")
		return new Promise(resolve => {
			loader.load(url, json => {
				resolve(json)
			})
		})
	}

	/**
	 * 创建文字
	 * @param x
	 * @param y
	 * @param z
	 * @param text 文字
	 * @param options { fontSize?: 文字大小; backgroundColor?: 背景; color?: 文字颜色 }
	 * @returns
	 */
	createSpriteText(
		x: number,
		y: number,
		z: number,
		text: string,
		options?: { fontSize?: number; backgroundColor?: string; color?: string }
	) {
		return spriteText(x, y, z, text, options || {})
	}

	/**
	 * 视频纹理
	 * @param url 视频链接
	 * @param autoplay 自动播放
	 * @param loop 循环播放
	 * @param muted 静音
	 * @returns THREE.VideoTexture
	 */
	addVideoTexture(url: string, loop: boolean = true, muted: boolean = true): Promise<THREE.VideoTexture> {
		return new Promise(resolve => {
			const video = document.createElement("video")
			video.src = url
			video.muted = muted
			video.loop = loop
			video.play()
			const texture = new THREE.VideoTexture(video)
			resolve(texture)
		})
	}

	/**
	 * 创建坐标轴辅助器
	 * @param size 长度
	 */
	addAxesHelper(size: number = 50, name: string = "axesHelper"): THREE.AxesHelper {
		const axesHelper = AxesHelper(size)
		axesHelper.name = name
		this.scene.add(axesHelper)
		return axesHelper
	}

	/**
	 * 创建坐标格辅助对象
	 * @param size 坐标格尺寸
	 * @param divisions 坐标格细分次数
	 */
	addGridHelper(
		size: number = 50,
		divisions: number = 50,
		colorCenterLine: THREE.Color = new THREE.Color(0x444444),
		colorGrid: THREE.Color = new THREE.Color(0x888888)
	): THREE.GridHelper {
		const gridHelper = GridHelper(size, divisions, colorCenterLine, colorGrid)
		this.scene.add(gridHelper)
		return gridHelper
	}

	/**
	 * 箭头辅助对象
	 * @param object 要渲染顶点法线辅助的对象
	 * @param size 箭头的长度. 默认为 1
	 * @param linewidth 箭头线段的宽度. 默认为 1
	 * @param color 16进制颜色值. 默认为 0xff0000
	 * @returns VertexNormalsHelper
	 */
	addVertexNormalsHelper(
		object,
		name: string = "VertexNormalsHelper",
		size: number = 1,
		color: string | number = 0xff0000,
		linewidth: number = 1
	) {
		const vertexNormalsHelper = VertexNormalsHelperCustom(object, size, color, linewidth)
		vertexNormalsHelper.name = name
		this.scene.add(vertexNormalsHelper)
		return vertexNormalsHelper
	}

	/**
	 * 添加信息显示
	 * @param type 0: fps, 1: ms, 2: mb, 3+: custom
	 */
	addStats(type: number = 0) {
		this.stats = new Stats()
		this.stats.showPanel(type)
		this.stats.dom.style.position = "absolute"
		this.stats.dom.style.left = "0px"
		this.stats.dom.style.top = "0px"
		this.domElement.appendChild(this.stats.dom)
	}

	/**
	 * 添加GUI
	 * @returns GUI
	 */
	addGUI(): GUI {
		this.gui = new GUI()
		return this.gui
	}

	/**
	 * 测量模型长宽高
	 * @param mesh 物体
	 * @param unit 单位
	 * @param number 距离模型距离
	 * @returns THREE.Group
	 */
	meshSize(mesh: THREE.Mesh, unit: string = "m", number: number = 0.2) {
		const geometry = mesh.geometry
		geometry.computeBoundingBox()
		const box = geometry.boundingBox
		mesh.updateWorldMatrix(true, true)
		box.applyMatrix4(mesh.matrixWorld)

		const group = new THREE.Group()
		group.name = "meshSize"
		const center = box.getCenter(new THREE.Vector3())
		const size = new THREE.Vector3()
		size.x = box.max.x - box.min.x
		size.y = box.max.y - box.min.y
		size.z = box.max.z - box.min.z
		addLine(
			[center.x + size.x / 2 + number, center.y - size.y / 2, center.z + size.z / 2 + number],
			[center.x - size.x / 2 - number, center.y - size.y / 2, center.z + size.z / 2 + number]
		)
		addLine(
			[center.x + size.x / 2 + number, center.y - size.y / 2, center.z + size.z / 2],
			[center.x + size.x / 2 + number, center.y - size.y / 2, center.z - size.z / 2]
		)
		addLine(
			[center.x + size.x / 2 + number, center.y - size.y / 2, center.z - size.z / 2 - number],
			[center.x + size.x / 2 + number, center.y + size.y / 2, center.z - size.z / 2 - number]
		)
		addArrow([center.x + size.x / 2 + number, center.y - size.y / 2, center.z + size.z / 2 + number], 1)
		addArrow([center.x - size.x / 2 - number, center.y - size.y / 2, center.z + size.z / 2 + number], 2)
		addArrow([center.x + size.x / 2 + number, center.y - size.y / 2, center.z + size.z / 2], 3)
		addArrow([center.x + size.x / 2 + number, center.y - size.y / 2, center.z - size.z / 2], 4)
		addArrow([center.x + size.x / 2 + number, center.y - size.y / 2, center.z - size.z / 2 - number], 5)
		addArrow([center.x + size.x / 2 + number, center.y + size.y / 2, center.z - size.z / 2 - number], 6)
		const text1 = this.createSpriteText(
			center.x,
			center.y - size.y / 2,
			center.z + size.z / 2 + number * 2,
			size.x.toFixed(2) + unit
		)
		const text2 = this.createSpriteText(
			center.x + size.x / 2 + number * 2,
			center.y - size.y / 2,
			center.z,
			size.z.toFixed(2) + unit
		)
		const text3 = this.createSpriteText(
			center.x + size.x / 2 + number * 2,
			center.y,
			center.z - size.z / 2 - number * 2,
			size.y.toFixed(2) + unit
		)
		group.add(text1, text2, text3)

		function addLine(pontStart, pointEnd) {
			const lineGeo = []
			lineGeo.push(new THREE.Vector3(...pontStart))
			lineGeo.push(new THREE.Vector3(...pointEnd))
			const geometry = new THREE.BufferGeometry().setFromPoints(lineGeo)
			const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#666" }))
			group.add(line)
		}
		function addArrow(point, number) {
			const circle = new THREE.Mesh(
				new THREE.CircleGeometry(0.1, 0),
				new THREE.MeshBasicMaterial({
					color: "#666",
					side: THREE.DoubleSide
				})
			)
			group.add(circle)
			circle.scale.set(1, 0.5, 0.5)
			switch (number) {
				case 1: {
					circle.rotateX(Math.PI / 2)
					break
				}
				case 2: {
					circle.rotateY(Math.PI)
					circle.rotateX(Math.PI / 2)
					break
				}
				case 3: {
					circle.rotateY(-Math.PI / 2)
					circle.rotateX(Math.PI / 2)
					break
				}
				case 4: {
					circle.rotateY(Math.PI / 2)
					circle.rotateX(Math.PI / 2)
					break
				}
				case 5: {
					circle.rotateZ(-Math.PI / 2)
					break
				}
				case 6: {
					circle.rotateZ(Math.PI / 2)
					break
				}
			}
			circle.position.set(point[0], point[1], point[2])
		}

		group.scale.set(0.5, 0.5, 0.5)
		gsap.to(group.scale, {
			x: 1,
			y: 1,
			z: 1,
			duration: 0.5
		})
		return group
	}

	/**
	 * 更新场景
	 */
	update() {
		const t = this.clock?.getDelta()
		if (this.orbitControls) {
			this.orbitControls.update(t)
		}
		if (this.flyControls) {
			this.flyControls.update(t)
		}
		if (this.stats) {
			this.stats.update()
		}
		if (this.css3dRednerer) {
			this.css3dRednerer.render(this.scene, this.camera)
		}
		if (this.css2DRenderer) {
			this.css2DRenderer.render(this.scene, this.camera)
		}
		if (this.composer) {
			this.composer.render()
		} else if (this.webGlRender) {
			this.webGlRender.render(this.scene, this.camera)
		}
	}

	/**
	 * 监听页面大小变化
	 */
	resize() {
		for (const key in this.cameraList) {
			this.cameraList[key].aspect = this.domElement.offsetWidth / this.domElement.offsetHeight
			this.cameraList[key].updateProjectionMatrix()
		}
		if (this.css3dRednerer) {
			this.css3dRednerer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		}
		if (this.css2DRenderer) {
			this.css2DRenderer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		}
		if (this.composer) {
			this.composer.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		}
		this.webGlRender.setSize(this.domElement.offsetWidth, this.domElement.offsetHeight)
		this.webGlRender.setPixelRatio(window.devicePixelRatio)
	}

	/**
	 * 销毁场景中物体
	 */
	destroyMesh(group) {
		let object
		if (isType("String", group)) {
			object = this.scene.getObjectByName(group)
		} else {
			object = group
		}
		if (!object) return
		object.traverse(child => {
			if (child instanceof THREE.Mesh) {
				if (child.material.length) {
					child.material.forEach(material => {
						material.dispose()
					})
				} else {
					child.material.dispose()
				}
				child.geometry && child.geometry.dispose()
			}
			if (child instanceof CSS2DObject) {
				child.parent.remove(child)
			}
		})
		this.scene.remove(object)
	}

	/**
	 * 销毁
	 */
	destroy() {
		window.removeEventListener("resize", this.resize)
		if (this.gui) {
			this.gui.destroy()
		}
		this.scene.traverse(child => {
			if (child instanceof THREE.Mesh) {
				if (child.material.length) {
					child.material.forEach(material => {
						material.dispose()
					})
				} else {
					child.material.dispose()
				}
				child.geometry && child.geometry.dispose()
			}
		})
		this.webGlRender.dispose()
		this.webGlRender = null
		this.camera = null
		this.config = null
		this.domElement = null
		this.cameraList = null
		this.orbitControls = null
		this.flyControls = null
		this.clock = null
		this.stats = null
		this.gui = null
		this.css3dRednerer = null
		this.css2DRenderer = null
		this.composer = null
		this.renderPass = null
		this.effect = null
		this.loading = null
	}
}
