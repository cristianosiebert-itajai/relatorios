<template>
    <v-card-actions class="justify-end" v-if="registro.createdBy == user_id">
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn v-bind="attrs" @click="editRegistro(registro.id)" v-on="on" color="pink lighten-3" icon><v-icon small>edit</v-icon></v-btn>
            </template>
            <span>Editar</span>
        </v-tooltip>
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn @click="preDelete(registro.id)" v-bind="attrs" v-on="on" icon color="pink lighten-3"><v-icon small>delete</v-icon></v-btn>
            </template>
            <span>Remover</span>
        </v-tooltip>
        <v-tooltip top v-if="!feed">
            <template v-slot:activator="{ on, attrs }">
                <v-btn @click="duplicarRegistro(registro.id)" v-bind="attrs" v-on="on" icon color="pink lighten-3"><v-icon small>control_point_duplicate</v-icon></v-btn>
            </template>
            <span>Duplicar Registro</span>
        </v-tooltip>
        <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
                <v-btn @click="mudarVisibilidade(registro);" v-bind="attrs" v-on="on" icon color="pink lighten-3"><v-icon small>{{getVisibilidade(registro)}}</v-icon></v-btn>
            </template>
            <span>Público/Privado</span>
        </v-tooltip>
    </v-card-actions>
</template>

<script>
  export default {
    name: 'RegistroCardActions',

    props: ['registro','index','index_reg','feed'],

    created() {
        this.$root.$refs.RegistroCardActions = this;
    },

    data: () => ({
        user_id: sessionStorage.getItem('id')
    }),

    methods: {
        editRegistro: function editRegistro(id) {
            this.$root.$refs.Registro.getRegistro(parseInt(id));
        },
        preDelete: function preDelete(id) {
            this.$root.$refs.DeleteRegistro.preDeleteId = id;
            this.$root.$refs.DeleteRegistro.dialogDelete = true;
            if (this.feed) { this.$root.$refs.DeleteRegistro.feed = true; }
        },
        mudarVisibilidade: function mudarVisibilidade(registro) {
            if (registro.visibilidade) { registro.visibilidade = false; }
            else { registro.visibilidade = true; }
            this.$http.put('http://localhost:1337/registros/'+registro.id,registro)
            .then(() => { 
                if (registro.visibilidade) { this.$root.$refs.App.openSnackbar("O registro se tornou público."); }
                else { this.$root.$refs.App.openSnackbar("O registro está privado."); }
                if (this.feed) { this.$root.$refs.Feed.getRegistros(); }
            });
        },
        getVisibilidade: function getVisibilidade(registro){
            if (registro.visibilidade) { return 'visibility'; }
            else { return 'visibility_off'; }
        },
        duplicarRegistro: function duplicarRegistro(id) {
            this.$root.$refs.AppBar.showLoading();
            this.$http.get('http://localhost:1337/registros/id/'+id)
            .then((result) => { 
                this.registro = result.data;
                delete this.registro['id'];
                delete this.registro['createdAt'];
                delete this.registro['updatedAt'];
                var tipo = this.registro.tipo_registro;
                this.$http.post('http://localhost:1337/registros/',this.registro)
                .then((result_obj) => {
                    let novo_registro = result_obj.data;
                    if (parseInt(tipo) == 1) {
                        this.$http.get('http://localhost:1337/aulas-registros/'+id)
                        .then((res_aulas) => {
                            var aulas = res_aulas.data;
                            for (let i=0; i<aulas.length; i++) { 
                                aulas[i].registro_id = novo_registro.id
                                delete aulas[i]['id'];
                                this.$http.post('http://localhost:1337/aulas-registros/',aulas[i])
                            }
                        });
                    }
                    
                    this.$http.get('http://localhost:1337/registros-fotos/'+id)
                    .then((res_fotos) => {
                        var fotos = res_fotos.data;
                        this.fotos_registro = fotos;
                    });
                    
                    this.$root.$refs.Registros.getRegistros();
                    this.$root.$refs.App.openSnackbar("Registro duplicado com sucesso.");
                });
                this.$root.$refs.AppBar.hideLoading();
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        }
    }
  }
</script>