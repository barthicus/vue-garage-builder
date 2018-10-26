import Dimensions from '@/components/Forms/Dimensions.vue'
import Gates from '@/components/Forms/Gates.vue'

const components = {
  Dimensions,
  Gates
}

// order is important, it impact the component load order in form navigation
const list = [
  'Dimensions',
  'Gates'
]

export { components, list }
