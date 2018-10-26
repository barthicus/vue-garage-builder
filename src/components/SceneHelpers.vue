<template>
  <div :class="['scene-helper', {'scene-helper--minimized': isMinimized}]">
    <div class="scene-helper__header">
      <h2 class="title">Przybornik</h2>
      <button class="button is-small" @click="isMinimized = !isMinimized">{{ isMinimized ? 'Pokaż' : 'Schowaj' }}</button>
    </div>
    <div class="scene-helper__controls" v-show="!isMinimized">
      <label class="label">
        Ambient intensity: [{{ ambientIntensity }}]
        <input class="slider" type="range" v-model="ambientIntensity" @input="ambientLight.intensity = ambientIntensity" min="0" max="5" step="0.1">
      </label>
      <label class="label">
        Fog near [{{ fogNear }}]:
        <input class="slider" type="range" v-model="fogNear" @input="scene.fog.near = fogNear" min="0" max="1000" step="1">
      </label>
      <label class="label">
        Fog far [{{ fogFar }}]:
        <input class="slider" type="range" v-model="fogFar" @input="scene.fog.far = fogFar" min="0" max="10000" step="1">
      </label>
      <label class="label">
        Spotlight angle: [{{ angle }}]
        <input class="slider" type="range" v-model="angle" @input="spotLight.angle = angle" min="0" max="1.56" step="0.01">
      </label>
      <label class="label">
        Spotlight penumbra: [{{ penumbra }}]
        <input class="slider" type="range" v-model="penumbra" @input="spotLight.penumbra = penumbra" min="0" max="2" step="0.1">
      </label>
      <label class="label">
        Spotlight decay: [{{ decay }}]
        <input class="slider" type="range" v-model="decay" @input="spotLight.decay = decay" min="0" max="2" step="0.1">
      </label>
      <label class="label">
        Spotlight distance: [{{ distance }}]
        <input class="slider" type="range" v-model="distance" @input="spotLight.distance = Number(distance)" min="1" max="10000" step="1">
      </label>
      <label class="label">
        Spotlight intensity: [{{ intensity }}]
        <input class="slider" type="range" v-model="intensity" @input="spotLight.intensity = intensity" min="0" max="50" step="0.1">
      </label>
    </div>
  </div>
</template>

<script>
import { SpotLightHelper, CameraHelper, AxesHelper } from 'three'

export default {
  name: 'LightsHelpers',
  props: [
    'spotLight',
    'ambientLight',
    'scene'
  ],
  data () {
    return {
      isMinimized: true,
      fogNear: null,
      fogFar: null,
      ambientIntensity: null,
      angle: null,
      penumbra: null,
      decay: null,
      distance: null,
      intensity: null
    }
  },
  watch: {
    isMinimized () {
      this.spotLightHelper.visible = !this.isMinimized
      this.shadowCameraHelper.visible = !this.isMinimized
      this.axesHelpers.visible = !this.isMinimized
    }
  },
  methods: {
    addHelpers () {
      // spotlight helper
      this.spotLightHelper = new SpotLightHelper(this.spotLight)
      this.spotLightHelper.visible = !this.isMinimized
      this.scene.add(this.spotLightHelper)

      this.near = this.spotLight.shadow.camera.near
      this.far = this.spotLight.shadow.camera.far
      this.fov = this.spotLight.shadow.camera.fov
      this.angle = this.spotLight.angle
      this.penumbra = this.spotLight.penumbra
      this.decay = this.spotLight.decay
      this.distance = this.spotLight.distance
      this.intensity = this.spotLight.intensity

      // shadow camera helper
      this.shadowCameraHelper = new CameraHelper(this.spotLight.shadow.camera)
      this.shadowCameraHelper.visible = !this.isMinimized
      this.scene.add(this.shadowCameraHelper)

      // scene axes
      this.axesHelpers = new AxesHelper(1000)
      this.axesHelpers.visible = !this.isMinimized
      this.scene.add(this.axesHelpers)

      // fog
      this.fogNear = this.scene.fog.near
      this.fogFar = this.scene.fog.far
    },
    animate () {
      window.requestAnimationFrame(this.animate)
      this.spotLightHelper.update()
      this.shadowCameraHelper.update()
    }
  },
  mounted () {
    this.$nextTick().then(() => {
      this.ambientIntensity = this.ambientLight.intensity
      this.addHelpers()
      this.animate()
    })
  }
}
</script>

<style lang="scss" scope>
.scene-helper {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #ccc;
  padding: 10px;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);

  &--minimized {
    position: fixed;
    bottom: 0;
    left: 0;
    right: auto;
    background-color: #ccc;
    padding: 10px;
    .header {
      margin-bottom: 0;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .title {
      margin: 0 10px 0 0;
      text-transform: uppercase;
      font-size: 14px;
    }
  }

  &__controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .label {
      flex: 1;
      flex-grow: 1;
      margin: 0 10px;
    }
    .slider {
      display: block;
      width: 100%;
    }
  }
}
</style>
