<template>
    <v-dialog v-model="dialogComment" max-width="500px">
        <v-card>
            <v-card-title>{{titleDialogComment}}</v-card-title>
            <v-card-text>
                <form @submit.prevent="verificarSubmit()" ref="formComment" :model="validForm">
                    <v-row>
                        <v-col cols="12" sm="12" md="12" >
                            <v-text-field :rules="rulesComment" :required="true" prepend-icon="comment" label="Comentário" v-model="main_comment.comentario"></v-text-field>
                        </v-col>
                    </v-row>
                </form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDialog()">Cancelar</v-btn>
                <v-btn color="red darken-1" v-if="main_comment.id == undefined" @click="salvarDialogComment('resposta')" :disabled="!validForm" text>{{textoBotaoComment}}</v-btn>
                <v-btn color="red darken-1" v-if="main_comment.id != undefined" @click="salvarDialogComment('editar')" :disabled="!validForm" text>{{textoBotaoComment}}</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'ComentarioDialog',
    created() {
        this.$root.$refs.ComentarioDialog = this;
    },
    data: () => ({
        dialogComment: false,
        titleDialogComment: '',
        rulesComment: [v => !!v || 'O campo Comentário é obrigatório.'],
        validForm: false,
        loading: false,
        textoBotaoComment: 'Salvar',
        main_comment: {
            id: null, 
            registro_id: null,
            usuario_comentario_id: sessionStorage.getItem('id'),
            comentario: null,
            comentario_pai_id: null,
            data_comentario: null,
            ativo: 1
        }
    }),
    methods: {
        closeDialog: function closeDialog() {
            this.dialogComment = false;
            this.loading = false;
        },
        verificarSubmit: function verificarSubmit() {
            if (this.main_comment.id == undefined) { this.salvarDialogComment('resposta'); } 
            else { this.salvarDialogComment('editar'); }
        },
        openCommentDialog: function openCommentDialog(tipo,comentario) {
            this.resetForm();
            this.dialogComment = true;
            if (tipo == 'resposta') {
                this.titleDialogComment = 'Responder comentário';
                this.main_comment.registro_id = comentario.registro_id;
                this.main_comment.comentario_pai_id = comentario.id;
                this.main_comment.data_comentario = new Date();
            } else { 
                this.titleDialogComment = 'Editar comentário'
                this.main_comment.comentario = comentario.comentario;
                this.main_comment.id = comentario.id;
                this.main_comment.registro_id = comentario.registro_id;
                this.main_comment.comentario_pai_id = comentario.comentario_pai_id;
                this.main_comment.data_comentario = comentario.data_comentario;
            }
        },
        resetForm: function resetForm() {
            if (this.$refs.formComment != undefined) {
                this.$refs.formComment.reset();
                    this.main_comment = { 
                    id: null,
                    registro_id: null,
                    usuario_comentario_id: sessionStorage.getItem('id'),
                    comentario: null,
                    comentario_pai_id: null,
                    data_comentario: null,
                    ativo: 1
                }
            }
        },
        salvarDialogComment: function salvarDialogComment(tipo) {
            this.$root.$refs.AppBar.showLoading();
            var pai_id = this.main_comment.comentario_pai_id;
            this.loading = true;
            if (tipo == 'resposta') {
                this.$http.post('http://localhost:1337/registros-comentarios/',this.main_comment)
                .then(() => {
                    this.$root.$refs.AppBar.hideLoading();
                    /*
                    this.$root.$refs.Comentario.getRespostaComentarios(this.main_comment);
                    this.$root.$refs.Comentario.updateNumRespostas(pai_id,false);
                    this.closeDialog();
                    */
                    this.$root.$refs.App.openSnackbar("Resposta cadastrada com sucesso.");
                    this.$router.go();
                });
            } else {
                if (pai_id == null) { pai_id = this.main_comment.registro_id; }
                this.$http.put('http://localhost:1337/registros-comentarios/'+this.main_comment.id,this.main_comment)
                .then(() => {
                    this.$root.$refs.AppBar.hideLoading();                        
                    var index = this.$root.$refs.Comentario.findIndex(this.main_comment, true);
                    var index_arr = index.split('-');
                    this.$root.$refs.Comentario.comentarios[parseInt(index_arr[0])].comentarios[parseInt(index_arr[1])].comentario = this.main_comment.comentario;
                    this.closeDialog();
                    this.$root.$refs.App.openSnackbar("Comentário editado com sucesso.");
                });
            }
        },
    }
  }
</script>