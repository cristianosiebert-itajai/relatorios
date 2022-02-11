<template>
    <span>
        <v-card-title v-if="registro.tipo_registro == 1">
            <span v-if="registro.disciplina != 11">{{getDisciplinaName(registro.disciplina)}} - {{registro.turma}}</span>
            <span v-if="registro.disciplina == 11">{{registro.disciplina_titulo}} - {{registro.turma}}</span>
        </v-card-title>
        <v-card-title v-if="registro.tipo_registro != 1">
            <span v-if="registro.tipo_registro != 6">{{registro.local}}</span>
            <span v-if="registro.tipo_registro == 6">{{registro.titulo_outro}}</span>
        </v-card-title>
        <v-card-subtitle style="font-size: 0.8rem; font-weight: 300;">
            <v-icon small class="icon-fix-space">{{getTipoIcon(registro.tipo_registro)}}</v-icon> {{getFormattedDate(registro.data_inicio)}} <span v-if="registro.data_fim != registro.data_inicio">- {{getFormattedDate(registro.data_fim)}}</span> - {{getTurnoName(parseInt(registro.turno))}}
        </v-card-subtitle>
        <v-card-text>
            <p v-if="registro.is_em_sala == true">Aula realizada em sala.</p>
            <p>
                <pre>{{registro.descricao}}</pre>
            </p>
        </v-card-text>
    </span>
</template>

<script>
    import moment from 'moment/src/moment';
    export default {
        name: 'RegistroCardBody',

        props: ['registro'],

        beforeMount() {
            this.$root.$refs.AppBar.showLoading();
            this.getDisciplinas();
            this.$root.$refs.AppBar.hideLoading();
        },

        data: () => ({
            disciplinas: [],
            turnos: [{id:1,nome:'Matutino'},{id:2,nome:'Vespertino'},{id:3,nome:'Noturno'},{id:4,nome:'Integral'}],
        }),

        methods: {
            getDisciplinas: function getDisciplinas() {
                this.$http.get('http://localhost:1337/disciplinas/')
                .then((result) => { 
                    this.disciplinas = result.data;
                }, () => { this.$root.$refs.App.openSnackbar("Houve um erro, favor tentar novamente mais tarde."); });
            },
            getDisciplinaName: function getDisciplinaName(id) {
                var nome = '';
                for (let i=0; i<this.disciplinas.length; i++) {
                    if (this.disciplinas[i].id == id) { nome = this.disciplinas[i].nome; }
                }
                return nome;
            },
            getFormattedDate: function getFormattedDate(date) { return moment(date).format('DD/MM/YYYY'); },
            getTipoIcon: function  getTipoIcon(tipo) {
                switch (tipo) {
                    case 1: return 'school';
                    case 2: return 'help';
                    case 3: return 'engineering';
                    case 4: return 'checklist';
                    case 5: return 'code';
                    case 6: return 'other_houses';
                }
            },
            getTurnoName: function getTurnoName(id) {
                var nome = '';
                for (let i=0; i<this.turnos.length; i++) {
                    if (this.turnos[i].id == id) { nome = this.turnos[i].nome; }
                }
                return nome;
            },
        }
    }
</script>

<style>
    .icon-fix-space { margin-right: 0.3rem; }
    pre {
        white-space: pre-wrap;       /* Since CSS 2.1 */
        white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
        white-space: -pre-wrap;      /* Opera 4-6 */
        white-space: -o-pre-wrap;    /* Opera 7 */
        word-wrap: break-word;       /* Internet Explorer 5.5+ */
        font-family: Roboto;
    }
</style>