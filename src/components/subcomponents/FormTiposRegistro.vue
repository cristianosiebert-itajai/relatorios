<template>
    <v-card>
        <v-card-title class="card-title">Cadastrar tipo de registro</v-card-title>
        <v-card-text>
            <v-form ref="formTipoRegistro" v-model="valid_form">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field prepend-icon="badge" class="fix-input-inline" :rules="rules" v-model="tipo_registro.nome" label="Nome" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-btn @click="criarTipo()" :disabled="!valid_form"><span style="color: #E91E63;">Adicionar</span></v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card-text>
    </v-card>
</template>

<script>
  export default {
    name: 'FormDisciplina',
    data: () => ({
        valid_form: false,
        rules: [
            v => !!v || 'O campo nome é obrigatório.'
        ],
        tipo_registro: { nome:null },
        loading: false
    }),
    methods: {
        criarTipo: function criarTipo() {
            this.loading = true;
            this.$http.post('http://localhost:3000/tipos-registros/',this.tipo_registro)
            .then((result) => {
                var novoObj = result.data;
                novoObj['index'] = this.$root.$refs.TiposRegistro.tipos_registros.length;
                this.$root.$refs.TiposRegistro.tipos_registros.push(novoObj);
                this.$root.$refs.App.openSnackbar("Disciplina cadastrada com sucesso.");
                this.resetForm();
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        },
        resetForm: function resetForm() {
            this.$refs.formTipoRegistro.reset();
            this.loading = false;
        }
    }
  }
</script>

<style>
</style>