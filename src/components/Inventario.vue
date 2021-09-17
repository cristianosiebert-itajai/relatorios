<template>
  <v-row>
    <v-col v-if="!verificarPermissao('Usuário') && !verificarPermissao('SUPERADMIN')" cols="12" sm="12" md="12">Você não tem permissão para acessar esta área do sistema.</v-col>
    <v-col cols="12" sm="3" md="3" v-if="$vuetify.breakpoint.width < 600 && (verificarPermissao('Usuário') || verificarPermissao('SUPERADMIN'))">
      <FormInventario></FormInventario>
      <InventarioDeleteDialog :periferico="preDelete"></InventarioDeleteDialog>
      
      <v-dialog v-model="carouselDialog" width="500">
        <v-card>
            <v-carousel :show-arrows="verifyArrows(fotosDialog.length)" class="card-media-dialog" hide-delimiters v-if="fotosDialog.length > 0">
              <v-carousel-item v-for="(item,i) in fotosDialog" :key="i"
              :src="'http://localhost:3000/inventarios/get-foto/'+fixFilepath(item)"
              ></v-carousel-item>
            </v-carousel>
        </v-card>
      </v-dialog>

    </v-col>
    <v-col cols="12" sm="9" md="9" v-if="verificarPermissao('Usuário') || verificarPermissao('SUPERADMIN')">
      <v-card class="table-permitidos">
          <v-card-title class="card-title">
              Inventário
              <v-spacer></v-spacer>
              <v-text-field class="fix-input-inline" clearable v-model="busca_inventario" append-icon="mdi-magnify" label="Procurar periférico" single-line hide-details></v-text-field>
          </v-card-title>
          <v-card-text class="margin-top-table">
              <v-data-table dense :footer-props="{'items-per-page-text':'Itens por página', 'items-per-page-all-text':'Todos'}" :headers="table_headers" :items="itens" :search="busca_inventario" >
              <template v-slot:item="{ item }">
                  <tr>
                      <td>
                        <v-avatar @click="openFotoDialog([item.foto])" size="32">
                          <img :src="'http://localhost:3000/inventarios/get-foto/'+fixFilepath(item.foto)" :alt="item.nome">
                        </v-avatar>
                      </td>
                      <td>
                        <v-edit-dialog cancel-text="Cancelar" @save="editarFoto(item)" save-text="Salvar" persistent large :return-value.sync="arquivos" >
                            <v-icon style="margin-left: 10px;">add_photo_alternate</v-icon>
                            <template v-slot:input>
                                <v-file-input placeholder="Fotos" v-model="arquivos" prepend-icon="mdi-camera" accept="image/png, image/jpeg, image/bmp" name="fotos" small-chips truncate-length="15"></v-file-input>
                                <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
                            </template>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog cancel-text="Cancelar" @save="editarItem(item)" save-text="Salvar" persistent large :return-value.sync="item.nome" >
                            {{item.nome}}
                            <template v-slot:input>
                                <v-text-field v-model="item.nome" label="Nome do periférico" single-line></v-text-field>
                                <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
                            </template>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog cancel-text="Cancelar" @save="editarItem(item)" save-text="Salvar" persistent large :return-value.sync="item.tipo_periferico_id" >
                            {{ getPerifericoNome(item.tipo_periferico_id) }}
                            <template v-slot:input>
                                <v-select prepend-icon="devices" required class="fix-input-inline" :rules="getPerifericosRules()" v-model="item.tipo_periferico_id" item-text="nome" item-value="id" :items="getPerifericos()" label="Tipo de Periférico"></v-select>
                                <v-text-field v-if="item.tipo_periferico_id == 21" prepend-icon="devices_other" class="fix-input-inline" v-model="item.tipo_periferico_outro_nome" label="Nome do periférico"></v-text-field>
                                <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
                            </template>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog cancel-text="Cancelar" @save="editarItem(item)" save-text="Salvar" persistent large :return-value.sync="item.patrimonio" >
                            {{item.patrimonio}}
                            <template v-slot:input>
                                <v-text-field v-model="item.patrimonio" label="Patrimônio" single-line></v-text-field>
                                <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
                            </template>
                        </v-edit-dialog>
                      </td>
                      <td>
                        <v-edit-dialog cancel-text="Cancelar" @save="editarItem(item)" save-text="Salvar" persistent large :return-value.sync="item.status_id" >
                            {{ getStatusNome(item.status_id) }}
                            <template v-slot:input>
                                <v-select prepend-icon="check" required class="fix-input-inline" :rules="getStatusRules()" v-model="item.status_id" item-text="status" item-value="id" :items="getStatuses()" label="Status"></v-select>
                                <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
                            </template>
                        </v-edit-dialog>
                      </td>
                      <td>
                          <v-btn @click="openDeleteDialog(item)" icon><v-icon small>mdi-delete</v-icon></v-btn>
                      </td>
                  </tr>
              </template>
              </v-data-table>
          </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="3" sm="3" v-if="$vuetify.breakpoint.width > 600 && (verificarPermissao('Usuário') || verificarPermissao('SUPERADMIN'))">
      <FormInventario></FormInventario>
      <InventarioDeleteDialog :periferico="preDelete"></InventarioDeleteDialog>
      
      <v-dialog v-model="carouselDialog" width="500">
        <v-card>
            <v-carousel :show-arrows="verifyArrows(fotosDialog.length)" class="card-media-dialog" hide-delimiters v-if="fotosDialog.length > 0">
              <v-carousel-item v-for="(item,i) in fotosDialog" :key="i"
              :src="'http://localhost:3000/inventarios/get-foto/'+fixFilepath(item)"
              ></v-carousel-item>
            </v-carousel>
        </v-card>
      </v-dialog>

    </v-col>
  </v-row>
</template>

<script>
import FormInventario from './subcomponents/FormInventario';
import InventarioDeleteDialog from './subcomponents/InventarioDeleteDialog';

  export default {
    name: 'Inventario',
    components: {
        FormInventario,
        InventarioDeleteDialog
    },
    beforeMount() {
      this.$root.$refs.AppBar.showLoading();
      this.$root.$refs.App.title = 'Inventário';
      this.getItems();
      this.$root.$refs.AppBar.hideLoading();
    },
    created() { this.$root.$refs.Inventario = this; },
    data: () => ({
      table_headers: [
        { text:'Foto', sortable:false, value:'foto' },
        { text:'', sortable:false, value:'foto_2' },
        { text:'Nome', sortable:true, value:'nome' },
        { text:'Tipo', sortable:true, value:'tipo_periferico_id' },
        { text:'Patrimônio', sortable:false, value:'patrimonio' },
        { text:'Status', sortable:true, value:'status' },
        { text:'Opções', sortable:false, filterable:false }
      ],
      itens: [],
      busca_inventario: null,
      preDelete: null,
      fotosDialog: [],
      loading: false,
      carouselDialog: false,
      arquivos: null,
    }),
    methods: {
      getItems: function getItems(){
          this.loading = true;
          this.$http.get('http://localhost:3000/inventarios/user_id/'+sessionStorage.getItem('id'))
          .then((result) => { 
              this.itens = result.data;
              this.loading = false;
          }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
      },
      fixFilepath: function fixFilepath(filepath) {
          if (filepath) { return filepath.replaceAll("/",'___');
          } else { return 'uploads___perifericos___no_photo.png'; }
      },
      getPerifericos: function getPerifericos() {
        return this.$root.$refs.FormInventario.perifericos;
      },
      getPerifericosRules: function getPerifericosRules() {
        return this.$root.$refs.FormInventario.rulesSelect;
      },
      getStatuses: function getStatuses(){
        return this.$root.$refs.FormInventario.statuses;
      },
      getStatusRules: function getStatusRules() {
        return this.$root.$refs.FormInventario.rulesSelectStatus;
      },
      getPerifericoNome: function getPerifericoNome(id){
        var nome = '';
        for (let i=0; i<this.$root.$refs.FormInventario.perifericos.length; i++) {
          if (this.$root.$refs.FormInventario.perifericos[i].id == id) { nome = this.$root.$refs.FormInventario.perifericos[i].nome; }
        }
        return nome;
      },
      getStatusNome: function getStatusNome(id){
        var nome = '';
        for (let i=0; i<this.$root.$refs.FormInventario.statuses.length; i++) {
          if (this.$root.$refs.FormInventario.statuses[i].id == id) { nome = this.$root.$refs.FormInventario.statuses[i].status; }
        }
        return nome;
      },
      editarItem: function editarItem(obj) {
        this.loading = true;
        this.$http.put('http://localhost:3000/inventarios/'+obj.id,obj)
        .then(() => {
          this.$root.$refs.App.openSnackbar("Periférico alterado com sucesso.");
          this.loading = false;
        }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
      },
      editarFoto: function editarFoto(obj) {
        this.loading = true;
        if (this.arquivos != null) {
            let formData = new FormData();
            formData.append('files[' + 0 + ']', this.arquivos);
            this.$http.put('http://localhost:3000/inventarios/foto/'+obj.id,formData,{
                "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
            }).then(() => {
              this.arquivos = null;

              this.getItems();
              this.$root.$refs.App.openSnackbar("Foto de periférico modificada com sucesso.");
            });
        }
      },
      openDeleteDialog: function openDeleteDialog(obj) {
        this.$root.$refs.InventarioDeleteDialog.dialogDeleteInventario = true;
        this.preDelete = obj;
      },
      openFotoDialog: function openFotoDialog(foto) {
        this.carouselDialog = true;
        this.fotosDialog = foto;
      },
      verifyArrows: function verifyArrows(len) {
        if (len > 1) { return true; } else { return false; }
      },
      verificarPermissao: function verificarPermissao(nome) {
          if (nome != null) { return this.$root.$refs.App.verificarPermissao(nome); }
          else { return false; }
      },
    }
  }
</script>

<style>
</style>