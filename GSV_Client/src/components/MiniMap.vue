  
<script>
import { ref } from 'vue';

export default {
    props: {
        isUser: Boolean,
        startingPosition: Object,
        markers: Array,
    },
    methods: {
        hideMap() {
            this.$parent.setMap(false)
        },
        hideMenus() {
            this.$parent.hideMenus();
        },
        mapClickEvent(event) {
            this.$parent.mapClickEvent(event)
        },
        selectMarker(event, index) {
            this.$parent.selectMarkerEvent(event, index)
        },
        handleDragEnd(event, index) {
            this.$parent.markerChangedEvent($event, index)
        }
    },
    computed: {
        mapStyle() {
            return this.isUser ? {
                "width": "20vw",
                "height": "20vw",
                "position": "absolute",
                "z-index": "20",
                "bottom": "0px",
                "left": "0px",
                "transform": "translateX(10px) translateY(-10px)",
                "box-shadow": "rgba(0, 0, 0, 0.3) 0px 1px 4px -1px"
            } :
                {
                    "width": "50vw",
                    "height": "100vh"
                }
        },
    },
    data() {

        return {
            options: {
                mapTypeControl: false,
                fullscreenControl: false,
            },
        }
    },
    mounted() {
        this.mapRef = this.$refs.mapRef;
    },
};
</script>

<template>
    <section :style="mapStyle" id="map-container">
        <div class="container-map-icon close-map" v-if="isUser">
            <button @click="hideMap()" class="ui active">
                <i class="close icon"></i>
            </button>
        </div>
        <GMapMap ref="mapRef" :center="startingPosition" :zoom="40" map-type-id="terrain" @click="mapClickEvent"
            :options="options" @dragstart="hideMenus">
            <GMapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true"
                :draggable="true" @click="selectMarker" @dragend="handleDragEnd" />
        </GMapMap>
    </section>
</template>
  