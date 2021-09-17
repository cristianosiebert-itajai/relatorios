<template>
    <v-card>
        <v-card-title class="card-title">Cadastrar usuário</v-card-title>
        <v-card-text>
            <v-form ref="form" v-model="valid_form">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field prepend-icon="email" class="fix-input-inline" :rules="rules" v-model="usuarioPermitido.email" label="E-Mail" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-select prepend-icon="admin_panel_settings" required class="fix-input-inline" :rules="rulesSelect" v-model="usuarioPermitido.permissao" item-text="nome" item-value="id" :items="permissoes" label="Permissões"></v-select>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-btn @click="criarUsuarioPermitido()" :disabled="!valid_form"><span style="color: #E91E63;">Adicionar</span></v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card-text>
    </v-card>
</template>

<script>
  export default {
    name: 'FormUsuarioPermitido',
    beforeMount() { this.getPermissoes(); },
    data: () => ({
        valid_form: false,
        rules: [
            v => !!v || 'O campo E-mail é obrigatório.',
            v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'O E-mail deve ser válido.'
        ],
        rulesSelect: [v => !!v || 'O campo Permissão é obrigatório.'],
        usuarioPermitido: { permissao:null, email:null },
        permissoes: null,
        loading: false
    }),
    methods: {
        getPermissoes: function getPermissoes(){
            this.$http.get('http://localhost:3000/permissoes/')
            .then((result) => { this.permissoes = result.data;
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        },
        criarUsuarioPermitido: function criarUsuarioPermitido() {
            this.loading = true;
            this.$http.post('http://localhost:3000/usuarios-permitidos/',this.usuarioPermitido)
            .then((result) => {
                var novoObj = result.data;
                novoObj['index'] = this.$root.$refs.UsuariosPermitidos.usuariosPermitidos.length;
                this.$root.$refs.UsuariosPermitidos.usuariosPermitidos.push(novoObj);
                this.$root.$refs.App.openSnackbar("Usuário cadastrado com sucesso.");
                this.resetForm();
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        },
        resetForm: function resetForm() {
            this.$refs.form.reset();
            this.loading = false;
        }
    }
  }
</script>

<style>.card-title { font-size: 1.1rem; }</style>