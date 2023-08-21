<template>
	<div id="map"></div>
</template>

<script lang="ts" setup>
import Feature from "ol/Feature.js"
import Map from "ol/Map.js"
import Point from "ol/geom/Point.js"
import Polyline from "ol/format/Polyline.js"
import VectorSource from "ol/source/Vector.js"
import View from "ol/View.js"
import XYZ from "ol/source/XYZ.js"
import { Circle as CircleStyle, Fill, Icon, Stroke, Style } from "ol/style.js"
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js"
import { getVectorContext } from "ol/render.js"
import { OSM } from "ol/source"

const polyLint = {
	routes: [
		{
			geometry:
				"hldhx@lnau`BCG_EaC??cFjAwDjF??uBlKMd@}@z@??aC^yk@z_@se@b[wFdE??wFfE}NfIoGxB_I\\gG}@eHoCyTmPqGaBaHOoD\\??yVrGotA|N??o[N_STiwAtEmHGeHcAkiA}^aMyBiHOkFNoI`CcVvM??gG^gF_@iJwC??eCcA]OoL}DwFyCaCgCcCwDcGwHsSoX??wI_EkUFmq@hBiOqBgTwS??iYse@gYq\\cp@ce@{vA}s@csJqaE}{@iRaqE{lBeRoIwd@_T{]_Ngn@{PmhEwaA{SeF_u@kQuyAw]wQeEgtAsZ}LiCarAkVwI}D??_}RcjEinPspDwSqCgs@sPua@_OkXaMeT_Nwk@ob@gV}TiYs[uTwXoNmT{Uyb@wNg]{Nqa@oDgNeJu_@_G}YsFw]kDuZyDmm@i_@uyIJe~@jCg|@nGiv@zUi_BfNqaAvIow@dEed@dCcf@r@qz@Egs@{Acu@mCum@yIey@gGig@cK_m@aSku@qRil@we@{mAeTej@}Tkz@cLgr@aHko@qOmcEaJw~C{w@kai@qBchBq@kmBS{kDnBscBnFu_Dbc@_~QHeU`IuyDrC_}@bByp@fCyoA?qMbD}{AIkeAgBk_A_A{UsDke@gFej@qH{o@qGgb@qH{`@mMgm@uQus@kL{_@yOmd@ymBgwE}x@ouBwtA__DuhEgaKuWct@gp@cnBii@mlBa_@}|Asj@qrCg^eaC}L{dAaJ_aAiOyjByH{nAuYu`GsAwXyn@ywMyOyqD{_@cfIcDe}@y@aeBJmwA`CkiAbFkhBlTgdDdPyiB`W}xDnSa}DbJyhCrXitAhT}x@bE}Z_@qW_Kwv@qKaaAiBgXvIm}A~JovAxCqW~WanB`XewBbK{_A`K}fBvAmi@xBycBeCauBoF}}@qJioAww@gjHaPopA_NurAyJku@uGmi@cDs[eRaiBkQstAsQkcByNmaCsK_uBcJgbEw@gkB_@ypEqDoqSm@eZcDwjBoGw`BoMegBaU_`Ce_@_uBqb@ytBwkFqiT_fAqfEwe@mfCka@_eC_UmlB}MmaBeWkkDeHwqAoX}~DcBsZmLcxBqOwqE_DkyAuJmrJ\\o~CfIewG|YibQxBssB?es@qGciA}RorAoVajA_nAodD{[y`AgPqp@mKwr@ms@umEaW{dAmb@umAw|@ojBwzDaaJsmBwbEgdCsrFqhAihDquAi`Fux@}_Dui@_eB_u@guCuyAuiHukA_lKszAu|OmaA{wKm}@clHs_A_rEahCssKo\\sgBsSglAqk@yvDcS_wAyTwpBmPc|BwZknFoFscB_GsaDiZmyMyLgtHgQonHqT{hKaPg}Dqq@m~Hym@c`EuiBudIabB{hF{pWifx@snAw`GkFyVqf@y~BkoAi}Lel@wtc@}`@oaXi_C}pZsi@eqGsSuqJ|Lqeb@e]kgPcaAu}SkDwzGhn@gjYh\\qlNZovJieBqja@ed@siO{[ol\\kCmjMe\\isHorCmec@uLebB}EqiBaCg}@m@qwHrT_vFps@kkI`uAszIrpHuzYxx@e{Crw@kpDhN{wBtQarDy@knFgP_yCu\\wyCwyA{kHo~@omEoYmoDaEcPiuAosDagD}rO{{AsyEihCayFilLaiUqm@_bAumFo}DgqA_uByi@swC~AkzDlhA}xEvcBa}Cxk@ql@`rAo|@~bBq{@``Bye@djDww@z_C_cAtn@ye@nfC_eC|gGahH~s@w}@``Fi~FpnAooC|u@wlEaEedRlYkrPvKerBfYs}Arg@m}AtrCkzElw@gjBbh@woBhR{gCwGkgCc[wtCuOapAcFoh@uBy[yBgr@c@iq@o@wvEv@sp@`FajBfCaq@fIipAdy@ewJlUc`ExGuaBdEmbBpBssArAuqBBg}@s@g{AkB{bBif@_bYmC}r@kDgm@sPq_BuJ_s@{X_{AsK_d@eM{d@wVgx@oWcu@??aDmOkNia@wFoSmDyMyCkPiBePwAob@XcQ|@oNdCoSfFwXhEmOnLi\\lbAulB`X_d@|k@au@bc@oc@bqC}{BhwDgcD`l@ed@??bL{G|a@eTje@oS~]cLr~Bgh@|b@}Jv}EieAlv@sPluD{z@nzA_]`|KchCtd@sPvb@wSb{@ko@f`RooQ~e[upZbuIolI|gFafFzu@iq@nMmJ|OeJn^{Qjh@yQhc@uJ~j@iGdd@kAp~BkBxO{@|QsAfYgEtYiGd]}Jpd@wRhVoNzNeK`j@ce@vgK}cJnSoSzQkVvUm^rSgc@`Uql@xIq\\vIgg@~kDyq[nIir@jNoq@xNwc@fYik@tk@su@neB}uBhqEesFjoGeyHtCoD|D}Ed|@ctAbIuOzqB_}D~NgY`\\um@v[gm@v{Cw`G`w@o{AdjAwzBh{C}`Gpp@ypAxn@}mAfz@{bBbNia@??jIab@`CuOlC}YnAcV`@_^m@aeB}@yk@YuTuBg^uCkZiGk\\yGeY}Lu_@oOsZiTe[uWi[sl@mo@soAauAsrBgzBqgAglAyd@ig@asAcyAklA}qAwHkGi{@s~@goAmsAyDeEirB_{B}IsJuEeFymAssAkdAmhAyTcVkFeEoKiH}l@kp@wg@sj@ku@ey@uh@kj@}EsFmG}Jk^_r@_f@m~@ym@yjA??a@cFd@kBrCgDbAUnAcBhAyAdk@et@??kF}D??OL"
		}
	]
}

onMounted(() => {
	initMap()
})

let map
const polyline = polyLint.routes[0].geometry
const route: any = new Polyline({
	factor: 1e6
}).readGeometry(polyline, {
	dataProjection: "EPSG:4326",
	featureProjection: "EPSG:3857"
})

const routeFeature = new Feature({
	type: "route",
	geometry: route
})
const startMarker = new Feature({
	type: "icon",
	geometry: new Point(route.getFirstCoordinate())
})
const endMarker = new Feature({
	type: "icon",
	geometry: new Point(route.getLastCoordinate())
})
const position = startMarker.getGeometry().clone()
const geoMarker = new Feature({
	type: "geoMarker",
	geometry: position
})

const styles = {
	route: new Style({
		stroke: new Stroke({
			width: 6,
			color: [237, 212, 0, 0.8]
		})
	}),
	icon: new Style({
		image: new Icon({
			anchor: [0.5, 1],
			src: "img/map/map-point.png"
		})
	}),
	geoMarker: new Style({
		image: new CircleStyle({
			radius: 7,
			fill: new Fill({ color: "black" }),
			stroke: new Stroke({
				color: "white",
				width: 2
			})
		})
	})
}

const vectorLayer = new VectorLayer({
	source: new VectorSource({
		features: [routeFeature, geoMarker, startMarker, endMarker]
	}),
	style: function (feature) {
		return styles[feature.get("type")]
	}
})

const initMap = () => {
	const center = [-5639523.95, -3501274.52]
	map = new Map({
		target: document.getElementById("map"),
		view: new View({
			center: center,
			zoom: 10,
			minZoom: 2,
			maxZoom: 19
		}),
		layers: [
			new TileLayer({
				source: new OSM()
			})
		]
	})

	map.addLayer(vectorLayer)
	startAnimation()
}

let animating = false
let distance = 0
let lastTime
function moveFeature(event) {
	const speed = 10
	const time = event.frameState.time
	const elapsedTime = time - lastTime
	distance = (distance + (speed * elapsedTime) / 1e6) % 2
	lastTime = time

	const currentCoordinate = route.getCoordinateAt(distance > 1 ? 2 - distance : distance)
	position.setCoordinates(currentCoordinate)
	const vectorContext = getVectorContext(event)
	vectorContext.setStyle(styles.geoMarker)
	vectorContext.drawGeometry(position)
	map.render()
}

function startAnimation() {
	animating = true
	lastTime = Date.now()
	vectorLayer.on("postrender", moveFeature)
	geoMarker.setGeometry(null)
}

function stopAnimation() {
	animating = false
	geoMarker.setGeometry(position)
	vectorLayer.un("postrender", moveFeature)
}
</script>

<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
