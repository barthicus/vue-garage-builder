<template>
  <div class="container">
    <h1 class="title">Vue.js Garage Builder</h1>
    <p class="subtitle">Repo for this project can be found <a href="https://github.com/barthicus/vue-garage-builder">here</a>.</p>
    <div class="main">
      <nav class="main__nav menu">
        <h2 class="menu-label">{{ $t('Opcje do wyboru') }}:</h2>
        <ul class="menu-list">
          <li>
            <a href="" :class="{'is-active': currentSection === 'Dimensions'}" @click.prevent="selectSection('Dimensions')">{{ $t('szerokość i długość') }}</a>
          </li>
          <li>
            <a href="" :class="{'is-active': currentSection === 'Gates'}" @click.prevent="selectSection('Gates')">{{ $t('bramy') }}</a>
          </li>
        </ul>
        <div class="main__bottomnav level">
          <div class="level-left">
            <button class="button is-small" @click="selectPrevSection" :disabled="isPrevBtnDisabled">← {{ $t('Poprzedni') }}</button>
          </div>
          <div class="level-right">
            <button class="button is-small" @click="selectNextSection" :disabled="isNextBtnDisabled">{{ $t('Następny') }} →</button>
          </div>
        </div>
      </nav>
      <component :is="currentSection" class="main__form"></component>
      <Preview class="main__preview"/>
    </div>
  </div>
</template>

<script>
import { components as FormsComponents } from '@/components/Forms'
import Preview from '@/components/Preview.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'App',
  components: {
    ...FormsComponents,
    Preview
  },
  computed: {
    ...mapGetters({
      currentSection: 'currentSection',
      sectionsList: 'sectionsList',
      isPrevBtnDisabled: 'isPrevBtnDisabled',
      isNextBtnDisabled: 'isNextBtnDisabled'
    })
  },
  methods: {
    selectPrevSection () {
      this.$store.dispatch('selectPrevSection')
    },
    selectNextSection () {
      this.$store.dispatch('selectNextSection')
    },
    selectSection (section) {
      if (section === this.currentSection) return
      this.$store.dispatch('selectSection', section)
    }
  }
}
</script>

<style lang="scss">
.title {
  margin-top: 20px;
}
.main {
  display: flex;
  justify-content: space-between;
  margin: 30px auto;
  background-color: #f5f5f5;
  border: 2px solid #f5f5f5;
  > * {
    padding: 20px;
    flex-grow: 1;
  }
  &__nav {
    width: 250px;
    background-color: #fff;
    flex-shrink: 0;
  }
  &__bottomnav {
    margin-top: 30px;
  }
  &__form {
    width: 100%;
  }
  &__preview {
    padding: 5px;
  }
  .form {
    &__title {
      width: 100%;
      background-color: #ddd;
      margin-bottom: 20px;
      padding: 10px;
      text-transform: uppercase;
    }
    &__subtitle {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 10px;
      input[type="radio"] {
        margin-right: 5px;
      }
    }
    .radio + .radio {
      margin-left: 0;
    }
  }
}
</style>
