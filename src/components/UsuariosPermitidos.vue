<template>
  <v-row>
    <v-col v-if="!verificarPermissao('SUPERADMIN') && !verificarPermissao('SME')" cols="12" sm="12" md="12">Você não tem permissão para acessar esta área do sistema.</v-col>
    <v-col cols="12" sm="3" md="3"  v-if="$vuetify.breakpoint.width < 600 && (verificarPermissao('SUPERADMIN') || verificarPermissao('SME'))">
      <FormUsuarioPermitido v-if="verificarPermissao('SUPERADMIN')"></FormUsuarioPermitido>
      <DeleteUsuarioPermitido></DeleteUsuarioPermitido>
    </v-col>
    <v-col cols="12" sm="9" :md="verificarPermissaoInterna('criar_usuarios') ? '9':'12'" v-if="verificarPermissao('SUPERADMIN') || verificarPermissao('SME')">
      <v-card class="table-permitidos">
        <v-card-title class="card-title">
          Usuários cadastrados
          <v-spacer></v-spacer>
          <v-text-field class="fix-input-inline" clearable v-model="busca_email_permitido" append-icon="mdi-magnify" label="Procurar usuário" single-line hide-details></v-text-field>
        </v-card-title>
        <v-card-text class="margin-top-table">
          <v-data-table dense :footer-props="{'items-per-page-text':'E-Mails por página', 'items-per-page-all-text':'Todos'}" :headers="table_headers" :items="usuariosPermitidos" :search="busca_email_permitido" >
            <template v-slot:item="{ item }">
              <tr>
                <td>
                  <v-avatar size="32">
                    <img :src="item.avatar" :alt="item.nome">
                  </v-avatar>
                </td>
                <td>
                  <v-edit-dialog v-if="verificarPermissao('SUPERADMIN')" cancel-text="Cancelar" save-text="Salvar" @save="editarUsuarioPermitido(item.index)" persistent large :return-value.sync="item.email" >
                    {{item.email}}
                    <template v-slot:input>
                      <v-text-field v-model="item.email" label="E-Mail do usuário" single-line></v-text-field>
                      <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
                    </template>
                  </v-edit-dialog>
                  <span v-if="!verificarPermissao('SUPERADMIN')">{{item.email}}</span>
                </td>
                <td>{{ item.nome }}</td>
                <td>
                  <v-edit-dialog v-if="verificarPermissao('SUPERADMIN')" cancel-text="Cancelar" save-text="Salvar" @save="editarUsuarioPermitido(item.index)" persistent large :return-value.sync="item.email" >
                    {{ getPermissaoNome(item.permissao) }}
                    <template v-slot:input>
                      <v-select v-model="item.permissao" item-text="nome" item-value="id" :items="permissoes" label="Permissões"></v-select>
                      <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
                    </template>
                  </v-edit-dialog>
                  <span v-if="!verificarPermissao('SUPERADMIN')">{{ getPermissaoNome(item.permissao) }}</span>
                </td>
                <td>
                  <v-btn v-if="verificarPermissao('SUPERADMIN')" icon @click="openDeleteDialog(item.index)"><v-icon small>mdi-delete</v-icon></v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="3" md="3"  v-if="$vuetify.breakpoint.width > 600 && (verificarPermissao('SUPERADMIN') || verificarPermissao('SME'))">
      <FormUsuarioPermitido v-if="verificarPermissao('SUPERADMIN')"></FormUsuarioPermitido>
      <DeleteUsuarioPermitido></DeleteUsuarioPermitido>
    </v-col>
  </v-row>
</template>

<script>
  import FormUsuarioPermitido from './subcomponents/FormUsuarioPermitido'
  import DeleteUsuarioPermitido from './subcomponents/DeleteUsuarioPermitido'

  export default {
    name: 'UsuariosPermitidos',
    components: {
      FormUsuarioPermitido,
      DeleteUsuarioPermitido
    },
    created() { this.$root.$refs.UsuariosPermitidos = this; },
    beforeMount() {
      this.$root.$refs.AppBar.showLoading();
      this.$root.$refs.App.title = 'Usuários';
      this.getPermissoes();
      this.getUsuariosPermitidos();
      this.$root.$refs.AppBar.hideLoading();
    },
    data: () => ({
      busca_email_permitido: null,
      table_headers: [
        { text:'', align:'start', sortable:false, value:'avatar', filterable:false },
        { text:'E-mail', sortable:true, value:'email' },
        { text:'Nome', sortable:true, value:'nome' },
        { text:'Permissão', value:'permissao', sortable:true, filterable:false },
        { text:'Opções', sortable:false, filterable:false }
      ],
      usuariosPermitidos: [],
      permissoes: null,
      loading: false
    }),
    methods: {
      getPermissoes: function getPermissoes(){
        this.$http.get('http://localhost:1337/permissoes/')
          .then((result) => { this.permissoes = result.data;
          }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
      },
      getUsuariosPermitidos: function getUsuariosPermitidos(){
        this.$http.get('http://localhost:1337/usuarios-permitidos/')
          .then((result) => { 
            this.usuariosPermitidos = result.data;
            for (let i=0; i<this.usuariosPermitidos.length; i++) {
              this.usuariosPermitidos[i]['index'] = i;
            }
          }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
      },
      getPermissaoNome: function getPermissaoNome(id) {
        var nome = '';
        for (let i=0; i<this.permissoes.length; i++) {
          if (this.permissoes[i].id == id) { nome = this.permissoes[i].nome; }
        }
        return nome;
      },
      editarUsuarioPermitido: function editarUsuarioPermitido(index) {
        this.loading = true;
        var objToEdit = this.usuariosPermitidos[index];
        this.$http.put('http://localhost:1337/usuarios-permitidos/'+objToEdit.id,objToEdit)
        .then(() => {
          this.$root.$refs.App.openSnackbar("Usuário alterado com sucesso.");
          this.loading = false;
        }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
      },
      openDeleteDialog: function openDeleteDialog(index) {
        this.$root.$refs.UsuariosDialog.dialogDelete = true;
        this.$root.$refs.UsuariosDialog.preDelete = index;
      },
      verificarPermissao: function verificarPermissao(nome) {
          if (nome != null) { return this.$root.$refs.App.verificarPermissao(nome); }
          else { return false; }
      },
      verificarPermissaoInterna: function verificarPermissaoInterna(nome) {
          if (nome != null) { return this.$root.$refs.App.verificarPermissaoInterna(nome); }
          else { return false; }
      }
    }
  }
</script>

<style>
  .v-form { width: 100% !important; }
  .fix-input-inline { 
    padding: 0 !important;
    margin: 0 !important;
  }
  .card-title { font-size: 1.1rem; }
  .margin-top-table { margin-top: 1.5rem; }
</style>