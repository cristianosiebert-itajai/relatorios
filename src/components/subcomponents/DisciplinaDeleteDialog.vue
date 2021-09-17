<template>
    <v-dialog v-model="dialogDeleteDisciplina" max-width="500px">
        <v-card>
            <v-card-title>Confirmando...</v-card-title>
            <v-card-text>
                <p>Você está excluindo esta disciplina, tem certeza?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDeleteDisciplina = false">Cancelar</v-btn>
                <v-btn color="red darken-1" text @click="deletarDisciplina()">Excluir</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'DisciplinaDeleteDialog',
    props: ['disciplina'],
    created() { this.$root.$refs.DisciplinaDeleteDialog = this; },
    data: () => ({
        dialogDeleteDisciplina: false,
        loading: false
    }),
    methods: {
        deletarDisciplina: function deletarDisciplina() {
            this.loading = true;
            this.$http.delete('http://localhost:3000/disciplinas/'+this.disciplina.id)
            .then(() => { 
                this.$root.$refs.Disciplinas.getDisciplinas();
                this.$root.$refs.App.openSnackbar("Disciplina removida com sucesso.");
                this.loading = false; this.dialogDeleteDisciplina = false;
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        }
    }
  }
</script>

<style>
</style>