import Vue from 'vue'
import App from '@/App.vue'
import store from '@/store'
import VueI18n from 'vue-i18n'
import messages from '@/translations'

Vue.config.productionTip = false

// vue-i18 setup
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: document.querySelector('html').attributes.lang.value.substr(0, 2),
  messages
})

// event bus
Vue.prototype.$bus = new Vue()

new Vue({
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
