<template>
  <div class="SheetPicker">
    <h3>{{ title }}</h3>
    <button @click.prevent="cancel" class="btn sm">{{ $t('Anuluj') }}</button>
    <div class="section">
      <h4>{{ $t('Blacha') }} <b>{{ $t('ocynkowana') }}</b></h4>
      <fieldset>
        <label v-for="(galvanizedSheet, index) in sheets.galvanized" :class="{ active: sheet.value === galvanizedSheet.value }" :key="index">
          <span class="SheetPicker__Tester" :data-sheet-name="galvanizedSheet.name" :style="getSheetStyle(galvanizedSheet)"></span>
          <input type="radio" :value="galvanizedSheet.value" :checked="sheet.value === galvanizedSheet.value" @change="change(galvanizedSheet, 'galvanized')">
          <span class="SheetPicker__Name">{{ galvanizedSheet.name }}</span>
        </label>
      </fieldset>
    </div>
    <div :class="{ section: true, 'SheetPicker__NotAvailable': part === 'roof' }">
      <p v-show="part === 'roof'" class="SheetPicker__NotAvailable__Label">{{ $t('Kolory niedostępne dla dachu.') }}</p>
      <h4>{{ $t('Blacha') }} <b>{{ $t('drewnopodobna') }}</b></h4>
      <fieldset>
        <label v-for="(woodenSheet, index) in sheets.wooden" :class="{ active: sheet.value === woodenSheet.value }" :key="index">
          <span class="SheetPicker__Tester" :data-sheet-name="woodenSheet.name" :style="getSheetStyle(woodenSheet)"></span>
          <input type="radio" :value="woodenSheet.value" :checked="sheet.value === woodenSheet.value" @change="change(woodenSheet, 'wooden')" :disabled="part === 'roof'">
          <span class="SheetPicker__Name">{{ woodenSheet.name }}</span>
        </label>
      </fieldset>
    </div>
    <div class="section">
      <h4>{{ $t('Blacha') }} <b>{{ $t('akrylowa') }}</b></h4>
      <fieldset>
        <label v-for="(acrylicSheet, index) in sheets.acrylic" :class="{ active: sheet.value === acrylicSheet.value }" :key="index">
          <span class="SheetPicker__Tester" :data-sheet-name="acrylicSheet.name" :style="getSheetStyle(acrylicSheet)"></span>
          <input type="radio" :value="acrylicSheet.value" :checked="sheet.value === acrylicSheet.value" @change="change(acrylicSheet, 'acrylic')">
          <span class="SheetPicker__Name">{{ acrylicSheet.name }}</span>
        </label>
      </fieldset>
    </div>
  </div>
</template>

<script>
import { sheets } from '@/defaults'
import { cleanObject } from '@/libs/helpers'

export default {
  props: ['part', 'title', 'preselected'],
  data () {
    return {
      sheets,
      sheet: this.preselected ? this.preselected : cleanObject(sheets.galvanized[0])
    }
  },
  watch: {
    preselected () {
      this.sheet = this.preselected
    }
  },
  methods: {
    getSheetStyle (sheet) {
      // return sheet.type === 'wooden' ? `background: url('${sheet.thumb}') no-repeat;` : `background-color: ${sheet.hex};` // bugged
      return sheet.type !== 'wooden' ? `background-color: ${sheet.hex};` : ''
    },
    cancel () {
      this.$emit('cancel', this.part)
    },
    change (sheet, sheetType) {
      this.sheet = sheet
      this.sheet.type = sheetType
      this.$emit('select', { part: this.part, sheet: this.sheet, changedByUser: true })
    }
  },
  created () {
    this.$bus.$on('SHEET:change-all', sheet => {
      this.sheet = sheet
      this.$emit('select', { part: this.part, sheet: this.sheet, changedByUser: false })
    })
  }
}
</script>

<style>
  .SheetPicker fieldset {
    margin: 0;
    border: none;
    padding: 0; }
  .SheetPicker input[type="radio"], .SheetPicker__Tester, .SheetPicker__Name {
    display: block;
    margin: 0 auto !important; }
  .SheetPicker label {
    width: 80px;
    display: inline-block;
    padding: 5px;
    margin: 10px 3px;
    vertical-align: top; }
  .SheetPicker label:hover, .SheetPicker label:active, .SheetPicker label:focus {
    background-color: #bbb; }
  .SheetPicker label.active {
    background-color: #e8282f; }
  .SheetPicker__Name {
    text-align: center;
    font-size: 12px;
    line-height: 16px; }
  .SheetPicker__Tester {
    height: 80px;
    margin-bottom: 10px !important; }
  .SheetPicker__Tester[data-sheet-name="złoty dąb"] {
    background: url('/wp-content/themes/blaszak/assets/img/zloty_dab_thumb.jpg') no-repeat; }
  .SheetPicker__Tester[data-sheet-name="orzech"] {
    background: url('/wp-content/themes/blaszak/assets/img/orzech_thumb.jpg') no-repeat; }
  .SheetPicker__NotAvailable {
    border: 1px solid red; }
  .SheetPicker__NotAvailable__Label {
    color: red;
    font-weight: bold; }
  .SheetPicker__NotAvailable label:hover, .SheetPicker__NotAvailable label:active, .SheetPicker__NotAvailable label:focus {
    background: none;
    cursor: not-allowed; }
</style>
