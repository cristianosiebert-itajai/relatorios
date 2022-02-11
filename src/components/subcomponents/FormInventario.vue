<template>
    <v-card>
        <v-card-title class="card-title">Cadastrar</v-card-title>
        <v-card-text>
            <v-form ref="formInventario" v-model="valid_form">
                <v-row>
                    <v-col cols="12" md="12">
                        <v-text-field prepend-icon="badge" class="fix-input-inline" :rules="rulesNome" v-model="inventario.nome" label="Nome" required></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-text-field prepend-icon="pin" class="fix-input-inline" v-model="inventario.patrimonio" label="Patrimônio"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-select prepend-icon="devices" required class="fix-input-inline" :rules="rulesSelect" v-model="inventario.tipo_periferico_id" item-text="nome" item-value="id" :items="perifericos" label="Tipo de Periférico"></v-select>
                    </v-col>
                    <v-col cols="12" md="12" v-if="inventario.tipo_periferico_id == 21">
                        <v-text-field prepend-icon="devices_other" class="fix-input-inline" v-model="inventario.tipo_periferico_outro_nome" label="Nome do periférico"></v-text-field>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-select prepend-icon="check" required class="fix-input-inline" :rules="rulesSelectStatus" v-model="inventario.status_id" item-text="status" item-value="id" :items="statuses" label="Status"></v-select>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-file-input placeholder="Fotos" v-model="arquivos" prepend-icon="mdi-camera" accept="image/png, image/jpeg, image/bmp" name="fotos" small-chips truncate-length="15"></v-file-input>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-btn @click="criarItem()" :disabled="!valid_form"><span style="color: #E91E63;">Adicionar</span></v-btn>
                    </v-col>
                </v-row>
            </v-form>
            <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
        </v-card-text>
    </v-card>
</template>

<script>
  export default {
    name: 'FormInventario',
    created() { this.$root.$refs.FormInventario = this; },
    beforeMount() {
        this.$root.$refs.AppBar.showLoading();
        this.getPerifericos();
        this.getStatus();
        this.$root.$refs.AppBar.hideLoading();
    },
    data: () => ({
        inventario: {
            nome: null,
            patrimonio: null,
            tipo_periferico_id: null,
            tipo_periferico_outro_nome: null,
            status_id: null,
            foto: null,
            createdBy: sessionStorage.getItem('id'),
            updatedBy: sessionStorage.getItem('id')
        },
        valid_form: false,
        rulesNome: [v => !!v || 'O campo nome é obrigatório.'],
        rulesSelect: [v => !!v || 'O campo Tipo de Periférico é obrigatório.'],
        rulesSelectStatus: [v => !!v || 'O campo Status é obrigatório.'],
        perifericos: [],
        arquivos: null,
        statuses: [],
        loading: false,
    }),

    methods: {
        getPerifericos: function getPerifericos(){
            this.loading = true;
            this.$http.get('http://localhost:1337/tipos-perifericos/')
            .then((result) => { 
                this.perifericos = result.data;
                this.loading = false;
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        },
        getStatus: function getStatus(){
            this.loading = true;
            this.$http.get('http://localhost:1337/inventarios-status/')
            .then((result) => { 
                this.statuses = result.data;
                this.loading = false;
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        },
        criarItem: function criarItem() {
            this.loading = true;
            this.$http.post('http://localhost:1337/inventarios/',this.inventario)
            .then((result) => {
                var novoObj = result.data;
                novoObj['index'] = this.$root.$refs.Inventario.itens.length;
                if (this.arquivos != null) {
                    let formData = new FormData();
                    formData.append('files[' + 0 + ']', this.arquivos);
                    this.$http.put('http://localhost:1337/inventarios/foto/'+novoObj.id,formData,{
                        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
                    });
                }
                this.$root.$refs.Inventario.itens.push(novoObj);
                this.$root.$refs.App.openSnackbar("Periférico cadastrado com sucesso.");
                this.resetForm();
            }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
        },
        resetForm: function resetForm() {
            this.$refs.formInventario.reset();
            this.arquivos = null;
            this.loading = false;
        }
    }
  }
</script>

<style>
</style>