<script>

import FBXExample from "@/components/FBXExample.vue"

import { defineComponent, h } from 'vue'
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
      if (this.haversineDistance > 80) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
      }
    },
    calculateScale() {
      // maps does not scale marker fast enough, so this makes the scaling a bit faster.
      const ratio = 20; // the higher number, the closer it will be to the maps default until they are the same.
      const meters = this.calcDistance;
      const maxSize = 0.8; // this is so when you are really close, the animation is not a giant
      const scale = Math.min(ratio / meters, maxSize);
      this.node.style.transform = `scale(${scale})`;
      console.log(`item ${meters} meters away to scaled to size ${scale}`)
    }
  },
  computed: {
    calcDistance() {
      const userPosition = this.$store.state.user.position;
      const markerPosition = this.position;
      const lat1 = userPosition.lat;
      const lon1 = userPosition.lng;
      const lat2 = markerPosition.lat;
      const lon2 = markerPosition.lng;

      // haverstine
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
  },
  mounted() {
    this.comp = createApp({
      render: () => h(FBXExample, { //virtual dom node
        modelPath: this.modelPath
      })
    });
    this.comp.mount(this.node);
    this.node.style.top = '-100px';
    this.node.style.left = '-150px';
    this.node.style.position = 'absolute';
    console.log(this.modelPath)
    this.calculateScale();
    this.checkRenderDistance();
  },
  beforeUnmount() {
    this.comp.unmount()
    this.comp = null
  },
  watch: {
    calcDistance() {
      console.log("scaling")
      this.calculateScale();
      this.checkRenderDistance();
    }
  }
}

</script>

<template></template>
