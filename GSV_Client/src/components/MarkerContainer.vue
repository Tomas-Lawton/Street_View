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
    }
  },
  methods: {
    checkRenderDistance() {
      if (this.calcDistance > 80) { // invisible after 80m
          this.node.style.visibility = "hidden"
        } else {
          this.node.style.visibility = "visible";
        }
    },
    haversineDistance(lat1, lon1, lat2, lon2, unit) {
      if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
      } else {
        let radlat1 = Math.PI * lat1 / 180;
        let radlat2 = Math.PI * lat2 / 180;
        let theta = lon1 - lon2;
        let radtheta = Math.PI * theta / 180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
          dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1609.344; // long live the metric system
        this.checkRenderDistance();
        return dist;
      }
    },
  },
  mounted() {
    this.comp = createApp({
      render: () => h(FBXExample, {
        modelPath: this.modelPath
      })
    });
    this.comp.mount(this.node);
    this.node.style.top = '-100px'
    this.node.style.left = '-150px'
    this.node.style.position = 'absolute'

    // distance at 1 meter
    this.node.style.width = 100 + "px";
    this.node.style.height = 100 + "px";

    // if (this.calcDistance > 1) { // largest size allowed
    //   // assuming linear scale factor 
    //   this.node.width = 100 / this.calcDistance;
    //   this.node.height = 100 / this.calcDistance;
    // }

    this.checkRenderDistance();
  },
  beforeUnmount() {
    this.comp.unmount()
    this.comp = null
  },
  computed: {
    calcDistance() {
      return this.haversineDistance(
        store.state.user.position.lat, store.state.user.position.lng, 
        this.position.lat, this.position.lng
      )
    }
  }
}

</script>

<template>
  <div id="test_computed"> {{ calcDistance }} meters </div>
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