<template>
    <v-row>
        <v-col v-if="!verificarPermissao('SUPERADMIN')" cols="12" sm="12" md="12">Você não tem permissão para acessar esta área do sistema.</v-col>
        <v-col cols="12" sm="3" md="3" v-if="$vuetify.breakpoint.width < 600 && verificarPermissao('SUPERADMIN')">
            <FormDisciplina></FormDisciplina>
            <DisciplinaDeleteDialog :disciplina="preDelete"></DisciplinaDeleteDialog>
        </v-col>
        <v-col cols="12" sm="9" md="9" v-if="verificarPermissao('SUPERADMIN')">
            <v-card class="table-permitidos">
                <v-card-title class="card-title">
                    Disciplinas
                    <v-spacer></v-spacer>
                    <v-text-field class="fix-input-inline" clearable v-model="busca_disciplina" append-icon="mdi-magnify" label="Procurar disciplina" single-line hide-details></v-text-field>
                </v-card-title>
                <v-card-text class="margin-top-table">
                    <v-data-table dense :footer-props="{'items-per-page-text':'Disciplinas por página', 'items-per-page-all-text':'Todos'}" :headers="table_headers" :items="disciplinas" :search="busca_disciplina" >
                    <template v-slot:item="{ item }">
                        <tr>
                            <td>
                                <v-edit-dialog cancel-text="Cancelar" @save="editarDisciplina(item)" save-text="Salvar" persistent large :return-value.sync="item.email" >
                                {{item.nome}}
                                <template v-slot:input>
                                    <v-text-field v-model="item.nome" label="Nome da disciplina" single-line></v-text-field>
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
            <FormDisciplina></FormDisciplina>
            <DisciplinaDeleteDialog :disciplina="preDelete"></DisciplinaDeleteDialog>
        </v-col>
    </v-row>
</template>

<script>
    import DisciplinaDeleteDialog from './subcomponents/DisciplinaDeleteDialog';
    import FormDisciplina from './subcomponents/FormDisciplina';
    export default {
        name: 'Disciplinas',
        components: {
            DisciplinaDeleteDialog,
            FormDisciplina
        },
        created() { this.$root.$refs.Disciplinas = this; },
        beforeMount() {
            this.$root.$refs.AppBar.showLoading();
            this.$root.$refs.App.title = 'Disicplinas';
            this.getDisciplinas();
            this.$root.$refs.AppBar.hideLoading();
        },
        data: () => ({
            disciplinas: [],
            busca_disciplina: null,
            table_headers: [
                { text:'Nome', sortable:true, value:'nome' },
                { text:'Opções', sortable:false, filterable:false }
            ],
            preDelete: null,
            loading: false
        }),
        methods: {
            getDisciplinas: function getDisciplinas(){
                this.loading = true;
                this.$http.get('http://localhost:3000/disciplinas/')
                .then((result) => { 
                    this.disciplinas = result.data;
                    this.loading = false;
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            editarDisciplina: function editarDisciplina(disc) {
                this.loading = true;
                this.$http.put('http://localhost:3000/disciplinas/'+disc.id,disc)
                .then(() => {
                    this.$root.$refs.App.openSnackbar("Disciplina alterada com sucesso.");
                    this.loading = false;
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            openDeleteDialog: function openDeleteDialog(disc) {
                this.$root.$refs.DisciplinaDeleteDialog.dialogDeleteDisciplina = true;
                this.preDelete = disc;
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