<template>
    <v-dialog v-model="dialogDeleteInventario" max-width="500px">
        <v-card>
            <v-card-title>Confirmando...</v-card-title>
            <v-card-text>
                <p>Você está excluindo este item do inventário, tem certeza?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDeleteInventario = false">Cancelar</v-btn>
                <v-btn color="red darken-1" text @click="deletarPeriferico()">Excluir</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'InventarioDeleteDialog',
    props: ['periferico'],
    created() { this.$root.$refs.InventarioDeleteDialog = this; },
    data: () => ({
        dialogDeleteInventario: false,
        loading: false,
    }),
    methods: {
        deletarPeriferico: function deletarPeriferico() {
            this.loading = true;
            this.$http.delete('http://localhost:1337/inventarios/'+this.periferico.id+'/'+sessionStorage.getItem('id'))
            .then(() => { 
                this.$root.$refs.Inventario.getItems();
                this.$root.$refs.App.openSnackbar("Periférico removido com sucesso.");
                this.loading = false; this.dialogDeleteInventario = false;
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        }
    }
  }
</script>

<style>
</style>