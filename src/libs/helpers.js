import { Box3,
  MeshStandardMaterial,
  MeshPhongMaterial,
  Mesh,
  DoubleSide,
  FlatShading,
  TextureLoader,
  PlaneGeometry,
  // Geometry,
  Vector3,
  Matrix4,
  RepeatWrapping } from 'three'

function getWoodenTextures (sheets) {
  const promises = []
  sheets.forEach(sheet => {
    promises.push(new Promise((resolve, reject) => {
      new TextureLoader().load(sheet.texture.vertical, texture => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        resolve({ name: sheet.name, texture, perforation: 'vertical' })
      })
    }))

    promises.push(new Promise((resolve, reject) => {
      new TextureLoader().load(sheet.texture.horizontal, texture => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        resolve({ name: sheet.name, texture, perforation: 'horizontal' })
      })
    }))
  })
  return Promise.all(promises)
}

function getWoodenTexture (textures, materialName, perforationDirection) {
  console.log('getWoodenTexture', textures, materialName, perforationDirection)
  return textures.find(({ name, perforation }) => name === materialName && perforation === perforationDirection)
}

function getGarageMaterial (sheet, object, perforationDirection, textures) {
  if (!sheet || typeof sheet === 'string' || sheet.type !== 'wooden' || isObjectEmpty(sheet)) {
    if (!sheet || isObjectEmpty(sheet)) {
      sheet = {
        hex: '#8e8e8e'
      }
    }
    if (typeof sheet === 'string') {
      sheet = {
        hex: sheet
      }
    }

    let materialData = {
      color: sheet.hex,
      emissive: sheet.hex === '#faffff' ? '#969696' : '#000000',
      roughness: 0.45,
      metalness: 0.77,
      side: DoubleSide,
      flatShading: FlatShading
    }

    if (perforationDirection === 'horizontal' && sheet.type === 'acrylic' && object.name !== 'doorBase' && object.name !== 'flap' && object.name !== 'firstGateBase' && object.name !== 'secondGateBase' && object.name !== 'thirdGateBase') {
      materialData.normalMap = getNormalTexture()
    }

    return new MeshStandardMaterial(materialData)
  }

  if (sheet.type === 'wooden') {
    let widthAxis = getSizeOfObject(object).x > getSizeOfObject(object).z ? 'x' : 'z'
    let scale = 8
    // let scale = sheet.name === 'orzech' ? 15 : 8
    let w = getSizeOfObject(object)[widthAxis]
    let h = getSizeOfObject(object).y
    // let displacementTexture = getDisplacementTexture()
    // let texture = getWoodenTexture(textures, sheet.name, perforationDirection)
    console.log(perforationDirection)
    let texture = textures.find(({ name, perforation }) => name === sheet.name && perforation === perforationDirection).texture
    texture.repeat.set(w * scale / 2048, h * scale / 2048)

    let materialData = {
      map: texture,
      emissive: '#000000',
      roughness: 0.45,
      metalness: 0.77,
      side: DoubleSide,
      flatShading: FlatShading
      // wireframe: true
      // displacementMap: displacementTexture,
    }

    if (perforationDirection === 'horizontal' && object.name !== 'doorBase' && object.name !== 'flap' && object.name !== 'firstGateBase' && object.name !== 'secondGateBase' && object.name !== 'thirdGateBase') {
      materialData.normalMap = getNormalTexture()
    }

    return new MeshStandardMaterial(materialData)
  }
}

function getNormalTexture () {
  let texture = new TextureLoader().load('/wp-content/themes/blaszak/assets/img/normal-map-texture.jpg')
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping

  return texture
}

function isObjectEmpty (object) {
  return Object.keys(object).length === 0 && object.constructor === Object
}

function getSizeOfObject (object) {
  return new Box3().setFromObject(object).getSize(new Vector3())
}

function getDimsOfObject (object) {
  return new Box3().setFromObject(object)
}

function getGarageHeights (garage, allHeights) {
  let additionalHeight = getAdditionalHeight(garage)
  let singleGateIsUpAndOver = Number(garage.gates.num) === 1 && !isGateTwoSided(garage.gates.first.type)
  let oneGateOfMultiGatesIsUpAndOver = Number(garage.gates.num) === 2 && (!isGateTwoSided(garage.gates.first.type) || !isGateTwoSided(garage.gates.second.type))
  oneGateOfMultiGatesIsUpAndOver = Number(garage.gates.num) === 3 && (!isGateTwoSided(garage.gates.first.type) || !isGateTwoSided(garage.gates.second.type) || !isGateTwoSided(garage.gates.third.type))
  let gateType = singleGateIsUpAndOver || oneGateOfMultiGatesIsUpAndOver ? 'uchylna' : 'dwuskrzydłowa'
  let entryHeight = !isGateTwoSided(gateType) ? '1.9' : '2.00'
  // let fixedWidth = garage.width === 2.95 ? 3 : (garage.width === 5.9 ? 6 : garage.width)
  let roof = garage.roof.type === 'spad na lewo' || garage.roof.type === 'spad na prawo' ? 'spad na bok' : garage.roof.type
  let h1 = Number(allHeights[roof][gateType][entryHeight][garage.width].h1) + additionalHeight / 100
  let h2 = Number(allHeights[roof][gateType][entryHeight][garage.width].h2) + additionalHeight / 100

  return {
    // additionalHeight,
    h1,
    h2
  }
}

function getAdditionalHeight (garage) {
  let additionalHeight = 0
  let tempAdditionalHeight = 0

  if (isGateTwoSided(garage.gates.first.type) && garage.gates.first.entryHeight > 200) {
    if ((tempAdditionalHeight = garage.gates.first.entryHeight - 200) > additionalHeight) {
      additionalHeight = tempAdditionalHeight
    }
  }
  if (!isGateTwoSided(garage.gates.first.type) && garage.gates.first.entryHeight > 190) {
    if ((tempAdditionalHeight = garage.gates.first.entryHeight - 190) > additionalHeight) {
      additionalHeight = tempAdditionalHeight
    }
  }

  if (Number(garage.gates.num) > 1) {
    if (isGateTwoSided(garage.gates.second.type) && garage.gates.second.entryHeight > 200) {
      if ((tempAdditionalHeight = garage.gates.second.entryHeight - 200) > additionalHeight && additionalHeight < tempAdditionalHeight) {
        additionalHeight = tempAdditionalHeight
      }
    }
    if (!isGateTwoSided(garage.gates.second.type) && garage.gates.second.entryHeight > 190) {
      if ((tempAdditionalHeight = garage.gates.second.entryHeight - 190) > additionalHeight && additionalHeight < tempAdditionalHeight) {
        additionalHeight = tempAdditionalHeight
      }
    }
  }

  if (Number(garage.gates.num) > 2) {
    if (isGateTwoSided(garage.gates.third.type) && garage.gates.third.entryHeight > 200) {
      if ((tempAdditionalHeight = garage.gates.third.entryHeight - 200) > additionalHeight && additionalHeight < tempAdditionalHeight) {
        additionalHeight = tempAdditionalHeight
      }
    }
    if (!isGateTwoSided(garage.gates.third.type) && garage.gates.third.entryHeight > 190) {
      if ((tempAdditionalHeight = garage.gates.third.entryHeight - 190) > additionalHeight && additionalHeight < tempAdditionalHeight) {
        additionalHeight = tempAdditionalHeight
      }
    }
  }

  return additionalHeight
}

function prepareFormToGetHeightsData (garage) {
  let urlWidth = garage.width > 7 ? 7 : garage.width
  let urlLength = garage.length < 5 && garage.length < garage.width ? garage.width : garage.length
  urlLength = urlLength > 7 ? 7 : urlLength
  if (garage.roof.type === 'spad do tyłu' || garage.roof.type === 'spad do przodu') {
    urlWidth = garage.length < 5 && garage.length < garage.width ? garage.length : garage.width
    urlWidth = urlWidth > 7 ? 7 : urlWidth
    urlLength = garage.length
    urlLength = urlLength > 7 ? 7 : urlLength
  }
  if (garage.roof.type === 'dwuspadowy') {
    urlWidth = garage.width > 7 ? 7 : garage.width
    urlLength = urlWidth > garage.length ? urlWidth : garage.length
    urlLength = urlLength > 7 ? 7 : urlLength
    urlLength = urlLength > 7 ? 7 : urlLength
  }
  const formHeightsData = new window.FormData()
  formHeightsData.append('width', urlWidth)
  formHeightsData.append('length', urlLength)
  formHeightsData.append('action', 'heights')
  return formHeightsData
}

function isGateTwoSided (type) {
  return type === 'dwuskrzydłowa' || type === 'dwuskrzydłowa z zamkiem na wkładkę' || type === 'dwuskrzydłowa z zamkiem z klamką firmy KOWAL'
}

function setObjectValueByPath (obj, value, path) {
  var i
  path = path.split('.')
  for (i = 0; i < path.length - 1; i++) obj = obj[path[i]]

  obj[path[i]] = value
}

function createGrassTufts (positions) {
  // load the texture
  var textureUrl = 'img/grass01.png'
  var texture = new TextureLoader().load(textureUrl)
  // build the material
  var material = new MeshPhongMaterial({
    map: texture,
    color: 'grey',
    emissive: 'darkgreen',
    alphaTest: 0.7,
    side: DoubleSide
  })

  // create the initial geometry
  var geometry = new PlaneGeometry(40, 20)
  geometry.applyMatrix(new Matrix4().makeTranslation(0, geometry.parameters.height / 2, 0))

  // Tweat the normal for better lighting
  // - normals from http://http.developer.nvidia.com/GPUGems/gpugems_ch07.html
  // - normals inspired from http://simonschreibt.de/gat/airborn-trees/
  geometry.faces.forEach(function (face) {
    face.vertexNormals.forEach(function (normal) {
      normal.set(0.0, 1.0, 0.0).normalize()
    })
  })

  // create each tuft and merge their geometry for performance
  var mergedGeo = new PlaneGeometry(40, 20, 1, 1)
  // var mergedGeo = new Geometry()
  for (var i = 0; i < positions.length; i++) {
    var position = positions[i]
    var baseAngle = Math.PI * 2 * Math.random()

    var nPlanes = 2
    for (var j = 0; j < nPlanes; j++) {
      var angle = baseAngle + j * Math.PI / nPlanes

      // First plane
      var object3d = new Mesh(geometry, material)
      object3d.rotateY(angle)
      object3d.position.copy(position)
      object3d.updateMatrix()
      mergedGeo.merge(object3d.geometry, object3d.matrix)

      // The other side of the plane
      // - impossible to use side: THREE.BothSide as
      //   it would mess up the normals
      object3d = new Mesh(geometry, material)
      object3d.rotateY(angle + Math.PI)
      object3d.position.copy(position)
      object3d.updateMatrix()
      mergedGeo.merge(object3d.geometry, object3d.matrix)
    }
  }

  // create the mesh
  return new Mesh(mergedGeo, material)
}

export {
  getWoodenTexture,
  getWoodenTextures,
  getGarageMaterial,
  getNormalTexture,
  isObjectEmpty,
  getSizeOfObject,
  getDimsOfObject,
  getAdditionalHeight,
  getGarageHeights,
  prepareFormToGetHeightsData,
  isGateTwoSided,
  setObjectValueByPath,
  createGrassTufts
}
