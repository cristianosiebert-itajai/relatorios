<template>
    <v-dialog v-model="dialogDeleteTipo" max-width="500px">
        <v-card>
            <v-card-title>Confirmando...</v-card-title>
            <v-card-text>
                <p>Você está excluindo este tipo de registro, tem certeza?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDeleteTipo = false">Cancelar</v-btn>
                <v-btn color="red darken-1" text @click="deletarTipo()">Excluir</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'TiposRegistroDeleteDialog',
    props: ['tipo'],
    created() { this.$root.$refs.TiposRegistroDeleteDialog = this; },
    data: () => ({
        dialogDeleteTipo: false,
        loading: false
    }),
    methods: {
        deletarTipo: function deletarTipo() {
            this.loading = true;
            this.$http.delete('http://localhost:1337/tipos-registros/'+this.tipo.id)
            .then(() => { 
                this.$root.$refs.TiposRegistro.getTipoRegistros();
                this.$root.$refs.App.openSnackbar("Tipo de registro removido com sucesso.");
                this.loading = false; this.dialogDeleteTipo = false;
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        }
    }
  }
</script>

<style>
</style>