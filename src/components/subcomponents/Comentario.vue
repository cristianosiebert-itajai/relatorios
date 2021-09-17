<template>
    <div>
        <span v-for="(comentario,index_comment) in comentarios" :key="index_comment">
            <span ref="for_comment" v-if="comentario.registro_id == registro.id && comentario.comentarios.length > 0 && comentario.comentarios != undefined">
                <v-row v-bind:class="{ 'resposta-margin': resposta }" class="comment_box" v-for="comment in comentario.comentarios" :key="comment.id">
                    <v-col cols="12" sm="12" md="12" class="box-relative">
                        <v-avatar class="foto-margin" size="32"><v-img :src="comment.foto" :alt="comment.nome"></v-img></v-avatar>
                        <div class="line_response" v-if="comment.num_respostas.total_respostas > 0"></div>
                        <div class="box-style-comment">
                            <div class="comment_name">{{comment.nome}}<br /> <span class="date_comment">{{getFormattedDate(comment.createdAt)}}</span></div>
                            <div class="comment_text">{{comment.comentario}}</div>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" class="margin-comment-btns">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="openCommentDialog('resposta',comment)" icon v-bind="attrs" v-on="on" color="pink lighten-3"><v-icon x-small>reply</v-icon></v-btn>
                            </template>
                            <span>Responder</span>
                        </v-tooltip>
                        <v-tooltip top v-if="user_id == comment.usuario_comentario_id">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="openCommentDialog('editar',comment)" icon v-bind="attrs" v-on="on" color="pink lighten-3"><v-icon x-small>edit</v-icon></v-btn>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>
                        <v-tooltip top v-if="user_id == comment.usuario_comentario_id">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn @click="preDeleteComentario(comment)" icon v-bind="attrs" v-on="on" color="pink lighten-3"><v-icon x-small>delete</v-icon></v-btn>
                            </template>
                            <span>Remover</span>
                        </v-tooltip>
                    </v-col>
                    <v-col v-if="comment.num_respostas.total_respostas > 0" class="ver-mais" @click="getRespostaComentarios(comment)" style="padding-bottom: 1rem !important;" cols="12" sm="12" md="12">
                        {{getLabelResposta(comment)}}
                    </v-col>
                    <v-col cols="12" sm="12" md="12" v-if="getRespostas(comment).length > 0">
                        <v-expand-transition>
                            <div ref="response_area" :id="'respostas_'+comment.id" v-show="respostas.length > 0">
                                <Comentario :resposta="true" :registro="registro" :comentarios="getRespostas(comment)"></Comentario>
                            </div>
                        </v-expand-transition>
                    </v-col>
                </v-row>
            </span>
        </span>
        <ComentarioDialog></ComentarioDialog>
        <DeleteComentarioDialog :feed="feed"></DeleteComentarioDialog>
    </div>
</template>

<script>
    import ComentarioDialog from './ComentarioDialog';
    import DeleteComentarioDialog from './DeleteComentarioDialog';
    import moment from 'moment';
    export default {
        name: 'Comentario',
        components: {
            ComentarioDialog,
            DeleteComentarioDialog
        },
        props: ['comentarios', 'registro', 'resposta', 'feed'],
        data: () => ({
            respostas: [],
            user_id: sessionStorage.getItem('id')
        }),
        created() { this.$root.$refs.Comentario = this; },
        mounted() {
            for (let i=0; i<this.comentarios.length; i++) {
                for (let j=0; j<this.comentarios[i].comentarios.length; j++) {
                    //console.log("comentario");
                    //console.log(this.comentarios[i].comentarios[j]);
                    this.getRespostaComentarios(this.comentarios[i].comentarios[j]);
                }
            }
        },
        methods: {
            getRespostaComentarios: function getRespostaComentarios(comentario) {
                this.$root.$refs.AppBar.showLoading();
                var index = this.findIndex(comentario);
                if (index != -1) {
                    this.respostas.splice(index,1);
                    this.$root.$refs.AppBar.hideLoading();
                } else {
                    this.$http.get('http://localhost:3000/registros-comentarios/respostas/'+comentario.id)
                    .then((result) => { 
                        this.$root.$refs.AppBar.hideLoading();
                        if (result.data.length > 0) {
                            var comentario_pai_id = comentario.id;
                            if (comentario.comentario_pai_id != null) { comentario_pai_id = comentario.comentario_pai_id; }
                            this.respostas.push({'registro_id': this.registro.id, 'comentario_id':comentario.id, 'comentario_pai_id':comentario_pai_id, 'comentarios': result.data});
                        }
                    }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
                }
            },
            findIndex: function findIndex(comentario, edicao) {
                var index = -1;
                if (edicao) {
                    if (comentario.comentario_pai_id == null) {
                        if (this.feed) {
                            for (let i=0; i<this.$root.$refs.Feed.comentarios.length; i++) {
                                for (let j=0; j<this.$root.$refs.Feed.comentarios[i].comentarios.length; j++) {
                                    if (this.$root.$refs.Feed.comentarios[i].comentarios[j].id == comentario.id) { index = i+'-'+j; }
                                }
                            }
                        } else {
                            for (let i=0; i<this.$root.$refs.Registros.comentarios.length; i++) {
                                for (let j=0; j<this.$root.$refs.Registros.comentarios[i].comentarios.length; j++) {
                                    if (this.$root.$refs.Registros.comentarios[i].comentarios[j].id == comentario.id) { index = i+'-'+j; }
                                }
                            }
                        }
                    } else {
                        for (let i=0; i<this.comentarios.length; i++) {
                            for (let j=0; j<this.comentarios[i].comentarios.length; j++) {
                                if (this.comentarios[i].comentarios[j].id == comentario.id) { index = i+'-'+j; }
                            }
                        }
                    }
                } else {
                    for (let i=0; i<this.respostas.length; i++) {
                        if (this.respostas[i].comentario_id == comentario.id) { index = i; }
                    }
                }
                return index;
            },
            getLabelResposta: function getLabelResposta(comentario) {
                var index = this.findIndex(comentario);
                if (index != -1) { return 'Ocultar comentarios'; }
                else { return 'Ver comentários'; }
            },
            getRespostas: function getRespostas(comentario) {
                var retorno = [];
                for (let i=0; i<this.respostas.length; i++) {
                    if (comentario.comentario_pai_id == null) {
                        if (this.respostas[i].comentario_id == comentario.id && this.respostas[i].comentario_pai_id == this.respostas[i].comentario_id) {
                            retorno = [this.respostas[i]];
                        }
                    } else {
                        if (this.respostas[i].comentario_id == comentario.id && this.respostas[i].comentario_pai_id != this.respostas[i].comentario_id) {
                            retorno = [this.respostas[i]];
                        }
                    }
                }
                return retorno;
            },
            openCommentDialog: function openCommentDialog(tipo,comentario) {
                this.$root.$refs.ComentarioDialog.openCommentDialog(tipo,comentario);
            },
            updateNumRespostas: function updateNumRespostas(id) {
                for (let i=0; i<this.comentarios.length; i++) {
                    if (this.comentarios[i].comentarios != undefined) {
                        for (let j=0; j<this.comentarios[i].comentarios.length; j++) {
                            if (this.comentarios[i].comentarios[j].id == id) {
                                this.comentarios[i].comentarios[j].num_respostas.total_respostas++;
                            }
                        }
                    }
                }
            },
            getFormattedDate: function getFormattedDate(date) { return moment(date).format('DD/MM/YYYY HH:mm'); },
            preDeleteComentario: function preDeleteComentario(comentario) {
                this.$root.$refs.DeleteComentarioDialog.preDeleteComentario(comentario);
            }
        }
    }
</script>

<style>
    .foto-margin { margin-top: -6rem; }
    .resposta-margin { margin-left: 0.5rem; }
    .box-relative { position: relative; }
    .date_comment { 
        font-style: italic;
        font-size: 0.7rem;
    }
    .ver-mais {
        font-size: 0.7rem;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        cursor: pointer;
        width: calc(100% - 40px);
        margin-left: 40px;
    }
    .comment_name { 
        font-size: 0.8rem;
        font-weight: 700;
        margin-top: -4px;
    }
    .comment_text { 
        font-size: 0.8rem;
        margin-top: 5px;
    }
    .margin-comment-btns { 
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        margin-top: -1rem;
        margin-left: 30px;
    }
    .box-style-comment {
        background-color: #eee;
        margin-left: 0.4rem;
        width: calc(100% - 40px);
        display: inline-block;
        padding: 10px;
        border-radius: 0.5rem;
    }
    .line_response {
        position: absolute;
        left: 25px;
        top: 55px;
        width: 20px;
        height: calc(100% - 22px);
        border-left: 2px solid #e0e0e0;
        border-bottom: 2px solid #e0e0e0;
        border-bottom-left-radius: 1rem;
    }
</style>