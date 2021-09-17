<template>
    <v-carousel class="card-media-height" :show-arrows="verifyArrows(registro.fotos.length)" hide-delimiters v-if="registro.fotos.length > 0">
        <v-carousel-item @click="openBigCarousel(registro.fotos)" v-for="(item,i) in registro.fotos" :key="i"
        :src="'http://localhost:3000/registros-fotos/foto/'+fixFilepath(item.filepath)"
        ></v-carousel-item>
    </v-carousel>
</template>

<script>
  export default {
    name: 'RegistroCardCarousel',

    props: ['registro','feed'],

    created() {
        this.$root.$refs.RegistroCardCarousel = this;
    },

    methods: {
        verifyArrows: function verifyArrows(len) { if (len > 1) { return true; } else { return false; } },
        fixFilepath: function fixFilepath(filepath) { return filepath.replace("/",'___'); },
        openBigCarousel: function openBigCarousel(fotos) {
            if (this.feed) { this.$root.$refs.Feed.fotosDialog = fotos; }
            else { this.$root.$refs.Registros.fotosDialog = fotos; }
            this.$root.$refs.RegistroFotoDialog.carouselDialog = true;
        },
    }
  }
</script>

<style>
    .card-media-height { height: 15rem !important; }
</style>