<template>
    <v-app-bar app dense color="indigo darken-2">
        <v-app-bar-nav-icon @click="openMobileDrawer()" v-if="$vuetify.breakpoint.width < 600" color="white"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        <v-spacer></v-spacer>
        <v-tooltip left>
          <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on" icon @click="logout()"><v-icon color="white">logout</v-icon></v-btn>
          </template>
          <span>Sair</span>
        </v-tooltip>
    </v-app-bar>
</template>

<script>
  export default {
    name: 'AppBar',

    props: {
      title: String  
    },

    created() {
      this.$root.$refs.AppBar = this;
    },

    data: () => ({
      loading: false
    }),

    methods: {
        logout: function logout() { 
            let promise = this.$gAuth.signOut();
            promise.then(() => {
            sessionStorage.clear();
            location.reload();
            });
        },
        showLoading: function showLoading() { this.loading = true; },
        hideLoading: function hideLoading() { this.loading = false; },
        openMobileDrawer: function openMobileDrawer() { this.$root.$refs.NavDrawer.drawerMobile = true; }
    }
  }
</script>

<style>
    .v-toolbar__title { color: white; }
</style>