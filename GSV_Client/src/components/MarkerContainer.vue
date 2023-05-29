
/* eslint-disable no-undef */
<script>

import { defineComponent, h } from 'vue'
//import ThreeOverlay from "@/components/ThreeOverlay";
//import Model from "@/components/Model";
import FBXExample from "@/components/FBXExample.vue"

import { createApp } from "troisjs";
import { store } from '@/store'

export default {
  name: "MarkerContainer",
  props: {
    node: Object,
    position: Object,
    modelPath: String
  },
  data() {
    return {
      threeOverlayInstance: null,
      comp: null,
    }
  },
  methods: {
    distance(lat1, lon1, lat2, lon2, unit) {
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
        if (unit == "K") {
          dist = dist * 1.609344
        }
        if (unit == "N") {
          dist = dist * 0.8684
        }
        console.log(dist)
        return dist;
      }
    },
  },
  mounted() {
    console.log('rendered model')
    console.log(this.position)


    this.comp = createApp({
      render: () => h(FBXExample, {
        modelPath: this.modelPath // Pass modelPath prop to FBXExample component
      })
    });
    this.comp.mount(this.node);
    const markerNode = this.node;

    markerNode.style.top = '-100px'
    markerNode.style.left = '-150px'
    markerNode.style.position = 'absolute'
  },
  beforeUnmount() {
    this.comp.unmount()
    this.comp = null
    //console.log('unmount', this.node)
  },
  computed: {
    calcDistance() {
      console.log('calculating')
      const { lat, lng } = store.state.user.position;
      if (!(isNaN(this.position.lat) || isNaN(this.position.lng))) {
        const dist = this.distance(lat, lng, this.position.lat, this.position.lng)
        console.log("DISTANCE", dist)
        return dist;
      } 
    }
  }
}

</script>

<!-- Todo -->
<template>
  <div id="test_computed"> {{ calcDistance }} </div>
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