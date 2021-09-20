<template>
  <v-app>
    <div v-if="verifySession()">
      <AppBar :title="title"></AppBar>
      <NavDrawer></NavDrawer>
      <v-main>
        <router-view></router-view>
        <v-snackbar :timeout="5000" v-model="snackbar">
          {{ message }}
          <template v-slot:action="{ attrs }">
            <v-btn color="white" icon v-bind="attrs" @click="snackbar = false">
              <v-icon>close</v-icon>
            </v-btn>
          </template>
        </v-snackbar>
      </v-main>
    </div>
    <div v-if="!verifySession()">
      <LoginBtn></LoginBtn>
    </div>
  </v-app>
</template>

<script>
import AppBar from './components/subcomponents/AppBar'
import NavDrawer from './components/subcomponents/NavDrawer'
import LoginBtn from './components/subcomponents/LoginBtn'

export default {
  name: 'App',

  components: {
    AppBar,
    NavDrawer,
    LoginBtn
  },

  created() {
    this.$root.$refs.App = this;
  },

  data: () => ({
    title: 'Inicio',
    snackbar: false,
    message: '',
    permissao: null
  }),

  beforeMount() {
    if (sessionStorage.getItem('permissao') != null && sessionStorage.getItem('permissao') != undefined) {
      this.getPermissao(sessionStorage.getItem('permissao'));
    }
    document.title = "LabReport";
  },

  methods: {
    verifySession: function verifySession() {      
      let is_logged = sessionStorage.getItem('is_logged');
      if (!is_logged) {
        this.$gAuth.signOut();
        sessionStorage.clear();
        return false;
      } else { return true; }
    },
    openSnackbar: function openSnackbar(message) {
      this.snackbar = true;
      this.message = message;
    },
    getPermissao: function getPermissao(id) {
      this.$http.get('http://localhost:3000/permissoes/'+id)
      .then((result) => { 
          this.permissao = result.data;
      }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
    },
    verificarPermissao: function verificarPermissao(nome) {
      if (nome != null && this.permissao != null) {
        if (this.permissao.nome == nome) { return true; } else { return false; }
      } else { return false; }
    },
    verificarPermissaoInterna: function verificarPermissaoInterna(nome) {
      if (nome != null && this.permissao != null) {
        switch (nome) {
          case 'criar_usuarios': 
            return this.permissao.criar_usuarios;
          case 'cria_registro_publico':
            return this.permissao.cria_registro_publico;
          case 'cria_registro_privado':
            return this.permissao.cria_registro_privado;
        }
      }
    }
  }
};
</script>

<style>
  .theme--light.v-application { background-color: #eee !important; }
  .v-main { margin: 2.5rem !important; }
  .fab-btn {
    position: fixed !important;
    bottom: 1.5em;
    right: 1.5em;
    z-index: 100;
  }
</style>