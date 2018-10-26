<template>
  <section class="gates">
    <div class="gates__form form">
      <h2 class="form__title">{{ $t('Bramy') }}</h2>
      <div class="gates__num">
        <h3 class="form__subtitle">{{ $t('Liczba bram') }}</h3>
        <div>
          <label class="radio">
            <input type="radio" :value="1" v-model="gatesNum">
            <span>{{ $t('jedna') }}</span>
          </label>
        </div>
        <div>
          <label class="radio">
            <input type="radio" :value="2" v-model="gatesNum" :disabled="!canHaveTwoGates">
            <span>{{ $t('dwie') }}</span>
            <small class="info-helper" v-show="garage.width < 6">{{ $t('Garaż jest zbyt mały na dwie bramy, proszę go poszerzyć.') }}</small>
          </label>
        </div>
        <div>
          <label class="radio">
            <input type="radio" :value="3" v-model="gatesNum" :disabled="!canHaveThreeGates">
            <span>{{ $t('trzy') }}</span>
            <small class="info-helper"  v-show="garage.width < 9">{{ $t('Garaż jest zbyt mały na trzy bramy, proszę go poszerzyć.') }}</small>
          </label>
        </div>

        <div class="gates__enlarge">
          <p>{{ $t('Aktualna szerokość garażu:') }} <b>{{ garage.width }}m</b></p>
          <button type="button" @click.prevent="enlargeGarage(2)" v-show="garage.width < 6" class="button is-small is-primary">{{ $t('poszerz do 6m') }}</button>
          <button type="button" @click.prevent="enlargeGarage(3)" v-show="garage.width < 9" class="button is-small is-primary">{{ $t('poszerz do 9m') }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      garage: 'garage'
    }),
    gatesNum: {
      get () {
        return this.garage.gates.num
      },
      set (value) {
        this.$store.dispatch('changeGarage', { property: 'gates.num', value })
        this.$bus.$emit('GATES:change')
      }
    },
    canHaveTwoGates () {
      return this.garage.width > 5.5
    },
    canHaveThreeGates () {
      return this.garage.width > 8.5
    }
  },
  methods: {
    enlargeGarage (slots) {
      let widthToSet = slots === 2 ? 6 : 9
      this.$store.dispatch('changeGarage', { property: 'width', value: widthToSet })
      this.$bus.$emit('DIMENSIONS:change')
    }
  }
}
</script>

<style lang="scss">
.gates {
  &__enlarge {
    margin-top: 30px;
    p {
      margin-bottom: 20px;
    }
    .button + .button {
      margin-left: 10px;
    }
  }
  .info-helper {
    padding-left: 20px;
    font-style: italic;
    display: block;
    color: #aaa;
  }
}
</style>
