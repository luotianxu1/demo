<template>
	<div id="map" ref="map"></div>
</template>
<script setup lang="ts">
import type { LatLngExpression } from "leaflet"
import * as L from "leaflet"

let map: L.Map | null = null
onMounted(() => {
	map = L.map("map")
	let videoUrls = [
		"https://www.mapbox.com/bites/00188/patricia_nasa.webm",
		"https://www.mapbox.com/bites/00188/patricia_nasa.mp4"
	]
	let errorOverlayUrl = "https://cdn-icons-png.flaticon.com/512/110/110686.png"
	let latLngBounds = L.latLngBounds([
		[32, -130],
		[13, -100]
	])

	let videoOverlay = L.videoOverlay(videoUrls, latLngBounds, {
		opacity: 0.8,
		errorOverlayUrl: errorOverlayUrl,
		interactive: true,
		autoplay: true,
		muted: true,
		playsInline: true
	}).addTo(map)
	const center_point: LatLngExpression = [32, -130]
	map.setView(center_point, 4)

	videoOverlay.on("load", function () {
		let MyPauseControl = L.Control.extend({
			onAdd: function () {
				let button = L.DomUtil.create("button")
				button.title = "Pause"
				button.innerHTML = '<span aria-hidden="true">⏸</span>'
				L.DomEvent.on(button, "click", function () {
					videoOverlay.getElement()!.pause()
				})
				return button
			}
		})
		let MyPlayControl = L.Control.extend({
			onAdd: function () {
				let button = L.DomUtil.create("button")
				button.title = "Play"
				button.innerHTML = '<span aria-hidden="true">▶️</span>'
				L.DomEvent.on(button, "click", function () {
					videoOverlay.getElement()!.play()
				})
				return button
			}
		})

		let pauseControl = new MyPauseControl().addTo(map!)
		let playControl = new MyPlayControl().addTo(map!)
	})
})
</script>
<style lang="scss" scoped>
#map {
	width: 100%;
	height: 100%;
}
</style>
