<template>
    <span>
        <v-navigation-drawer app v-model="drawer" :mini-variant.sync="mini" permanent expand-on-hover v-if="$vuetify.breakpoint.width > 600">
            <v-list-item class="px-2">
                <v-list-item-avatar>
                    <v-img :src="getSessionItem('avatar')"></v-img>
                </v-list-item-avatar>
                <v-list-item-title >{{ getSessionItem('name') }}</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense>
                <v-list-item v-for="item in items" :key="item.title" link>
                    <v-list-item-icon v-if="verificarPermissao(item.permissao)">
                        <router-link :to="item.link" class="link_menu"><v-icon @click="setCurrentPage(item.link)" v-bind:class="{'active_menu':isPageActive(item.link)}">{{ item.icon }}</v-icon></router-link>
                    </v-list-item-icon>
                    <v-list-item-content v-if="verificarPermissao(item.permissao)">
                        <router-link :to="item.link" class="link_menu"><v-list-item-title @click="setCurrentPage(item.link)" v-bind:class="{'active_menu':isPageActive(item.link)}">{{ item.title }}</v-list-item-title></router-link>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-navigation-drawer app v-model="drawerMobile" v-if="$vuetify.breakpoint.width < 600">
            <v-list-item class="px-2">
                <v-list-item-avatar>
                    <v-img :src="getSessionItem('avatar')"></v-img>
                </v-list-item-avatar>
                <v-list-item-title >{{ getSessionItem('name') }}</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list dense>
                <v-list-item v-for="item in items" :key="item.title" link>
                    <v-list-item-icon v-if="verificarPermissao(item.permissao)">
                        <router-link :to="item.link" class="link_menu"><v-icon @click="setCurrentPage(item.link)" v-bind:class="{'active_menu':isPageActive(item.link)}">{{ item.icon }}</v-icon></router-link>
                    </v-list-item-icon>
                    <v-list-item-content v-if="verificarPermissao(item.permissao)">
                        <router-link :to="item.link" class="link_menu"><v-list-item-title @click="setCurrentPage(item.link)" v-bind:class="{'active_menu':isPageActive(item.link)}">{{ item.title }}</v-list-item-title></router-link>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </span>
</template>

<script>
  export default {
    name: 'NavDrawer',
    beforeMount() {
        this.setActiveOnInit();  
    },
    created() { this.$root.$refs.NavDrawer = this; },
    data: () => ({
        drawer: true,
        drawerMobile: false,
        mini: true,
        current: '/',
        items: [
            {title: 'Meus Registros', icon:'app_registration', link:'/', permissao:null},
            {title: 'Feed', icon:'feed', link:'/registros-publicos', permissao:null},
            //{title: 'Gerar PDF', icon:'picture_as_pdf', link:'/pdf'},
            {title: 'Usuários', icon:'account_circle', link:'/usuarios', permissao:['SME','SUPERADMIN']},
            {title: 'Inventário', icon:'inventory_2', link:'/inventario', permissao: ['Usuário','SUPERADMIN']},
            {title: 'Disciplinas', icon:'class', link:'/disciplinas', permissao:['SUPERADMIN']},
            {title: 'Tipos de registro', icon:'format_list_bulleted', link:'/tipos-registro', permissao:['SUPERADMIN']},
        ]
    }),

    methods: {
        getSessionItem: function getSessionItem(item) {
            return sessionStorage.getItem(item);
        },
        setCurrentPage: function setCurrentPage(page) {
            this.current = page;
        },
        isPageActive: function isPageActive(page) {
            if (page == this.current) { return true; } else { return false; }
        },
        setActiveOnInit: function setActiveOnInit() {
            const lastSegment = window.location.href.split("/").pop();
            this.setCurrentPage("/"+lastSegment);
        },
        verificarPermissao: function verificarPermissao(permissoes) {
            if (permissoes != null) { 
                var retorno  = false;
                for (let i=0; i<permissoes.length; i++) {
                    if (this.$root.$refs.App.verificarPermissao(permissoes[i])) { retorno = true; }
                }
                return retorno;
            } else { return true; }
        },
    }
  }
</script>

<style>
    .link_menu {
        text-decoration: none !important;
        color: inherit !important;
    }
    .active_menu { color: #e91e63 !important; }
</style>