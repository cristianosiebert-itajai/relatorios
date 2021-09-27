<template>
    <v-row class="top-row-margin">
        <v-menu ref="menu" v-model="menu" :close-on-content-click="true" :return-value.sync="picker" 
        transition="slide-y-transition" offset-y max-width="290px" min-width="auto">
            <template v-slot:activator="{on}">
                <v-btn v-on="on">{{ picker_label }}</v-btn>
            </template>
            <v-date-picker @input="setCurrentMonth()" class="month-picker" v-model="picker" type="month" locale="pt-br"></v-date-picker>
        </v-menu>
        <v-spacer class="spacer-controls"></v-spacer>
        <v-btn class="btn-controls" icon @click="changeNumColumns(1)"><v-icon v-bind:class="{ 'active_grid': grid_1 }">filter_1</v-icon></v-btn>
        <v-btn class="btn-controls" icon @click="changeNumColumns(2)"><v-icon v-bind:class="{ 'active_grid': grid_2 }">filter_2</v-icon></v-btn>
        <v-btn class="btn-controls" icon @click="changeNumColumns(3)"><v-icon v-bind:class="{ 'active_grid': grid_3 }">filter_3</v-icon></v-btn>
        <v-btn class="btn-controls" icon @click="changeNumColumns(4)"><v-icon v-bind:class="{ 'active_grid': grid_4 }">filter_4</v-icon></v-btn>
    </v-row>
</template>

<script>
    import moment from 'moment/src/moment';

    export default {
        name: 'ControlsRegistro',

        props: ['feed'],

        beforeMount() {
            this.setActiveColumn(parseInt(sessionStorage.getItem('num_columns')));
        },

        data: () => ({
            menu: false,
            picker: sessionStorage.getItem('current_month'),
            picker_label: moment(String(sessionStorage.getItem('current_month'))).format('MM/YYYY'),
            grid_1: false,
            grid_2: false,
            grid_3: false,
            grid_4: false,
        }),

        methods: {
            setCurrentMonth: function setCurrentMonth() {
                this.picker_label = moment(String(this.picker)).format('MM/YYYY');
                sessionStorage.setItem('current_month',this.picker);
                if (this.feed) { this.$root.$refs.Feed.getRegistros(); }
                else { this.$root.$refs.Registros.getRegistros(); }
            },
            changeNumColumns: function changeNumColumns(num) {
                sessionStorage.setItem('num_columns',num);
                if (this.feed) { this.$root.$refs.Feed.card_por_linha = new Array(parseInt(sessionStorage.getItem('num_columns'))); }
                else { this.$root.$refs.Registros.card_por_linha = new Array(parseInt(sessionStorage.getItem('num_columns'))); }
                this.setActiveColumn(num);
                if (this.feed) { this.$root.$refs.Feed.getRegistros(); }
                else { this.$root.$refs.Registros.getRegistros(); }
            },
            setActiveColumn: function setActiveColumn(num) {
                this.grid_1 = false;
                this.grid_2 = false;
                this.grid_3 = false;
                this.grid_4 = false;
                switch (num) {
                    case 1: this.grid_1 = true; break;
                    case 2: this.grid_2 = true; break;
                    case 3: this.grid_3 = true; break;
                    case 4: this.grid_4 = true; break;
                }
            },
        }
    }
</script>

<style>
    .top-row-margin { margin-bottom: 1rem; }
    .active_grid { color: #e91e63 !important; }
    @media (max-width: 350px) {
        .v-menu__content { left: 15px !important; }
    }
    @media (min-width: 351px) and (max-width: 400px) {
        .v-menu__content { left: 60px !important; }
    }
    @media (max-width: 600px) {
        .spacer-controls { display: none; }
        .btn-controls { display: none; }
    }
</style>