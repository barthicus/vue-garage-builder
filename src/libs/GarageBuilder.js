import { Object3D, PlaneGeometry, Mesh, Geometry, BoxGeometry, SphereGeometry } from 'three'
import { getGarageMaterial, getSizeOfObject, getDimsOfObject, getGarageHeights, isGateTwoSided } from '@/libs/helpers'
import { roofAngles } from '@/defaults'

class GarageBuilder {
  constructor (textures, allHeights) {
    this.oneDegree = Math.PI / 180
    this.textures = textures
    this.allHeights = allHeights
  }
  createBase (garageConfig) {
    let base
    let walls

    this.setGarageConfig(garageConfig)

    walls = this.createWalls()
    walls.name = 'walls'

    base = new Object3D()
    base.name = 'base'

    base.add(walls)

    return base
  }
  createWalls () {
    let walls = null
    let frontWall = null
    let rearWall = null
    let leftWall = null
    let rightWall = null
    let garageWidth = null // cm
    let garageLength = null // cm
    let frontWallTopEdge = null
    let rearWallTopEdge = null
    let leftWallTopEdge = null
    let rightWallTopEdge = null

    walls = new Object3D()

    let garageHeights = {
      h1: this.h1,
      h2: this.h2
    }

    garageWidth = this.garageConfig.width * 100
    garageLength = this.garageConfig.length * 100

    if (this.garageConfig.roof.type === 'spad do tyłu') {
      frontWallTopEdge = garageHeights.h1
      rearWallTopEdge = garageHeights.h2
      leftWallTopEdge = [garageHeights.h2, garageHeights.h1]
      rightWallTopEdge = [garageHeights.h1, garageHeights.h2]
    } else if (this.garageConfig.roof.type === 'spad do przodu') {
      frontWallTopEdge = garageHeights.h1
      rearWallTopEdge = garageHeights.h2
      leftWallTopEdge = [garageHeights.h2, garageHeights.h1]
      rightWallTopEdge = [garageHeights.h1, garageHeights.h2]
    } else if (this.garageConfig.roof.type === 'spad na lewo') {
      frontWallTopEdge = [garageHeights.h2, garageHeights.h1]
      rearWallTopEdge = [garageHeights.h1, garageHeights.h2]
      leftWallTopEdge = garageHeights.h2
      rightWallTopEdge = garageHeights.h1
    } else if (this.garageConfig.roof.type === 'spad na prawo') {
      frontWallTopEdge = [garageHeights.h1, garageHeights.h2]
      rearWallTopEdge = [garageHeights.h2, garageHeights.h1]
      leftWallTopEdge = garageHeights.h1
      rightWallTopEdge = garageHeights.h2
    } else if (this.garageConfig.roof.type === 'dwuspadowy') {
      frontWallTopEdge = [garageHeights.h2, garageHeights.h1, garageHeights.h2]
      rearWallTopEdge = frontWallTopEdge
      leftWallTopEdge = garageHeights.h2
      rightWallTopEdge = leftWallTopEdge
    }

    // front wall
    frontWall = this.createSheet(garageWidth, frontWallTopEdge, { perforateDirection: this.garageConfig.wallsPerforation })
    if (this.garageConfig.roof.type === 'spad do tyłu' || (this.garageConfig.wallsPerforation === 'horizontal' && this.garageConfig.roof.type === 'dwuspadowy')) {
      frontWall.position.y += Math.abs(garageHeights.h1 - garageHeights.h2) / 2
    }
    frontWall.position.z = garageLength / 2
    frontWall.name = 'frontWall'
    frontWall.material = getGarageMaterial(this.garageConfig.sheet.frontWall, frontWall, this.garageConfig.wallsPerforation, this.textures)
    walls.add(frontWall)

    // rear wall
    rearWall = this.createSheet(garageWidth, rearWallTopEdge, { flipSide: true, perforateDirection: this.garageConfig.wallsPerforation })
    if (this.garageConfig.roof.type === 'spad do przodu' || (this.garageConfig.wallsPerforation === 'horizontal' && this.garageConfig.roof.type === 'dwuspadowy')) {
      rearWall.position.y += Math.abs(garageHeights.h1 - garageHeights.h2) / 2
    }
    rearWall.position.z -= garageLength / 2
    rearWall.name = 'rearWall'
    rearWall.material = getGarageMaterial(this.garageConfig.sheet.rearWall, rearWall, this.garageConfig.wallsPerforation, this.textures)
    walls.add(rearWall)

    // left wall
    leftWall = this.createSheet(garageLength, leftWallTopEdge, { direction: 'vertical', flipSide: true, perforateDirection: this.garageConfig.wallsPerforation })
    if (this.garageConfig.roof.type === 'spad na prawo' || this.garageConfig.roof.type === 'spad do tyłu') {
      leftWall.position.y += Math.abs(garageHeights.h1 - garageHeights.h2) / 2
    }
    leftWall.position.x = -garageWidth / 2
    leftWall.name = 'leftWall'
    leftWall.material = getGarageMaterial(this.garageConfig.sheet.leftWall, leftWall, this.garageConfig.wallsPerforation, this.textures)
    walls.add(leftWall)

    // right wall
    rightWall = this.createSheet(garageLength, rightWallTopEdge, { direction: 'vertical', perforateDirection: this.garageConfig.wallsPerforation })
    if (this.garageConfig.roof.type === 'spad na lewo') {
      rightWall.position.y += Math.abs(garageHeights.h1 - garageHeights.h2) / 2
    }
    rightWall.position.x = garageWidth / 2
    rightWall.name = 'rightWall'
    rightWall.material = getGarageMaterial(this.garageConfig.sheet.rightWall, rightWall, this.garageConfig.wallsPerforation, this.textures)
    walls.add(rightWall)

    this.wallsSize = getSizeOfObject(walls)
    this.wallsDims = getDimsOfObject(walls)
    walls.position.y = this.wallsSize.y / 2 - Math.abs(garageHeights.h1 - garageHeights.h2) / 2

    return walls
  }
  createSheet (width, height, params) {
    if (width < 12) throw new Error(`Param 'width' has to be more than 12`)
    if (width % 2) {
      // console.warn(`Param 'width' can not by divided by 2. I add +1.`)
      width++
    }

    const defaultParams = {
      direction: 'horizontal',
      flipSide: false,
      perforateDirection: 'vertical',
      isTiling: false
    }
    const direction = params.hasOwnProperty('direction') ? params.direction : defaultParams.direction
    const flipSide = params.hasOwnProperty('flipSide') ? params.flipSide : defaultParams.flipSide
    const perforateDirection = params.hasOwnProperty('perforateDirection') ? params.perforateDirection : defaultParams.perforateDirection
    const isTiling = params.hasOwnProperty('isTiling') ? params.isTiling : defaultParams.isTiling
    const pHeight = 2 // perforation height
    const metalTileHeight = 35 // for tiled perforation

    const initialHeight = height.constructor === Array ? Math.min(...height) : height
    const metalTilesNum = Math.round(initialHeight / metalTileHeight * 2)
    const maxHeight = height.constructor === Array ? Math.max(...height) : height
    const widthSegments = perforateDirection === 'vertical' ? width - 1 : 1
    const heightSegments = perforateDirection === 'horizontal' ? maxHeight - 1 : 1
    const geometry = new PlaneGeometry(width, perforateDirection === 'vertical' ? initialHeight : maxHeight, widthSegments, heightSegments)

    // perforation proccess
    // PRZYKŁAD: dla tłoczenia pionowego blachy (perforateDirection: 'vertical') "plane" ma ustawiony jeden segment w poziomie,
    // czyli razem posiada tylko dwie boczne krawędzie - brak innych przecięć w poziomie,
    // natomiast w pionie jest tyle segmentów ile wynosi wysokość blachy, następnie następuje wytłaczanie,
    // czyli niektóre linie segmentu są przesuwane na osi Z
    // piksele są oznaczane od indeksu 0 od lewego dolnego rogu w kierunku na prawo (nie w górę)
    // perforowanie odbywa się w segmentach 12-pikselowych, aby utworzyć kształt trapezu: /¯¯\_
    const unit = perforateDirection === 'vertical' ? width : maxHeight
    for (let i = 0; i < unit; i++) {
      if (i === 0 || i === 1 || i === 2 || i % 12 === 0 || i % 12 === 1 || i % 12 === 2) continue
      const firstIndex = perforateDirection === 'vertical' ? i : 2 * i
      const lastIndex = perforateDirection === 'vertical' ? i + unit : 2 * i + 1
      const isThirdOrEleventh = ((i === 3) && (i % 12 === 3)) || ((i === 11) && (i % 12 === 11))
      const positionZ = isThirdOrEleventh ? pHeight / 2 : pHeight
      if (geometry.vertices.hasOwnProperty(firstIndex)) {
        geometry.vertices[firstIndex].z = positionZ
        geometry.vertices[lastIndex].z = positionZ
      }
    }

    // perforation proccess - roof metal tile (blachodachówka)
    if (isTiling) {
      // waves
      let prevVerticeX = geometry.vertices[0].x
      const verticesTransformations = [0, 1, 2, 2.1, 2.2, 2.2, 2.2, 2.1, 2, 1.6, 1, 1.4, 1, 0.6]
      let translateIndex = 0
      for (let i = width; i < metalTilesNum * width; i++) {
        translateIndex = geometry.vertices[i].x < prevVerticeX || translateIndex > 13 ? 0 : translateIndex
        geometry.vertices[i].z += verticesTransformations[translateIndex]
        translateIndex++
        prevVerticeX = geometry.vertices[i].x
      }
      // steps
      for (let i = 0; i < metalTilesNum * width; i++) {
        if (i / width % 2 < 1) { // is row odd
          geometry.vertices[i].z -= pHeight
        } else {
          geometry.vertices[i].y += metalTileHeight / 2 - 1
        }
      }
    }

    // setting vertices on edge to form roof shape
    if (height.constructor === Array && height.length === 2) {
      let roofHeight = Math.max(height[0], height[1]) - Math.min(height[0], height[1])
      let tgAlfa = roofHeight / (width / 2)
      if (perforateDirection === 'vertical') {
        for (let i = 0; i < width - 1; i++) {
          let b = height[0] < height[1] ? Math.abs(geometry.vertices[0].x) + geometry.vertices[i].x : width / 2 - geometry.vertices[i].x
          let tgAlfa = (Math.max(...height) - Math.min(...height)) / width
          let a = tgAlfa * b
          geometry.vertices[i].y += a
        }
      }
      if (perforateDirection === 'horizontal') {
        for (let i = 0; i < roofHeight * 2; i++) {
          let a = 0
          if (i === 0) a = roofHeight
          if (i % 2 > 0 && i > 0) a = roofHeight - i / 2 + 0.5
          if (i % 2 === 0 && i > 0) a = roofHeight - i / 2
          let b = a / tgAlfa
          geometry.vertices[i].x += i % 2 ? 0 : b * 2
        }
      }
    }
    if (height.constructor === Array && height.length === 3) {
      let roofHeight = Math.max(height[0], height[1]) - Math.min(height[0], height[1])
      let tgAlfa = roofHeight / (width / 2)

      if (perforateDirection === 'vertical') {
        for (let i = 0; i < width - 1; i++) {
          let b = i < width / 2 ? Math.abs(geometry.vertices[0].x) + geometry.vertices[i].x : width / 2 - geometry.vertices[i].x
          let a = tgAlfa * b
          geometry.vertices[i].y += a
        }
      }

      if (perforateDirection === 'horizontal') {
        for (let i = 0; i < roofHeight * 2; i++) {
          let a = 0
          if (i === 0) a = roofHeight
          if (i % 2 > 0 && i > 0) a = roofHeight - i / 2 + 0.5
          if (i % 2 === 0 && i > 0) a = roofHeight - i / 2
          let b = a / tgAlfa
          geometry.vertices[i].x += i % 2 ? -b : b
        }
      }
    }

    const sheet = new Mesh(geometry)

    sheet.castShadow = true
    sheet.receiveShadow = true

    // rotations, reversing
    if (flipSide) {
      if (direction === 'vertical') {
        sheet.rotation.y = -Math.PI / 2
      } else {
        sheet.rotation.y = Math.PI
      }
    } else {
      if (direction === 'vertical') {
        sheet.rotation.y = Math.PI / 2
      }
    }

    return sheet
  }
  createGates () {
    let gatesConfig = this.garageConfig.gates
    let gates = new Object3D()
    let gate = null

    if (Number(gatesConfig.num) === 1) {
      gate = this.createGate(gatesConfig.first, 'firstGateBase')
      gate.position.x = -1.5
      if (gatesConfig.first.position === 'lewa') gate.position.x = this.wallsDims.min.x + (getSizeOfObject(gate).x / 2)
      if (gatesConfig.first.position === 'prawa') gate.position.x = this.wallsDims.max.x - (getSizeOfObject(gate).x / 2)
      gate.position.y = getSizeOfObject(gate).y / 2
      gate.name = 'firstGate'
      gates = gate
    }

    if (Number(gatesConfig.num) === 2) {
      gate = this.createGate(gatesConfig.first, 'firstGateBase')
      gate.position.x = this.wallsDims.min.x + getSizeOfObject(gate).x / 2 + (this.wallsSize.x / 2 - getSizeOfObject(gate).x) / 2
      if (gatesConfig.first.position === 'lewa') gate.position.x = this.wallsDims.min.x + (getSizeOfObject(gate).x / 2)
      if (gatesConfig.first.position === 'prawa') gate.position.x = -(getSizeOfObject(gate).x / 2)
      gate.position.y = getSizeOfObject(gate).y / 2
      gate.position.z = 0
      gate.name = 'firstGate'
      gates.add(gate)

      gate = this.createGate(gatesConfig.second, 'secondGateBase')
      gate.position.x = getSizeOfObject(gate).x / 2 + (this.wallsSize.x / 2 - getSizeOfObject(gate).x) / 2
      if (gatesConfig.second.position === 'lewa') gate.position.x = getSizeOfObject(gate).x / 2
      if (gatesConfig.second.position === 'prawa') gate.position.x = this.wallsDims.max.x - (getSizeOfObject(gate).x / 2)
      gate.position.y = getSizeOfObject(gate).y / 2
      gate.position.z = 0
      gate.name = 'secondGate'
      gates.add(gate)
    }

    if (Number(gatesConfig.num) === 3) {
      gate = this.createGate(gatesConfig.first, 'firstGateBase')
      gate.position.x = this.wallsDims.min.x + getSizeOfObject(gate).x / 2 + (this.wallsSize.x / 3 - getSizeOfObject(gate).x) / 2
      if (gatesConfig.first.position === 'lewa') gate.position.x = this.wallsDims.min.x + (getSizeOfObject(gate).x / 2)
      if (gatesConfig.first.position === 'prawa') gate.position.x = this.wallsDims.min.x + (this.wallsSize.x / 3) - (getSizeOfObject(gate).x / 2)
      gate.position.y = getSizeOfObject(gate).y / 2
      gate.position.z = 0
      gate.name = 'firstGate'
      gates.add(gate)

      gate = this.createGate(gatesConfig.second, 'secondGateBase')
      gate.position.x = -1.5
      if (gatesConfig.second.position === 'lewa') gate.position.x = this.wallsDims.min.x + (this.wallsSize.x / 3) + (getSizeOfObject(gate).x / 2)
      if (gatesConfig.second.position === 'prawa') gate.position.x = this.wallsDims.min.x + (this.wallsSize.x * 2 / 3) - (getSizeOfObject(gate).x / 2)
      gate.position.y = getSizeOfObject(gate).y / 2
      gate.position.z = 0
      gate.name = 'secondGate'
      gates.add(gate)

      gate = this.createGate(gatesConfig.third, 'thirdGateBase')
      gate.position.x = this.wallsDims.min.x + (this.wallsSize.x * 2 / 3) + (getSizeOfObject(gate).x / 2) + (this.wallsSize.x / 3 - getSizeOfObject(gate).x) / 2
      if (gatesConfig.third.position === 'lewa') gate.position.x = this.wallsDims.min.x + (this.wallsSize.x * 2 / 3) + (getSizeOfObject(gate).x / 2)
      if (gatesConfig.third.position === 'prawa') gate.position.x = this.wallsDims.max.x - (getSizeOfObject(gate).x / 2)
      gate.position.y = getSizeOfObject(gate).y / 2
      gate.position.z = 0
      gate.name = 'thirdGate'
      gates.add(gate)
    }

    gates.position.y += 0.2
    gates.position.z = this.wallsSize.z / 2 + 1.1

    gates.name = 'gates'

    return gates
  }
  createGate (gateConfig, baseName) {
    let gate = new Object3D()
    let gateType = gateConfig.type
    let base = null
    let frame = null
    let middleFramePart = null
    let leftFramePart = null
    let rightFramePart = null
    let topFramePart = null
    let bottomFramePart = null
    let handle = null
    let handleBase = null
    let handleLink = null
    let handleHandler = null
    let gateHeight = gateConfig.entryHeight
    let gateWidth = this.garageConfig.width < 3 ? this.garageConfig.width * 100 - 5 : gateConfig.width // change gates widht for small garage

    // baza
    if (gateConfig.perforation === 'vertical') {
      base = this.createSheet(gateWidth, gateHeight, 'horizontal')
    } else {
      base = this.createSheet(gateHeight, gateWidth, 'horizontal')
      base.rotation.z += this.oneDegree * 90
    }
    base.name = baseName
    base.material = getGarageMaterial(this.garageConfig.sheet.gates, base, gateConfig.perforation)
    base.position.x += 3

    // uchwyty
    handle = new Geometry()

    handleBase = new Mesh(new BoxGeometry(4, isGateTwoSided(gateType) ? 20 : 15, 2))
    handleBase.position.x = 7
    handle.mergeMesh(handleBase)

    handleLink = new Mesh(new BoxGeometry(2, 2, 4))
    handleLink.position.z = 2
    handleLink.position.x = 7
    handleLink.position.y = 2
    handle.mergeMesh(handleLink)

    if (isGateTwoSided(gateType)) {
      handleHandler = new Mesh(new BoxGeometry(10, 2, 1))
      handleHandler.position.x = 11
    } else {
      handleHandler = new Mesh(new SphereGeometry(3, 20, 20))
      handleHandler.scale.set(2, 0.7, 0.3)
      handleHandler.position.x = 7
    }
    handleHandler.position.z = 4
    handleHandler.position.y = 2
    handle.mergeMesh(handleHandler)

    handle = new Mesh(handle, getGarageMaterial('#000'))
    handle.position.x = isGateTwoSided(gateType) ? 0 : -5
    handle.position.y = isGateTwoSided(gateType) ? -25 : -30
    handle.position.z = 3
    handle.name = 'gateHandle'

    // obramówka
    frame = new Geometry()

    middleFramePart = new Mesh(new BoxGeometry(3, gateHeight, 3))
    middleFramePart.position.x = 5

    leftFramePart = new Mesh(new BoxGeometry(3, gateHeight, 3))
    leftFramePart.position.x = -gateWidth / 2 + 4

    rightFramePart = new Mesh(new BoxGeometry(3, gateHeight, 3))
    rightFramePart.position.x = gateWidth / 2 + 6

    topFramePart = new Mesh(new BoxGeometry(gateWidth + 5, 3, 3))
    topFramePart.position.x = 5
    topFramePart.position.y = gateHeight / 2

    bottomFramePart = new Mesh(new BoxGeometry(gateWidth + 5, 3, 3))
    bottomFramePart.position.x = 5
    bottomFramePart.position.y = -gateHeight / 2

    if (isGateTwoSided(gateType)) {
      frame.mergeMesh(middleFramePart)
    }
    frame.mergeMesh(leftFramePart)
    frame.mergeMesh(rightFramePart)
    frame.mergeMesh(topFramePart)
    frame.mergeMesh(bottomFramePart)

    frame = new Mesh(frame, getGarageMaterial('#000000'))
    frame.position.z = 1
    frame.position.x = -1.68
    frame.name = 'gateFrame'

    // łączenie
    gate.add(base)
    gate.add(handle)
    gate.add(frame)

    return gate
  }
  createRoof () {
    let roof = null
    let partWidth = null
    let partLength = null
    let leftPart = null
    let rightPart = null
    let tempGeometry = null
    let roofSize = null

    roof = new Geometry()

    // roof building
    if (this.garageConfig.roof.type === 'dwuspadowy') {
      partWidth = (this.garageConfig.width / 2 * (this.garageConfig.width < 7 ? 100 : 97)) + 20 + (this.garageConfig.width - 3) * 1.5
      partLength = this.garageConfig.length * (this.garageConfig.length < 7 ? 100 : 99) + 20

      leftPart = this.createSheet(partLength, partWidth, 'horizontal', false, this.garageConfig.roof.isTiling)
      leftPart.rotation.y = Math.PI / 2

      tempGeometry = new Geometry()
      tempGeometry.mergeMesh(leftPart)

      leftPart = new Mesh(tempGeometry)
      leftPart.rotation.z = -(90 * this.oneDegree - this.oneDegree * roofAngles[this.garageConfig.width])
      leftPart.rotation.z += this.garageConfig.width > 3 ? (this.garageConfig.width - 3) * 0.014 : 0
      roof.mergeMesh(leftPart)

      rightPart = tempGeometry.clone()
      rightPart = new Mesh(rightPart)
      rightPart.rotation.z = 90 * this.oneDegree - this.oneDegree * roofAngles[this.garageConfig.width]
      rightPart.rotation.z -= this.garageConfig.width > 3 ? (this.garageConfig.width - 3) * 0.014 : 0
      rightPart.position.x = getSizeOfObject(rightPart).x - 1

      roof.mergeMesh(rightPart)
    }

    // roof position
    roof.center()
    roof = new Mesh(roof, getGarageMaterial(this.garageConfig.sheet.roof))

    roofSize = getSizeOfObject(roof)

    if (this.garageConfig.roof.type === 'dwuspadowy') {
      roof.position.y = roofSize.y / 2 + this.wallsSize.y - roofSize.y + 5
    }

    roof.name = 'roof'

    return roof
  }
  setGarageConfig (config) {
    this.garageConfig = config
    const heights = getGarageHeights(this.garageConfig, this.allHeights)
    this.h1 = heights.h1 * 100
    this.h2 = heights.h2 * 100
  }
}

export default GarageBuilder
