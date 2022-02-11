<template>
    <v-dialog v-model="carouselDialog" width="500">
        <v-card>
            <v-carousel :show-arrows="verifyArrows(fotosDialog.length)" class="card-media-dialog" hide-delimiters v-if="fotosDialog.length > 0">
                <v-carousel-item v-for="(item,i) in fotosDialog" :key="i"
                :src="'http://localhost:1337/registros-fotos/foto/'+fixFilepath(item.filepath)"
                ></v-carousel-item>
            </v-carousel>
        </v-card>
    </v-dialog>
</template>

<script>
  export default {
    name: 'RegistroFotoDialog',

    props: ['fotosDialog'],

    created() {
        this.$root.$refs.RegistroFotoDialog = this;
    },

    data: () => ({
        carouselDialog: false,
    }),

    methods: {
        verifyArrows: function verifyArrows(len) {
            if (len > 1) { return true; } else { return false; }
        },
        fixFilepath: function fixFilepath(filepath) {
            return filepath.replaceAll("/",'___');
        },
    }
  }
</script>

<style>
    .card-media-dialog { height: 80% !important; }
</style>