<template>
    <v-dialog v-model="dialogDelete" max-width="500px">
        <v-card>
            <v-card-title>Confirmando...</v-card-title>
            <v-card-text>
                <p>Você está excluindo este usuário, ele não poderá mais entrar no sistema até ser recadastrado.</p>
                <p>Esta ação não pode ser desfeita.</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete = false">Cancelar</v-btn>
                <v-btn color="red darken-1" text @click="deletarUsuarioPermitido()">Excluir</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'DeleteUsuarioPermitido',
    data: () => ({
      dialogDelete: false,
      loading: false,
      preDelete: null,
    }),
    created() { this.$root.$refs.UsuariosDialog = this; },
    methods: {
        deletarUsuarioPermitido: function deletarUsuarioPermitido() {
            this.loading = true;
            var objToRemove = this.$root.$refs.UsuariosPermitidos.usuariosPermitidos[this.preDelete];
            this.$http.delete('http://localhost:1337/usuarios-permitidos/'+objToRemove.id,objToRemove)
            .then(() => { 
                this.$root.$refs.UsuariosPermitidos.getUsuariosPermitidos();
                this.$root.$refs.App.openSnackbar("Usuário removido com sucesso.");
                this.loading = false; this.dialogDelete = false;
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        }
    }
  }
</script>