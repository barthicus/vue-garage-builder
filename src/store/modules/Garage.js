import { setObjectValueByPath, getAdditionalHeight } from '@/libs/helpers'

const state = {
  garage: {}
}

const getters = {
  garage: state => state.garage
}

const mutations = {
  INIT_GARAGE (state, { config }) {
    state.garage = config
  },
  CHANGE_GARAGE (state, { property, value }) {
    setObjectValueByPath(state.garage, value, property)
    state.garage.additionalHeight = getAdditionalHeight(state.garage)
    if (state.garage.gates.num > 2 && state.garage.width < 9) state.garage.gates.num--
    if (state.garage.gates.num > 1 && state.garage.width < 6) state.garage.gates.num--
  }
}

const actions = {
  initGarage ({ commit }, config) {
    commit('INIT_GARAGE', { config })
  },
  changeGarage ({ commit }, { property, value }) {
    commit('CHANGE_GARAGE', { property, value })
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
