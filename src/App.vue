<template>
  <div id="app" class="page-wrapper">

    <navbar />

    <router-view />

  </div>
</template>

<script>

import Navbar from '@/components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },
};

</script>

<style lang="scss">
@import "~@/style/variables";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #f8f8fc;
}

#app.page-wrapper {
  padding-top: $navbar-height;
  min-height: 100vh;
  min-width: 100%;
}

.card-shadow {
  box-shadow: 0 .15rem 1.75rem 0 rgba(58,59,69,.15) !important;
}
</style>
