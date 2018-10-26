import { list } from '@/components/Forms'

const state = {
  currentSection: list[0],
  sectionsList: list,
  isPrevBtnDisabled: true,
  isNextBtnDisabled: false
}

const getters = {
  currentSection: state => state.currentSection,
  list: state => state.sectionsList,
  isPrevBtnDisabled: state => state.isPrevBtnDisabled,
  isNextBtnDisabled: state => state.isNextBtnDisabled
}

const mutations = {
  SECTION_CHANGE (state, sectionIndex) {
    state.isPrevBtnDisabled = sectionIndex === 0
    state.isNextBtnDisabled = sectionIndex === (state.sectionsList.length - 1)
    state.currentSection = state.sectionsList[sectionIndex]
  }
}

const actions = {
  selectPrevSection ({ commit }) {
    const index = state.sectionsList.indexOf(state.currentSection) - 1
    commit('SECTION_CHANGE', index)
  },
  selectNextSection ({ commit }) {
    const index = state.sectionsList.indexOf(state.currentSection) + 1
    commit('SECTION_CHANGE', index)
  },
  selectSection ({ commit }, section) {
    const index = state.sectionsList.indexOf(section)
    commit('SECTION_CHANGE', index)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
