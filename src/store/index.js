import Vue from 'vue'
import Vuex from 'vuex'
import Garage from '@/store/modules/Garage'
import Forms from '@/store/modules/Forms'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    Garage,
    Forms
  },
  strict: debug
})
