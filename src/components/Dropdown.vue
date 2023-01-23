<template>
    <div @click="toggle">
      <slot name="toggler">
        <button>Toggle</button>
      </slot>
      <slot/>
    </div>
  </template>

<script>
  export default {
    name: 'Dropdown',
    provide () {
      return {
        sharedState: this.sharedState
      }
    },
    data () {
      return {
        sharedState: {
          active: false
        }
      }
    },
    methods: {
      toggle () {
        this.sharedState.active = !this.sharedState.active
      }
    }
  }
</script>