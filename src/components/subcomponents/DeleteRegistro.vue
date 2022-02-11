<template>
    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-card-title>Confirmando...</v-card-title>
            <v-card-text>
                <p>Você quer remover este registro?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancelar</v-btn>
                <v-btn color="red darken-1" text @click="deleteRegistro()">Excluir</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'DeleteRegistro',

    created() {
        this.$root.$refs.DeleteRegistro = this;
    },

    data: () => ({
        dialogDelete: false,
        loading: false,
        preDeleteId: null,
        feed: false
    }),

    methods: {
        deleteRegistro: function deleteRegistro() {
            this.loading = true;
            var user_id = sessionStorage.getItem('id');
            this.$http.delete('http://localhost:1337/registros/'+this.preDeleteId+'/'+user_id)
            .then(() => {
                this.$root.$refs.App.openSnackbar("Registro removido com sucesso.");
                this.dialogDelete = false;
                this.loading = false;
                if (this.feed) { this.$root.$refs.Feed.getRegistros(); }
                else { this.$root.$refs.Registros.getRegistros(); }
            });
        },
    }
  }
</script>

<style>
</style>