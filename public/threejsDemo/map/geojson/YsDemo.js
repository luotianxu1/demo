import SceneA from './single/SceneA'
import SceneB from './single/SceneB'
import SceneC from './single/SceneC'
import Ys3dApp from '@/plugins/ys3d/index'
import {
  getProvinceGeo,
  getCityGeo,
  getChinaGeo
} from '@/http/requestData'
class YsDemo {
  constructor(options) {
    Object.assign(this, options)
    const el = document.getElementById('map')
    const app = new Ys3dApp(el, { // 初始化的全部参数
      updateTween: true,
      sortObjects: true,
      clearColor: 'rgb(23, 26,39)'
    })
    this.el = el
    this.app = app
    this._3d = app._3d
    this.renderer = app.renderer
    this.controls = app.initOrbitControls(el)
    this.controls.maxPolarAngle = Math.PI / 2.5
    this.controls.autoRotate = false
    this.controls.dampingFactor = 0.5
    this.controls.maxDistance = 500
    this.clock = new app._3d.Clock()
    this.currentSingleScene = undefined
    this.allowGoDown = true // 允许下钻
    this.level = 0 // 当前层级
    window.app = app
    const skyTexture = new this._3d.CubeTextureLoader()
      .setPath(this._this.outPublic + 'images/ysThree/sky2/')
      .load([
        'px.png', // 右(-1,0,0)
        'nx.png', // 左(1,0,0)
        'py.png', // 上(0,1,0)
        'ny.png', // 下(0,-1,0)
        'pz.png', // 前(0,0,1)
        'nz.png' // 后(0,0,-1)
      ])
    this.skyTexture = skyTexture
    this.transitionParams = {
      useTexture: false, // 为 false 默认采用渐变式
      transition: 0,
      transitionSpeed: 0.02,
      // texture: textures[0],
      animate: false
    }
  }

  init() {
    const sceneAInstance = new SceneA('sceneA', this.app, this)
    const sceneA = sceneAInstance.singleSceneInstance

    const sceneBInstance = new SceneB('sceneB', this.app, this)
    const sceneB = sceneBInstance.singleSceneInstance

    const sceneCInstance = new SceneC('sceneC', this.app, this)
    const sceneC = sceneCInstance.singleSceneInstance

    const transition = this.app.sceneTransition(sceneA, sceneB, this.transitionParams)
    this.transition = transition

    this.sceneAInstance = sceneAInstance
    this.sceneBInstance = sceneBInstance
    this.sceneCInstance = sceneCInstance

    this.sceneA = sceneA
    this.sceneB = sceneB
    this.sceneC = sceneC

    // 给 sceneA 初始化
    this.currentSingleScene = sceneA
    getChinaGeo().then(res => {
      sceneAInstance.init(res)
      this._this.showLoading = false
    })

    const composer = this.app.composer({ // 当前仅支持这几个后处理，如要用其他，请自行导入。
      unrealBloom: { // 发光
        strength: 0.1,
        renderToScreen: true
      }
    })
    this.composer = composer

    // 获取示例
    this.bloomPass = composer.bloomPass
    this.composer.renderScene.camera = this.sceneA.camera
    this.composer.renderScene.scene = this.sceneA.scene

    this.transition.update(this.sceneA, this.sceneA, true)
    // renderer
    this.app.render(() => {
      transition.render(this.clock.getDelta(), false, () => {
        // 其他代码  // 如composer  使用composer的时候 上方的 true 可以改为 false 并且切换场景后重新配置 composer中的 后期处理通道的camera和scene
        composer.render()
      }, () => {
        this.changeOverFun ? this.changeOverFun() : ''
      })
      this.app.controls.update()
    })
  }

  addEvents() {
    let pageX0
    let pageY0
    let pageX1
    let pageY1
    let currentHover
    const that = this
    const hoverColor = new that._3d.Color('yellow')
    // const list = []
    const evensObject = {
      // 点击
      click_tab(event) {
        const objectList = that.app.getIntersectObject(that.currentSingleScene.scene, event, true).objectList
        const obj = objectList.filter(e => e.object.isMesh)[0]
        if (obj) {
          if (that.currentSingleScene.name === 'sceneA') {
            that.handleSceneAClick(obj.object)
            // that.currentSingleScene = that.sceneB // 不能在此 否则影响动画的实现 等transition 之后才赋值
          } else if (that.currentSingleScene.name === 'sceneB') {
            that.handleSceneBClick(obj.object)
          } else if (that.currentSingleScene.name === 'sceneC') {
            that.handleSceneCClick(obj.object)
          }
          // list.push([obj.point.x.toFixed(3), obj.point.y.toFixed(3), obj.point.z.toFixed(3)])
          // console.log(JSON.stringify(list))
        }
      },
      move(event) {
        const objectList = that.app.getIntersectObject(that.currentSingleScene.scene, event, true).objectList
        const obj = objectList.filter(e => e.object.isMesh)[0]
        if (obj) {
          document.body.style.cursor = 'pointer'
          if (obj.object.parent.name === '区块') {
            clearHover()
            setHover(obj.object)
          } else {
            clearHover()
          }
        } else {
          document.body.style.cursor = 'auto'
          clearHover()
        }
      },
      //
      controlsStart(event) {
        pageX0 = event.pageX || event.changedTouches[0].pageX
        pageY0 = event.pageY || event.changedTouches[0].pageY
      },
      //
      controlsEnd(event) {
        try {
          pageX1 = event.pageX || event.changedTouches[0].pageX
          pageY1 = event.pageY || event.changedTouches[0].pageY
          if ((Math.abs(pageX0 - pageX1) <= 3) && (Math.abs(pageY0 - pageY1) <= 3)) {
            evensObject.click_tab(event)
          }
        } catch (e) {
          //
        }
      }
    }

    that.el.addEventListener('mousemove', e => evensObject.move(e))
    that.el.addEventListener('mousedown', e => evensObject.controlsStart(e))
    that.el.addEventListener('mouseup', e => evensObject.controlsEnd(e))

    that.el.addEventListener('touchstart', e => evensObject.controlsStart(e))
    that.el.addEventListener('touchend', e => evensObject.controlsEnd(e))

    function clearHover() {
      if (currentHover) {
        if (currentHover.userData.rootMaterial) {
          currentHover.material[0] = currentHover.userData.rootMaterial
        } else {
          currentHover.material[0].color = currentHover.material[0].userData.rootColor
        }
      }
    }
    function setHover(object) {
      currentHover = object
      if (currentHover.userData.rootMaterial) {
        currentHover.material[0] = currentHover.userData.hoverMaterial
      } else {
        currentHover.material[0].color = hoverColor
      }
    }
  }

  handleSceneAClick(object) {
    if (!object.userData.adcode) return
    this.allowGoDown = false
    this._this.showLoading = true
    getProvinceGeo({
      number: object.userData.adcode
    }).then(res => {
      this.sceneBInstance.update(res)
      this.transition.update(this.currentSingleScene, this.sceneB, true)
      // 过度效果之后 防可重新点击和和赋值
      this.bloomPass.strength = 0.0
      this.changeOverFun = () => {
        this.currentSingleScene = this.sceneB
        this.composer.renderScene.camera = this.sceneB.camera
        this.composer.renderScene.scene = this.sceneB.scene
        this.allowGoDown = true
        this._this.showBack = true
        this.level = 1
        this.changeStrength(0.3)
        this._this.showLoading = false
      }
    })
  }
  handleSceneBClick(object) {
    if (!object.userData.adcode) return
    this.allowGoDown = false
    this._this.showLoading = true
    getCityGeo({
      number: object.userData.adcode
    }).then(res => {
      this.sceneCInstance.update(res)
      this.transition.update(this.currentSingleScene, this.sceneC, true)
      // 过度效果之后 防可重新点击和和赋值
      this.bloomPass.strength = 0.0
      this.changeOverFun = () => {
        this.currentSingleScene = this.sceneC
        this.composer.renderScene.camera = this.sceneC.camera
        this.composer.renderScene.scene = this.sceneC.scene
        this.allowGoDown = true
        this._this.showBack = true
        this.level = 2
        this.changeStrength(0.3)
        this._this.showLoading = false
      }
    })
  }
  handleSceneCClick(object) {
    //
    this._this.$message('抱歉不再支持下钻，若有需要，请联作者！')
  }

  changeStrength(strength) {
    const that = this
    this.app.createTween({
      startObject: {
        o: 0
      },
      endObject: {
        o: strength
      },
      duration: 1000,
      update(object) {
        that.bloomPass.strength = object.o
      }
    })
  }

  toLastLevel() {
    if (this.level === 0) {
      this._this.showBack = false
      return
    } else if (this.level === 1) { // 到地球
      //
      this.allowGoDown = false
      this.transition.update(this.currentSingleScene, this.sceneA, true)
      this.sceneAInstance.initFly()
      // 过度效果之后 防可重新点击和和赋值
      this.bloomPass.strength = 0.0
      this.changeOverFun = () => {
        this.currentSingleScene = this.sceneA
        this.composer.renderScene.camera = this.sceneA.camera
        this.composer.renderScene.scene = this.sceneA.scene
        this.allowGoDown = true
        this._this.showBack = false
        this.level = 0
        this.changeStrength(0.1)
      }
    } else if (this.level === 2) { // 到省份
      //
      this.allowGoDown = false
      this.transition.update(this.currentSingleScene, this.sceneB, true)
      this.sceneBInstance.initFly()
      // 过度效果之后 防可重新点击和和赋值
      this.bloomPass.strength = 0.0
      this.changeOverFun = () => {
        this.currentSingleScene = this.sceneB
        this.composer.renderScene.camera = this.sceneB.camera
        this.composer.renderScene.scene = this.sceneB.scene
        this.allowGoDown = true
        this._this.showBack = true
        this.level = 1
        this.changeStrength(0.3)
      }
    }
  }
}

export default YsDemo
