<template>
  <div>
    <!-- <h1>Preview</h1> -->
    <div class="preview"></div>

    <script type="x-shader/x-vertex" id="vertexShader">
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    </script>
    <script type="x-shader/x-fragment" id="fragmentShader">
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + offset).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }
    </script>

    <SceneHelpers
      :ambientLight="ambientLight"
      :spotLight="mainLight"
      :scene="scene"/>
  </div>
</template>

<script>
import OrbitControls from '@/libs/OrbitControls'
import GarageBuilder from '@/libs/GarageBuilder'
import { mapGetters } from 'vuex'
import { garage as garageDefaults, gate as gateDefaults, heights as garageHeights } from '@/defaults'
import { createGrassTufts, getSizeOfObject } from '@/libs/helpers'
import SceneHelpers from '@/components/SceneHelpers'
import {
  Scene,
  AmbientLight,
  PointLight,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  Fog,
  SpotLight,
  SphereGeometry,
  Color,
  RepeatWrapping,
  TextureLoader,
  DoubleSide,
  BackSide,
  ShaderMaterial,
  MeshStandardMaterial,
  PlaneBufferGeometry,
  PCFSoftShadowMap,
  Object3D,
  Vector3 } from 'three'

export default {
  name: 'Preview',
  components: {
    SceneHelpers
  },
  data () {
    return {
      ambientLight: null,
      mainLight: null,
      scene: null
    }
  },
  computed: {
    ...mapGetters({
      garage: 'garage'
    })
  },
  methods: {
    initRenderer () {
      this.renderer = new WebGLRenderer({ antialias: true, clearColor: 0xff0000, alpha: true, preserveDrawingBuffer: true })
      this.renderer.setPixelRatio(window.devicePixelRatio)
      this.renderer.setSize(this.sceneWidth, this.sceneHeight)
      this.renderer.gammaInput = true
      this.renderer.gammaOutput = true
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = PCFSoftShadowMap

      this.domElement = document.querySelector('.preview')
      this.domElement.appendChild(this.renderer.domElement)
    },
    animate () {
      this.renderer.render(this.scene, this.camera)
      window.requestAnimationFrame(this.animate)
    },
    addLights () {
      // this.ambientLight = new AmbientLight(0xffffff, 2)
      this.ambientLight = new AmbientLight(0xffffff, 1)
      this.scene.add(this.ambientLight)
      this.ambientIntensity = this.ambientLight.intensity

      /*
       *  Światło główne - przód
       */
      this.mainLight = new SpotLight(0xf9d1a1)
      this.mainLight.name = 'mainLight'
      // this.mainLight.position.set(-400, 400, 30)
      this.mainLight.position.set(-200, 300, 300)
      // mainLight.position.set(0, 500, 0)
      this.mainLight.castShadow = true
      this.mainLight.shadow.mapSize.width = 1024
      this.mainLight.shadow.mapSize.height = 1024

      this.mainLight.shadow.camera.near = 10
      this.mainLight.shadow.camera.far = 1500
      // this.mainLight.shadow.camera.fov = 400
      this.mainLight.angle = 1.5
      this.mainLight.penumbra = 0.8
      this.mainLight.decay = 1
      this.mainLight.distance = 1500
      // this.mainLight.intensity = 1.5
      this.mainLight.intensity = 3
      this.scene.add(this.mainLight)

      /*
       *  Światło pomocnicze - bok
       */
      const sideLight = new PointLight(0xaabbff, 1.3)
      sideLight.name = 'sideLight'
      sideLight.position.x = 1300
      sideLight.position.y = 500
      sideLight.position.z = 0
      this.scene.add(sideLight)

      /*
       *  Niebo
       */
      let skyGeo = new SphereGeometry(8000, 32, 15)
      let uniforms = {
        topColor: { type: 'c', value: new Color(0x0077ff) },
        bottomColor: { type: 'c', value: new Color(0xffffff) },
        offset: { type: 'f', value: 400 },
        exponent: { type: 'f', value: 0.6 }
      }
      let vertexShader = document.getElementById('vertexShader').textContent
      let fragmentShader = document.getElementById('fragmentShader').textContent
      let skyMat = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: BackSide
      })
      let sky = new Mesh(skyGeo, skyMat)
      sky.name = 'sky'
      this.scene.add(sky)
    },
    addFloor () {
      const brickTexture = new TextureLoader().load('img/kostka.jpg')
      brickTexture.wrapS = brickTexture.wrapT = RepeatWrapping
      brickTexture.repeat.set(9, 75)
      brickTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
      const brickMaterial = new MeshStandardMaterial({ color: '#ffffff', map: brickTexture, roughness: 0.9, metalness: 0, side: DoubleSide })
      const brickGeometry = new PlaneBufferGeometry(300, 2500)
      this.brick = new Mesh(brickGeometry, brickMaterial)
      this.brick.position.set(0, 1, 1250)
      this.brick.rotation.x = -Math.PI / 2
      this.brick.position.z = (2500 - getSizeOfObject(this.garage3d).z) / 2
      this.brick.name = 'brick'
      this.brick.receiveShadow = true
      this.scene.add(this.brick)

      const grassTexture = new TextureLoader().load('img/grasslight-small.jpg')
      grassTexture.wrapS = grassTexture.wrapT = RepeatWrapping
      grassTexture.repeat.set(10, 10)
      grassTexture.anisotropy = this.renderer.capabilities.getMaxAnisotropy()
      const grassFloorMaterial = new MeshStandardMaterial({ color: '#ffffff', map: grassTexture, roughness: 0.9, metalness: 0, side: DoubleSide })
      const grassFloorGeometry = new PlaneBufferGeometry(10000, 10000)
      const grassFloor = new Mesh(grassFloorGeometry, grassFloorMaterial)
      grassFloor.position.set(0, 0, 0)
      grassFloor.rotation.x = -Math.PI / 2
      grassFloor.name = 'grassFloor'
      grassFloor.receiveShadow = true
      this.scene.add(grassFloor)

      var nTufts = 5000
      var positions = new Array(nTufts)
      for (var i = 0; i < nTufts; i++) {
        var position = new Vector3()
        position.x = (Math.random() - 0.5) * 2000
        position.z = (Math.random() - 0.5) * 2000
        positions[i] = position
      }
      const grass = createGrassTufts(positions)
      grass.position.set(0, 10, 0)
      // this.scene.add(grass)
    },
    changeBrickFloor () {
      const currentGarageWidth = getSizeOfObject(this.garage3d).x
      const currentGarageLength = getSizeOfObject(this.garage3d).z
      this.brick.geometry = new PlaneBufferGeometry(currentGarageWidth, 2500)
      this.brick.material.map.repeat.set(3 * currentGarageWidth / 100, 75)
      this.brick.position.z = (2500 - currentGarageLength) / 2
    },
    setFog () {
      this.scene.fog = new Fog('#ffffff', 1000, 10000)
    },
    initOrbitControls () {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    },
    initCamera () {
      this.camera = new PerspectiveCamera(45, this.sceneWidth / this.sceneHeight, 2, 10000)
      this.camera.position.set(this.cameraStartPosition[0], this.cameraStartPosition[1], this.cameraStartPosition[2])
    },
    addGarage (textures, allHeights) {
      this.builder = new GarageBuilder(textures, allHeights)
      this.base = this.builder.createBase(this.garage)

      this.roof = this.builder.createRoof()
      this.gates = this.builder.createGates()

      this.garage3d = new Object3D()
      this.garage3d.name = 'garage'

      this.garage3d.add(this.base)
      this.garage3d.add(this.roof)
      this.garage3d.add(this.gates)

      this.scene.add(this.garage3d)
    },
    changeBase () {
      this.garage3d.remove(this.base)
      this.base = this.builder.createBase(this.garage)
      this.garage3d.add(this.base)
    },
    changeRoof () {
      this.garage3d.remove(this.roof)
      this.roof = this.builder.createRoof()
      this.garage3d.add(this.roof)
    },
    changeGates () {
      this.garage3d.remove(this.gates)
      this.gates = this.builder.createGates()
      this.garage3d.add(this.gates)
    },
    setDefaultSceneSettings () {
      this.cameraStartPosition = [50, 250, 1000]
      this.initialSceneWidth = 470
      // this.initialSceneWidth = this.$el.offsetWidth
      this.initialSceneHeight = 600
      // this.initialSceneHeight = this.initialSceneWidth * 3 / 4
      this.sceneWidth = this.initialSceneWidth
      this.sceneHeight = this.initialSceneHeight
    }
  },
  created () {
    this.$bus.$on('DIMENSIONS:change', () => {
      this.changeBase()
      this.changeRoof()
      this.changeGates()
      this.changeBrickFloor()
    })
    this.$bus.$on('GATES:change', () => {
      this.changeGates()
    })
  },
  mounted () {
    this.scene = new Scene()

    this.setDefaultSceneSettings()
    this.initRenderer()
    this.initCamera()
    this.initOrbitControls()
    this.addLights()
    this.setFog()

    garageDefaults.gates.first = gateDefaults.twoSided
    garageDefaults.gates.second = gateDefaults.twoSided
    garageDefaults.gates.third = gateDefaults.twoSided
    this.$store.dispatch('initGarage', garageDefaults)

    this.addGarage(null, garageHeights)
    this.addFloor()

    this.animate()
  }
}
</script>
