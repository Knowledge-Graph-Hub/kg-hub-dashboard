<template>
    <div v-if="active">
      <slot/>
    </div>
  </template>
  
<script>
  export default {
    name: 'DropdownContent',
    inject: ['sharedState'],
    computed: {
      active () {
        return this.sharedState.active
      }
    }
  }
</script>