import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import axios  from 'axios'
import GAuth from 'vue-google-oauth2'
import VueRouter from 'vue-router'
import UsuariosPermitidos from './components/UsuariosPermitidos'
import Inventario from './components/Inventario'
import Feed from './components/Feed'
//import Pdf from './components/Pdf'
import Registros from './components/Registros'
import Disciplinas from './components/Disciplinas'
import TiposRegistro from './components/TiposRegistro'

const gauthOption = {
  clientId: '948828573511-es4juboke9kcrl19e67pfsg5dtorohd2.apps.googleusercontent.com',
  scope: 'profile email',
  prompt: 'select_account'
}

const router = new VueRouter({
  routes: [
    {path: '/', component: Registros},
    {path: '/usuarios', component: UsuariosPermitidos},
    {path: '/inventario', component: Inventario},
    {path: '/registros-publicos', component: Feed},
    //{path: '/pdf', component: Pdf},
    {path: '/disciplinas', component: Disciplinas},
    {path: '/tipos-registro', component: TiposRegistro},
  ]
});

Vue.use(VueRouter);
Vue.use(GAuth,gauthOption);
Vue.config.productionTip = false
Vue.prototype.$http = axios;

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
