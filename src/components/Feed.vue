<template>
  <v-container>
    <ControlsRegistro :feed="true"></ControlsRegistro>
    <RegistroFotoDialog :fotosDialog="fotosDialog"></RegistroFotoDialog>

    <v-row class="no-side-margin" v-if="registros.length == 0">
        <span class="loading_message">{{message_loading}}</span>
    </v-row>

    <v-row class="no-side-margin" v-if="registros.length > 0">
        <v-col cols="12" sm="12" :md="parseInt(12/card_por_linha.length)" v-for="(item,index) in card_por_linha" :key="item">
            <v-card class="mx-auto card-margin-bottom" v-for="(registro, index_reg) in registros[index]" :key="registro.id">
                <RegistroCardCarousel :feed="true" :registro="registro"></RegistroCardCarousel>
                <RegistroCardBody :registro="registro"></RegistroCardBody>                    
                <RegistroCardActions :feed="true" :index="index" :index_reg="index_reg" :registro="registro"></RegistroCardActions>

                <v-card-text class="card-field-comment">
                  <form @submit.prevent="comentar(registro)">
                    <v-row>
                      <v-col cols="12" sm="12" md="10" class="comment_field">
                        <v-text-field class="no-margin-padding" ref="inputRef" prepend-icon="comment" label="Comentário" v-model="comment_fields[registro.comment_counter]"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="2" class="comment_field_btn">
                        <v-btn @click="comentar(registro)" class="comment-btn" icon color="blue"><v-icon small>add</v-icon></v-btn>
                      </v-col>    
                    </v-row>
                  </form>
                  <Comentario :feed="true" :resposta="false" :registro="registro" :comentarios="comentarios"></Comentario>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <FormRegistro :feed="true"></FormRegistro>
    <DeleteRegistro :feed="true"></DeleteRegistro>
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
    name: 'Feed',
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
    created() { this.$root.$refs.Feed = this; },
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
      }
    }),
    beforeMount() {
        this.$root.$refs.AppBar.showLoading();
        this.$root.$refs.App.title = 'Feed';
        this.getRegistros();
        this.$root.$refs.AppBar.hideLoading();
    },
    methods: {
      getRegistros: function getRegistros() {
        var month = sessionStorage.getItem('current_month').split('-');
        this.comentarios = [];
        this.$http.get('http://localhost:1337/registros/'+month[1]+'/'+sessionStorage.getItem('google_id')+'/'+this.card_por_linha.length+'/publico')
        .then((result) => {
          this.registros = result.data;
          var size = this.registros.pop();
          for (let i=0; i<this.registros.length; i++) {
            for (let j=0; j<this.registros[i].length; j++) {
              this.getComentarios(this.registros[i][j]);
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
      }
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