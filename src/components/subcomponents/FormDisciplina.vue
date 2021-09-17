<template>
    <v-card>
        <v-card-title class="card-title">Cadastrar disciplina</v-card-title>
        <v-card-text>
            <v-form ref="formDisciplina" v-model="valid_form">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field prepend-icon="badge" class="fix-input-inline" :rules="rules" v-model="disciplina.nome" label="Nome" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-btn @click="criarDisciplina()" :disabled="!valid_form"><span style="color: #E91E63;">Adicionar</span></v-btn>
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
        disciplina: { nome:null },
        loading: false
    }),
    methods: {
        criarDisciplina: function criarDisciplina() {
            this.loading = true;
            this.$http.post('http://localhost:3000/disciplinas/',this.disciplina)
            .then((result) => {
                var novoObj = result.data;
                novoObj['index'] = this.$root.$refs.Disciplinas.disciplinas.length;
                this.$root.$refs.Disciplinas.disciplinas.push(novoObj);
                this.$root.$refs.App.openSnackbar("Disciplina cadastrada com sucesso.");
                this.resetForm();
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        },
        resetForm: function resetForm() {
            this.$refs.formDisciplina.reset();
            this.loading = false;
        }
    }
  }
</script>

<style>
</style>