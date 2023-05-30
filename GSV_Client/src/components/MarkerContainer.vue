<script>

import { defineComponent, h } from 'vue'
import FBXExample from "@/components/FBXExample.vue"

import { createApp } from "troisjs";
import { store } from '@/store'

export default {
  name: "MarkerContainer",
  props: {
    node: Object,
    position: Object,
    modelPath: String,
  },
  data() {
    return {
      threeOverlayInstance: null,
      comp: null,
      isVisible: true
    }
  },
  methods: {
    checkRenderDistance() {
      if (this.calcHaversineDistance > 80) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
      }
    }
  },
  mounted() {
    this.comp = createApp({
      render: () => h(FBXExample, { //virtual dom node
        modelPath: this.modelPath
      })
    });
    // this.comp.mount(this.$refs.markerContainer);
    // this.$refs.markerContainer.style.top = '-100px';
    // this.$refs.markerContainer.style.left = '-150px';
    // this.$refs.markerContainer.style.position = 'absolute';
    
    this.comp.mount(this.node);
    this.node.style.top = '-100px';
    this.node.style.left = '-150px';
    this.node.style.position = 'absolute';

    this.checkRenderDistance();
  },
  beforeUnmount() {
    this.comp.unmount()
    this.comp = null
  },
  computed: {
    calcHaversineDistance() {
      const userPosition = this.$store.state.user.position;
      const markerPosition = this.position;
      const lat1 = userPosition.lat;
      const lon1 = userPosition.lng;
      const lat2 = markerPosition.lat;
      const lon2 = markerPosition.lng;

      if ((lat1 === lat2) && (lon1 === lon2)) {
        return 0;
      } else {
        const radlat1 = Math.PI * lat1 / 180;
        const radlat2 = Math.PI * lat2 / 180;
        const theta = lon1 - lon2;
        const radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1609.344; // long live the metric system
        return dist;
      }
    },
  }
}

</script>

<template>
  <div v-if="isVisible" id="marker-container" ref="markerContainer"></div>
  <div id="test_computed"> {{ calcHaversineDistance }} meters </div>
</template>

<style>

#test_computed {
  position: absolute;
  z-index: 12;
  background-color: white;
  bottom: 10px;
  left: 50%;
  width: 50%;
  transform: translateX(-50%);
}

</style>