<template>
    <v-row>
        <v-col v-if="!verificarPermissao('SUPERADMIN')" cols="12" sm="12" md="12">Você não tem permissão para acessar esta área do sistema.</v-col>
        <v-col cols="12" sm="3" md="3" v-if="$vuetify.breakpoint.width < 600 && verificarPermissao('SUPERADMIN')">
            <FormTiposRegistro></FormTiposRegistro>
            <TiposRegistroDeleteDialog :tipo="preDelete"></TiposRegistroDeleteDialog>
        </v-col>
        <v-col cols="12" sm="9" md="9" v-if="verificarPermissao('SUPERADMIN')">
            <v-card class="table-permitidos">
                <v-card-title class="card-title">
                    Tipos de Registro
                    <v-spacer></v-spacer>
                    <v-text-field class="fix-input-inline" clearable v-model="busca_tipos" append-icon="mdi-magnify" label="Procurar tipos de registro" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text class="margin-top-table">
                    <v-data-table dense :footer-props="{'items-per-page-text':'Tipos de Registro por página', 'items-per-page-all-text':'Todos'}" :headers="table_headers" :items="tipos_registros" :search="busca_tipos" >
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>
                                <v-edit-dialog cancel-text="Cancelar" @save="editarTipo(item)" save-text="Salvar" persistent large :return-value.sync="item.email" >
                                {{item.nome}}
                                <template v-slot:input>
                                    <v-text-field v-model="item.nome" label="Nome do tipo" single-line></v-text-field>
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
        <v-col cols="12" sm="3" md="3" v-if="$vuetify.breakpoint.width > 600 && verificarPermissao('SUPERADMIN')">
            <FormTiposRegistro></FormTiposRegistro>
            <TiposRegistroDeleteDialog :tipo="preDelete"></TiposRegistroDeleteDialog>
        </v-col>
    </v-row>
</template>

<script>
    import TiposRegistroDeleteDialog from './subcomponents/TiposRegistroDeleteDialog';
    import FormTiposRegistro from './subcomponents/FormTiposRegistro';
    export default {
        name: 'TiposRegistro',
        components: {
            TiposRegistroDeleteDialog,
            FormTiposRegistro
        },
        created() { this.$root.$refs.TiposRegistro = this; },
        beforeMount() {
            this.$root.$refs.AppBar.showLoading();
            this.$root.$refs.App.title = 'Tipos de Registro';
            this.getTipoRegistros();
            this.$root.$refs.AppBar.hideLoading();
        },
        data: () => ({
            tipos_registros: [],
            busca_tipos: null,
            table_headers: [
                { text:'Nome', sortable:true, value:'nome' },
                { text:'Opções', sortable:false, filterable:false }
            ],
            preDelete: null,
            loading: false
        }),
        methods: {
            getTipoRegistros: function getTipoRegistros(){
                this.$http.get('http://localhost:1337/tipos-registros/')
                .then((result) => { 
                    this.tipos_registros = result.data;
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            editarTipo: function editarTipo(tipo) {
                this.loading = true;
                this.$http.put('http://localhost:1337/tipos-registros/'+tipo.id,tipo)
                .then(() => {
                    this.$root.$refs.App.openSnackbar("Tipo de Registro alterada com sucesso.");
                    this.loading = false;
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            openDeleteDialog: function openDeleteDialog(tipo) {
                this.$root.$refs.TiposRegistroDeleteDialog.dialogDeleteTipo = true;
                this.preDelete = tipo;
            },
            verificarPermissao: function verificarPermissao(nome) {
                if (nome != null) { return this.$root.$refs.App.verificarPermissao(nome); }
                else { return false; }
            }
        }
    }
</script>

<style>
</style>