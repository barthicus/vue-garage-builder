<template>
  <div class="dimensions">
    <section class="dimensions__form form">
      <h2 class="form__title">{{ $t('Wymiary') }}</h2>
      <div class="dimensions__width">
        <h3 class="form__subtitle">{{ $t('Szerokość') }}</h3>
        <label class="radio" v-for="(widthValue, index) in widthValuesList" :key="index">
          <input type="radio" v-bind:value="widthValue" v-model="width">
          <span>{{ widthValue }}m</span>
        </label>
      </div>
      <div class="dimensions__length">
        <h3 class="form__subtitle">{{ $t('Długość') }}</h3>
        <label class="radio" v-for="(lengthValue, index) in lengthValuesList" :key="index">
          <input type="radio" v-bind:value="lengthValue" v-model="length">
          <span>{{ lengthValue }}m</span>
        </label>
      </div>
    </section>
    <div class="dimensions__toggle">
      <button class="button is-small" @click.prevent="toggleOptionsVisibility" v-html="allOptionsToogleText"></button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      areAllOptionsVisible: false
    }
  },
  methods: {
    toggleOptionsVisibility () {
      this.areAllOptionsVisible = !this.areAllOptionsVisible
    }
  },
  computed: {
    ...mapGetters({
      garage: 'garage'
    }),
    allOptionsToogleText () {
      return this.areAllOptionsVisible ? this.$t('pokaż mniej opcji') : this.$t('pokaż więcej opcji')
    },
    widthValuesList () {
      let list = []
      let maxValue = this.areAllOptionsVisible ? 16 : 7
      for (let i = 2; i <= maxValue; i += 0.5) list.push(i)
      return list
    },
    lengthValuesList () {
      let list = []
      let maxValue = this.areAllOptionsVisible ? (this.$isPanel ? 16 : 9) : 7
      for (let i = 2; i <= maxValue; i += 0.5) list.push(i)
      return list
    },
    canHaveTwoGates () {
      return this.garage.width > 5.5
    },
    canHaveThreeGates () {
      return this.garage.width > 8.5
    },
    width: {
      get () {
        return this.garage.width
      },
      set (value) {
        this.$store.dispatch('changeGarage', { property: 'width', value })
        this.$bus.$emit('DIMENSIONS:change')
      }
    },
    length: {
      get () {
        return this.garage.length
      },
      set (value) {
        this.$store.dispatch('changeGarage', { property: 'length', value })
        this.$bus.$emit('DIMENSIONS:change')
      }
    }
  },
  created () {
    this.areAllOptionsVisible = this.garage && (this.garage.width > 7 || this.garage.length > 7)
  }
}
</script>

<style lang="scss">
.dimensions {
  &__form {
    display: flex;
    flex-wrap: wrap;
  }
  &__toggle {
    margin-top: 20px;
  }
  &__width, &__length {
    width: 50%;
  }
}
</style>
