<template>
    <v-dialog fullscreen v-model="dialog">
        <template v-slot:activator="{ on, attrs }" >
            <span v-if="feed">
                <v-btn @click="verificaFeed()" fab elevation="2" color="pink" class="fab-btn" v-bind="attrs" v-on="on" v-if="verificarPermissaoInterna('cria_registro_publico')">
                    <v-icon color="white">mdi-plus</v-icon>
                </v-btn>
            </span>
            <span v-if="!feed">
                <v-btn @click="verificaFeed()" fab elevation="2" color="pink" class="fab-btn" v-bind="attrs" v-on="on" v-if="verificarPermissaoInterna('cria_registro_privado')">
                    <v-icon color="white">mdi-plus</v-icon>
                </v-btn>
            </span>
        </template>
        <v-card>
            <v-form  ref="form" v-model="validForm" @submit.prevent="verificarSubmit()">
                <v-card-title class="title-dialog-full">
                    Novo Registro
                    <v-spacer></v-spacer>
                    <v-btn @click="resetForm(); dialog = false;" icon color="white">
                        <v-icon color="white">cancel</v-icon>
                    </v-btn>
                    <v-progress-linear class="top-loading" :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
                </v-card-title>
                <v-card-text class="form-dialog-margin">
                    <v-row>
                        <v-col cols="12" sm="12" md="12" >
                            <v-select @change="preparaRequired()" prepend-icon="format_list_bulleted" :rules="tipoRegistroRules" required v-model="registro.tipo_registro" item-text="nome" item-value="id" :items="tipos_registros" label="Tipo de registro"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" v-if="registro.tipo_registro == TIPO_OUTRO_ID && registro.tipo_registro != null">
                            <v-text-field :rules="rulesTitulo" :required="requiredOutros.titulo ? true : false" prepend-icon="title" label="Título" v-model="registro.titulo_outro"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row v-if="registro.tipo_registro == TIPO_AULA_ID && registro.tipo_registro != null">
                        <v-col cols="12" sm="12" md="6" v-if="registro.disciplina != DISCIPLINA_OUTRO_ID">
                            <v-select @change="requiredNomeDisciplina()" prepend-icon="subject" :rules="rulesDisciplina" :required="requiredAula.disciplina ? true : false" v-model="registro.disciplina" item-text="nome" item-value="id" :items="disciplinas" label="Disciplinas"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" v-if="registro.disciplina == DISCIPLINA_OUTRO_ID">
                            <v-select @change="requiredNomeDisciplina()" prepend-icon="subject" :rules="rulesDisciplina" :required="requiredAula.disciplina ? true : false" v-model="registro.disciplina" item-text="nome" item-value="id" :items="disciplinas" label="Disciplinas"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" v-if="registro.disciplina == DISCIPLINA_OUTRO_ID">
                            <v-text-field prepend-icon="title" :rules="rulesDisciplinaNome" :required="requiredAula.disciplinaNome ? true : false" label="Nome da disciplina" v-model="registro.disciplina_titulo"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="6" v-if="registro.disciplina != DISCIPLINA_OUTRO_ID">
                            <v-select prepend-icon="light_mode" :rules="rulesTurno" :required="requiredAula.turno ? true : false" v-model="registro.turno" item-text="nome" item-value="id" :items="turnos" label="Turno"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" v-if="registro.disciplina == DISCIPLINA_OUTRO_ID">
                            <v-select prepend-icon="light_mode" :rules="rulesTurno" :required="requiredAula.turno ? true : false" v-model="registro.turno" item-text="nome" item-value="id" :items="turnos" label="Turno"></v-select>
                        </v-col>
                    </v-row>
                    <v-row v-if="registro.tipo_registro != TIPO_AULA_ID && registro.tipo_registro != null">
                        <v-col cols="12" sm="12" md="9" >
                            <v-text-field prepend-icon="place" :rules="rulesLocal" :required="requiredOutros.local ? true : false" label="Local" v-model="registro.local"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="3" >
                            <v-switch v-model="registro.visibilidade" :label="'Privado/Público'"></v-switch>
                        </v-col>
                    </v-row>
                    <v-row v-if="registro.tipo_registro != null">
                        <v-col cols="12" sm="12" md="4" v-if="registro.tipo_registro == TIPO_AULA_ID">
                            <v-text-field prepend-icon="class" :rules="rulesTurma" :required="requiredAula.turma ? true : false" label="Turma" v-model="registro.turma"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" v-if="registro.tipo_registro != TIPO_AULA_ID">
                            <v-select prepend-icon="light_mode" :rules="rulesTurno" :required="requiredAula.turno ? true : false" v-model="registro.turno" item-text="nome" item-value="id" :items="turnos" label="Turno"></v-select>
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-menu v-model="menu_picker_inicio" :close-on-content-click="false" :nudge-right="8" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field :required="false"
                                        v-model="data_inicio_formatted"
                                        label="Data (Inicial)"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        prepend-icon="mdi-calendar"
                                    ></v-text-field>
                                </template>
                                <v-date-picker @change="formatDate(registro.data_inicio,'inicio')" locale="pt-br" v-model="registro.data_inicio" @input="menu_picker_inicio = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="12" sm="12" md="4">
                            <v-menu v-model="menu_picker_fim" :close-on-content-click="false" :nudge-right="8" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field :required="false"
                                        v-model="data_fim_formatted"
                                        label="Data (Final)"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        prepend-icon="mdi-calendar"
                                    ></v-text-field>
                                </template>
                                <v-date-picker @change="formatDate(registro.data_fim,'fim')" :min="registro.data_inicio" locale="pt-br" v-model="registro.data_fim" @input="menu_picker_fim = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                    </v-row>
                    <v-row v-if="registro.tipo_registro == TIPO_AULA_ID && registro.tipo_registro != null">
                        <v-col cols="12" sm="12" md="6">
                            <v-checkbox @change="countTouch()" :rules="[checkCheckboxes]" :required="requiredAula.aulas ? true : false" class="inline-flex" v-model="qtdes_aulas" label="1º Aula" value="1"></v-checkbox>
                            <v-checkbox @change="countTouch()" :rules="[checkCheckboxes]" :required="requiredAula.aulas ? true : false" class="inline-flex" v-model="qtdes_aulas" label="2º Aula" value="2"></v-checkbox>
                            <v-checkbox @change="countTouch()" :rules="[checkCheckboxes]" :required="requiredAula.aulas ? true : false" class="inline-flex" v-model="qtdes_aulas" label="3º Aula" value="3"></v-checkbox>
                            <v-checkbox @change="countTouch()" :rules="[checkCheckboxes]" :required="requiredAula.aulas ? true : false" class="inline-flex" v-model="qtdes_aulas" label="4º Aula" value="4"></v-checkbox>
                            <v-checkbox @change="countTouch()" :rules="[checkCheckboxes]" :required="requiredAula.aulas ? true : false" class="inline-flex" v-model="qtdes_aulas" label="5º Aula" value="5"></v-checkbox>
                            <v-slide-y-transition>
                                <div class="error_checkbox" v-if="checkError">
                                    Selecione pelo menos uma aula.
                                </div>
                            </v-slide-y-transition>
                        </v-col>
                        <v-col cols="12" sm="12" md="3">
                            <v-switch :required="false" v-model="registro.is_em_sala" :label="'Aula em Sala?'"></v-switch>
                        </v-col>
                        <v-col cols="12" sm="12" md="3" >
                            <v-switch :required="false" v-model="registro.visibilidade" :label="'Privado/Público'"></v-switch>
                        </v-col>
                    </v-row>
                    <v-row v-if="registro.tipo_registro != null">
                        <v-col cols="12" sm="12" md="12">
                            <v-textarea required :rules="descricaoRules" prepend-icon="description" name="descricao" label="Descrição" v-model="registro.descricao"></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row class="photo-divider" v-if="registro.tipo_registro != null">
                        <v-col cols="12" sm="12" md="12">
                            <h3>Fotos</h3>
                            <v-file-input placeholder="Clique para inserir arquivos" v-model="arquivos" prepend-icon="mdi-camera" accept="image/png, image/jpeg, image/bmp" name="fotos" multiple small-chips truncate-length="15"></v-file-input>
                        </v-col>
                    </v-row>
                    <v-row v-if="registro.tipo_registro != null">
                        <v-col v-for="(foto,index) in fotos_registro.fotos" :key="foto.id" cols="12" sm="12" md="2">
                            <v-btn @click="preDeleteFoto(index)" icon><v-icon color="red lighten-2">delete</v-icon></v-btn>
                            <v-img class="image-form" :src="'http://localhost:3000/registros-fotos/foto/'+fixFilepath(foto.filepath)"></v-img>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="!registro.id" color="green darken-1" :disabled="!validForm" text @click="salvarRegistro(); dialog = false;">Salvar</v-btn>
                    <v-btn v-if="registro.id" color="green darken-1" :disabled="!validForm" text @click="editarRegistro(); dialog = false;">Salvar Alterações</v-btn>
                    <v-btn color="red darken-1" text @click="resetForm(); dialog = false;">Cancelar</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>

        <v-dialog v-model="dialogDeleteFoto" max-width="500px">
            <v-card>
                <v-card-title>Confirmando...</v-card-title>
                <v-card-text>
                    <p>Você quer remover esta foto?</p>
                    <p>Esta ação não pode ser desfeita.</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogDeleteFoto = false">Cancelar</v-btn>
                    <v-btn color="red darken-1" text @click="deleteFotoRegistro()">Excluir</v-btn>
                    <v-spacer></v-spacer>
                    </v-card-actions>
                <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom color="pink accent-4"></v-progress-linear>
            </v-card>
        </v-dialog>

    </v-dialog>
</template>

<script>
    import moment from 'moment/src/moment';
    export default {
        name: 'FormRegistro',
        props: ['feed'],
        data: () => ({
            loading: false,
            dialog: false,
            validForm: false,
            dialogDeleteFoto: false,
            pre_delete_index: null,
            tipoRegistroRules: [v => !!v || 'O campo Tipo de registro é obrigatório.'],
            tipos_registros: [],
            disciplinas: [],
            TIPO_AULA_ID: null,
            TIPO_OUTRO_ID: null,
            DISCIPLINA_OUTRO_ID: null,
            rulesTitulo: null,
            requiredAula: [{'disciplina':false,'turno':false,'turma':false,'aulas':false,'disciplinaNome':false}],
            requiredOutros: [{'titulo':false,'local':false}],
            rulesDisciplina: null,
            rulesDisciplinaNome: null,
            rulesTurno: null,
            turnos: [{id:1,nome:'Matutino'},{id:2,nome:'Vespertino'},{id:3,nome:'Noturno'},{id:4,nome:'Integral'}],
            rulesLocal: null,
            rulesTurma: null,
            menu_picker_inicio: false,
            menu_picker_fim: false,
            data_inicio_formatted: moment(new Date()).format("DD/MM/YYYY"),
            data_fim_formatted: moment(new Date()).format("DD/MM/YYYY"),
            countCheckTouches: 0,
            checkError: false,
            qtdes_aulas: [],
            descricaoRules: [v => !!v || 'O campo Descrição é obrigatório.'],
            rulesAulas: null,
            arquivos: [],
            fotos_registro: [],
            registro: {
                user_id: sessionStorage.getItem('google_id'),
                tipo_registro: null,
                disciplina: null,
                disciplina_titulo: null,
                turma: null,
                data_inicio: new Date().toISOString().split('T')[0],
                data_fim: new Date().toISOString().split('T')[0],
                is_em_sala: false,
                local: null,
                descricao: '',
                turno: null,
                visibilidade: false,
                titulo_outro: null,
                createdBy: sessionStorage.getItem('id'),
                updatedBy: sessionStorage.getItem('id')
            }
        }),
        created() { this.$root.$refs.Registro = this; },
        beforeMount() {
            this.loading = true;
            this.getTipoRegistros();
            this.getDisciplinas();
            this.loading = false;
        },
        methods: {
            resetForm: function resetForm() {
                this.$refs.form.reset();
                this.data_inicio_formatted = moment(new Date()).format("DD/MM/YYYY"),
                this.data_fim_formatted = moment(new Date()).format("DD/MM/YYYY"),
                this.registro.data_inicio = new Date().toISOString().split('T')[0];
                this.registro.data_fim = new Date().toISOString().split('T')[0];
                this.registro.user_id = sessionStorage.getItem('google_id');
                this.registro.createdBy = sessionStorage.getItem('id');
                this.registro.updatedBy = sessionStorage.getItem('id');
                this.registro.visibilidade = false;
                this.registro.is_em_sala = false;
                this.checkError = false;
                this.countCheckTouches = 0;
                this.fotos_registro = [];
                this.qtdes_aulas = [];
            },
            verificaFeed: function verificaFeed() { if (this.feed) { this.registro.visibilidade = true; } },
            preparaRequired: function preparaRequired() {
                this.resetRequired();
                if (this.registro.tipo_registro == this.TIPO_AULA_ID) {
                    this.requiredAula.disciplina = true;
                    this.rulesDisciplina = [v => !!v || 'O campo Disciplina é obrigatório.'];
                    this.requiredAula.turno = true;
                    this.rulesTurno = [v => !!v || 'O campo Turno é obrigatório.'];
                    this.requiredAula.turma = true;
                    this.rulesTurma = [v => !!v || 'O campo Turma é obrigatório.'];
                    this.requiredAula.aulas = true;
                } else if (this.registro.tipo_registro == this.TIPO_OUTRO_ID) {
                    this.requiredOutros.titulo = true;
                    this.rulesTitulo = [v => !!v || 'O campo Título é obrigatório.'];
                    this.requiredAula.turno = true;
                    this.rulesTurno = [v => !!v || 'O campo Turno é obrigatório.'];
                    this.requiredOutros.local = true;
                    this.rulesLocal = [v => !!v || 'O campo Local é obrigatório.'];
                } else {
                    this.requiredAula.turno = true;
                    this.rulesTurno = [v => !!v || 'O campo Turno é obrigatório.'];
                    this.requiredOutros.local = true;
                    this.rulesLocal = [v => !!v || 'O campo Local é obrigatório.'];
                }   
                this.$forceUpdate();
            },
            fixFilepath: function fixFilepath(filepath) {
                return filepath.replace("/",'___');
            },
            getRegistro: function getRegistro(id){
                this.dialog = true;
                this.loading = true;
                this.$http.get('http://localhost:3000/registros/id/'+id)
                .then((result) => { 
                    this.registro = result.data;                    
                    var init = this.registro.data_inicio.split('T')[0];
                    this.registro.data_inicio = init;
                    var end = this.registro.data_fim.split('T')[0];
                    this.registro.data_fim = end;
                    this.formatDate(this.registro.data_inicio,'inicio');
                    this.formatDate(this.registro.data_fim,'fim');
                    this.$http.get('http://localhost:3000/aulas-registros/'+id)
                    .then((res_aulas) => {
                        var aulas = res_aulas.data;
                        for (let i=0; i<aulas.length; i++) { this.qtdes_aulas.push(aulas[i].aula.toString()); }
                        this.$http.get('http://localhost:3000/registros-fotos/'+id)
                        .then((res_fotos) => {
                            var fotos = res_fotos.data;
                            this.fotos_registro = fotos;
                        });
                    });
                    this.loading = false;
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            getTipoRegistros: function getTipoRegistros(){
                this.$http.get('http://localhost:3000/tipos-registros/')
                .then((result) => { 
                    this.tipos_registros = result.data;
                    for (let i=0; i<this.tipos_registros.length;i++) {
                        if (this.tipos_registros[i].nome == "Aula") {
                            this.TIPO_AULA_ID = this.tipos_registros[i].id;
                        } else if (this.tipos_registros[i].nome == "Outro") {
                            this.TIPO_OUTRO_ID = this.tipos_registros[i].id;
                        }
                    }
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            getDisciplinas: function getDisciplinas(){
                this.$http.get('http://localhost:3000/disciplinas/')
                .then((result) => { 
                    this.disciplinas = result.data;
                    for (let i=0; i<this.disciplinas.length;i++) {
                        if (this.disciplinas[i].nome == "Outro") {
                            this.DISCIPLINA_OUTRO_ID = this.disciplinas[i].id;
                        }
                    }
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            requiredNomeDisciplina: function requiredNomeDisciplina() {
                if (this.registro.disciplina == this.DISCIPLINA_OUTRO_ID) {
                    this.requiredAula.disciplinaNome = true;
                    this.rulesDisciplinaNome = [v => !!v || 'O campo Nome da disciplina é obrigatório.'];
                } else {
                    this.requiredAula.disciplinaNome = false;
                    this.rulesDisciplinaNome = null;
                }
            },
            formatDate: function formatDate(data,type) {
                if (data != null) {
                    if (type == 'inicio') { this.data_inicio_formatted = moment(data).format("DD/MM/YYYY");
                    } else { this.data_fim_formatted = moment(data).format("DD/MM/YYYY"); }
                }
            },
            countTouch: function countTouch() { this.countCheckTouches = this.countCheckTouches+1; },
            checkCheckboxes: function checkCheckboxes() {
                if (this.registro.tipo_registro == this.TIPO_AULA_ID) {
                    var total = this.qtdes_aulas.filter(Boolean).length
                    if (total > 0) { 
                        this.checkError = false;
                        return true;
                    } else if (this.countCheckTouches > 0) { 
                        this.checkError = true;
                        return false;
                    } else { return true; }
                } else { return true; }
            },
            verificarSubmit: function verificarSubmit(){
                if (this.registro.id) { this.editarRegistro(); }
                else { this.salvarRegistro(); }
            },
            resetRequired: function resetRequired(){
                this.requiredAula = [{'disciplina':false,'turno':false,'turma':false,'aulas':false,'disciplinaNome':false}];
                this.requiredOutros = [{'titulo':false,'local':false}];
                this.rulesDisciplina = null;
                this.rulesDisciplinaNome = null;
                this.rulesTurno = null;
                this.rulesTurma = null;
                this.rulesAulas = null;
                this.rulesTitulo = null;
                this.rulesLocal = null;
            },
            salvarRegistro: function salvarRegistro() {
                this.loading = true;
                this.$http.post('http://localhost:3000/registros/',this.registro)
                .then((result) => {
                    var novoObj = result.data;
                    for (let i=0; i<this.qtdes_aulas.length; i++) {
                        this.$http.post('http://localhost:3000/aulas-registros/',{'registro_id':novoObj.id, 'aula':this.qtdes_aulas[i]})
                    }
                    if (this.arquivos.length > 0) {
                        let formData = new FormData();
                        formData.append('registro_id', novoObj.id);
                        for( var i = 0; i < this.arquivos.length; i++ ){
                            let file = this.arquivos[i];
                            formData.append('files[' + i + ']', file);
                        }
                        this.$http.post('http://localhost:3000/registros-fotos/',formData,{
                            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
                        });
                    }
                    this.dialog = false;
                    this.resetForm();
                    this.loading = false;
                    if (this.feed) { this.$root.$refs.Feed.getRegistros(); }
                    else { this.$root.$refs.Registros.getRegistros(); }
                });
            },
            preDeleteFoto: function preDeleteFoto(index) {
                this.pre_delete_index = parseInt(index);
                this.dialogDeleteFoto = true;
            },
            deleteFotoRegistro: function deleteFotoRegistro() {
                this.loading = true;
                var id = this.fotos_registro.fotos[this.pre_delete_index].id;
                var path = this.fotos_registro.fotos[this.pre_delete_index].filepath;
                this.fotos_registro.fotos.splice(this.pre_delete_index);
                this.$http.delete('http://localhost:3000/registros-fotos/'+id+'/'+this.fixFilepath(path))
                .then(() => {
                    this.$root.$refs.App.openSnackbar('Foto removida com sucesso.');
                    this.loading = false;
                    this.dialogDeleteFoto = false;
                });
            },
            editarRegistro: function editarRegistro() {
                this.loading = true;
                this.$http.put('http://localhost:3000/registros/'+this.registro.id,this.registro)
                .then(() => {
                    console.log(this.qtdes_aulas);
                    var qtde_aulas = this.qtdes_aulas
                    this.$http.put('http://localhost:3000/aulas-registros/'+this.registro.id)
                    .then(() => {
                        console.log(qtde_aulas);
                        for (let i=0; i<qtde_aulas.length; i++) {
                            this.$http.post('http://localhost:3000/aulas-registros/',{'registro_id':this.registro.id, 'aula':qtde_aulas[i]})
                        }
                    });
                    if (this.arquivos.length > 0) {
                        let formData = new FormData();
                        formData.append('registro_id', this.registro.id);
                        for( var i = 0; i < this.arquivos.length; i++ ){
                            let file = this.arquivos[i];
                            formData.append('files[' + i + ']', file);
                        }
                        this.$http.post('http://localhost:3000/registros-fotos/',formData,{
                            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`
                        });
                    }
                    this.dialog = false;
                    this.resetForm();
                    this.loading = false;
                    if (this.feed) { this.$root.$refs.Feed.getRegistros(); }
                    else { this.$root.$refs.Registros.getRegistros(); }
                });
            },
            verificarPermissaoInterna: function verificarPermissaoInterna(nome) {
                if (nome != null) { return this.$root.$refs.App.verificarPermissaoInterna(nome); }
                else { return false; }
            }
        }
    }
</script>

<style>
    .form-dialog-margin{ margin-top: 1.5rem; }
    .title-dialog-full {
        background-color: #3949AB;
        color: white;
    }
    .inline-flex { 
        display: inline-flex !important;
        margin-right: 1rem;
    }
    .photo-divider {
        margin-top: 1rem;
    }
    .error_checkbox {
        margin-top: -1rem;
        font-size: 0.8rem;
        color: red;
        margin-left: 0.2rem;
    }
    .top-loading {
        position: absolute;
        top: 68px;
    }
</style>