<template>
    <v-dialog v-model="dialogDeleteComment" max-width="500px">
        <v-card>
            <v-card-title>Confirmando...</v-card-title>
            <v-card-text>
                <p>Você quer remover este comentário?</p>
                <p>Esta ação não pode ser desfeita.</p>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDeleteComment = false">Cancelar</v-btn>
                <v-btn color="red darken-1" text @click="deleteComentario()">Excluir</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'DeleteComentarioDialogg',
    created() {
        this.$root.$refs.DeleteComentarioDialog = this;
    },
    data: () => ({
        dialogDeleteComment: false,
        preDeleteComment: null,
        preDeleteIndex: null,
        loading: false
    }),
    props: ['feed'],
    methods: {
        preDeleteComentario: function preDeleteComentario(comentario) {
            this.preDeleteComment = comentario;
            this.preDeleteIndex = this.$root.$refs.Comentario.findIndex(comentario, true);            
            this.dialogDeleteComment = true;
        },
        deleteComentario: function deleteComentario() {
            this.$root.$refs.AppBar.showLoading();

            this.$http.delete('http://localhost:1337/registros-comentarios/'+this.preDeleteComment.id)
            .then(() => {
                this.$root.$refs.AppBar.hideLoading();
                /*
                var index_arr = this.preDeleteIndex.split('-');
                if (this.preDeleteComment.comentario_pai_id == null) {
                    if (this.feed) {
                        this.$root.$refs.Feed.comentarios[parseInt(index_arr[0])].comentarios.splice(parseInt(index_arr[1]),1);
                    } else {
                        this.$root.$refs.Registros.comentarios[parseInt(index_arr[0])].comentarios.splice(parseInt(index_arr[1]),1);
                    }
                } else {
                    if (this.feed) {
                        this.$root.$refs.Feed.comentarios[parseInt(index_arr[0])].comentarios.splice(parseInt(index_arr[1]),1);
                    } else {
                        this.$root.$refs.Comentario.comentarios[parseInt(index_arr[0])].comentarios.splice(parseInt(index_arr[1]),1);
                    }
                }
                */
                this.dialogDeleteComment = false;
                this.$root.$refs.App.openSnackbar("Comentário removido com sucesso.");
                //this.$root.$refs.Comentario.$forceUpdate();
                this.$router.go();
            });
        }
    }
  }
</script>

<style>
</style>