<template>
    <v-container>
        <ControlsRegistro></ControlsRegistro>
        <RegistroFotoDialog :fotosDialog="fotosDialog"></RegistroFotoDialog>

        <v-row class="top-margin" v-if="verificarPermissao('Escola') || verificarPermissao('SME')">
            Instrutor de informática: {{ instrutor.nome }} <v-btn style="margin-top: -0.4rem;" icon @click="dialogInstrutor = true"><v-icon>change_circle</v-icon></v-btn>

            <v-dialog v-model="dialogInstrutor" max-width="500px">
                <v-card>
                    <v-card-title>Instrutor de Informática</v-card-title>
                    <v-card-text>
                        <form ref="formRelacao" @submit.prevent="salvarRelacaoInstrutor()">
                            <v-row><v-col cols="12" sm="12" md="12" >
                                <v-autocomplete no-data-text="Nenhum instrutor correspondente" :return-object="true" item-text="nome" dense :items="instrutores" v-model="instrutor_form" label="Nome"></v-autocomplete>
                            </v-col></v-row>
                        </form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="dialogInstrutor = false">Cancelar</v-btn>
                        <v-btn color="green darken-1" text @click="salvarRelacaoInstrutor()">Salvar</v-btn>
                        <v-spacer></v-spacer>
                        </v-card-actions>
                    <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
                </v-card>
            </v-dialog>
        </v-row>

        <v-row class="no-side-margin" v-if="registros.length == 0">
            <span class="loading_message">{{message_loading}}</span>
        </v-row>

        <v-row class="no-side-margin" v-if="registros.length > 0">
            <v-col cols="12" :sm="parseInt(12/card_por_linha.length)" v-for="(item,index) in card_por_linha" :key="item">
                <v-card class="mx-auto card-margin-bottom" v-for="(registro,index_reg) in registros[index]" :key="registro.id">
                    <RegistroCardCarousel :registro="registro"></RegistroCardCarousel>
                    <RegistroCardBody :registro="registro"></RegistroCardBody>                    
                    <RegistroCardActions :index="index" :index_reg="index_reg" :registro="registro"></RegistroCardActions>

                    <v-card-text class="card-field-comment">
                        <form @submit.prevent="comentar(registro)">
                            <v-row>
                                <v-col cols="12" sm="10" md="10" class="comment_field">
                                    <v-text-field @submit="comentar(registro)" class="no-margin-padding" ref="inputRef" prepend-icon="comment" label="Comentário" v-model="comment_fields[registro.comment_counter]"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="2" md="2" class="comment_field_btn">
                                    <v-btn @click="comentar(registro)" class="comment-btn" icon color="blue"><v-icon small>add</v-icon></v-btn>
                                </v-col>
                            </v-row>
                        </form>
                        <Comentario :resposta="false" :registro="registro" :comentarios="comentarios"></Comentario>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <FormRegistro></FormRegistro>
        <DeleteRegistro></DeleteRegistro>
    </v-container>
</template>

<script>
    import FormRegistro from './subcomponents/FormRegistro';
    import ControlsRegistro from './subcomponents/ControlsRegistro';
    import RegistroFotoDialog from './subcomponents/RegistroFotoDialog';
    import DeleteRegistro from './subcomponents/DeleteRegistro';
    import RegistroCardActions from './subcomponents/RegistroCardActions';
    import RegistroCardCarousel from './subcomponents/RegistroCardCarousel';
    import RegistroCardBody from './subcomponents/RegistroCardBody';
    import Comentario from './subcomponents/Comentario';
    export default {
        name: 'Registros',
        components: {
            ControlsRegistro,
            RegistroFotoDialog,
            DeleteRegistro,
            RegistroCardCarousel,
            RegistroCardBody,
            RegistroCardActions,
            Comentario,
            FormRegistro
        },
        created() { this.$root.$refs.Registros = this; },
        data: () => ({
            loading: false,
            message_loading: 'Carregando registros...',
            registros: [],
            card_por_linha: new Array(parseInt(sessionStorage.getItem('num_columns'))),
            fotosDialog: [],
            comment_fields: [],
            comentarios: [],
            main_comment: { 
                registro_id:null,
                usuario_comentario_id: null,
                comentario: null,
                comentario_pai_id: null,
                data_comentario: null,
                ativo: 1
            },
            dialogInstrutor: false,
            instrutores: [],
            instrutor: {nome:''},
            instrutor_form: null,
        }),
        beforeMount() {
            this.$root.$refs.AppBar.showLoading();
            this.$root.$refs.App.title = 'Registros';
            this.getInstrutorSupervisor();
            this.getInstrutores();
            this.getRegistros();
            this.$root.$refs.AppBar.hideLoading();
        },
        methods: {
            getRegistros: function getRegistros() {
                var month = sessionStorage.getItem('current_month').split('-');
                this.comentarios = [];
                var id = sessionStorage.getItem('google_id');
                if (this.instrutor.nome != '') { 
                    id = this.instrutor.google_id;
                }
                this.$http.get('http://localhost:1337/registros/'+month[1]+'/'+id+'/'+this.card_por_linha.length+'/privado')
                .then((result) => {
                    this.registros = result.data;
                    var size = this.registros.pop();
                    for (let i=0; i<this.registros.length; i++) {
                        for (let j=0; j<this.registros[i].length; j++) {
                            this.getComentarios(this.registros[i][j]);
                            var init = this.registros[i][j].data_inicio.split('T')[0];
                            this.registros[i][j].data_inicio = init;
                            var end = this.registros[i][j].data_fim.split('T')[0];
                            this.registros[i][j].data_fim = end;
                        }
                    }
                    this.comment_fields = new Array(size);
                    if (this.registros.length == 0) {
                        this.message_loading = "Nenhum registro encontrado neste mês."
                    }
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            getComentarios: function getComentarios(registro) {
                this.$http.get('http://localhost:1337/registros-comentarios/'+registro.id)
                .then((result) => { 
                    this.comentarios.push({'registro_id': registro.id, 'comentarios': result.data});
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            getInstrutores: function getInstrutores() {
                console.log('enter');
                this.$http.get('http://localhost:1337/usuarios/permissao/4')
                .then((result) => { 
                    this.instrutores = result.data;
                    this.$http.get('http://localhost:1337/usuarios/email/cristiano.siebert@edu.itajai.sc.gov.br')
                    .then((result) => { 
                        this.instrutores.push(result.data[0]);
                    }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
                }, () => {
                    this.$http.get('http://localhost:1337/usuarios/email/cristiano.siebert@edu.itajai.sc.gov.br')
                    .then((result) => { 
                        this.instrutores.push(result.data[0]);
                    }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
                });
            },
            getInstrutorSupervisor: function getInstrutorSupervisor() {
                this.$http.get('http://localhost:1337/supervisora-usuarios/email/'+sessionStorage.getItem('email'))
                .then((result) => { 
                    if (result.data.length > 0) {
                        var supervisionado = result.data[0];
                        this.$http.get('http://localhost:1337/usuarios/email/'+supervisionado.usuario_email)
                        .then((resultInstrutor) => { 
                            this.instrutor = resultInstrutor.data[0];
                            this.getRegistros();
                        }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
                    }
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            comentar: function comentar(registro){
                this.$root.$refs.AppBar.showLoading();
                this.main_comment.comentario = this.comment_fields[registro.comment_counter];
                this.main_comment.registro_id = registro.id;
                this.main_comment.usuario_comentario_id = sessionStorage.getItem('id');
                this.main_comment.data_comentario = new Date();
                this.$http.post('http://localhost:1337/registros-comentarios/',this.main_comment)
                .then(() => {
                    this.$root.$refs.AppBar.hideLoading();
                    this.getRegistros();
                });
            },
            salvarRelacaoInstrutor: function salvarRelacaoInstrutor() {
                this.$root.$refs.AppBar.showLoading();
                var obj = {'usuario_superior_email': sessionStorage.getItem('email'), 'usuario_email': this.instrutor_form.email};
                if (this.instrutor.nome == "") {
                    this.$http.post('http://localhost:1337/supervisora-usuarios/',obj)
                    .then(() => {
                        this.$root.$refs.AppBar.hideLoading();
                        this.dialogInstrutor = false;
                        this.$router.go();
                    });
                } else {
                    this.$http.put('http://localhost:1337/supervisora-usuarios/email/'+sessionStorage.getItem('email'),obj)
                    .then(() => {
                        this.$root.$refs.AppBar.hideLoading();
                        this.dialogInstrutor = false;
                        this.$router.go();
                    });
                }
            },
            verificarPermissao: function verificarPermissao(nome) {
                if (nome != null) { return this.$root.$refs.App.verificarPermissao(nome); }
                else { return false; }
            },
        }
    }
</script>

<style>
    .card-margin-bottom { margin-bottom: 1rem; }
    .card-field-comment { border-top: 1px solid #eee; }
    .no-margin-padding {
        margin-top: 0;
        padding-top: 0;
    }
    .container {
        padding: 0 !important;
        margin-right: 0 !important;
        margin-left: 0 !important;
        max-width: none !important;
    }
    .no-side-margin {
        margin-right: -19px !important;
        margin-left: -24px !important;
    }
    .loading_message { 
        margin-left: 0.7rem;
        margin-top: 1rem;
    }
    .comment-btn { margin-left: -0.5rem; }
    .top-margin { margin-top: 2rem; }
    @media (max-width: 400px) {
        .comment_field { 
            width: 77% !important;
            flex: none !important;
        }
        .comment_field_btn {
            flex: none !important;
            width: 36px !important;
        }
    }
    @media (min-width: 400px) and (max-width: 767px) {
        .comment_field { 
            width: 80% !important;
            flex: none !important;
        }
        .comment_field_btn {
            flex: none !important;
            width: 36px !important;
        }
    }
</style>