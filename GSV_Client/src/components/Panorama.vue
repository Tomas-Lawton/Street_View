
<script>
import StreetView from './StreetView.vue';

export default {
  name: 'PanoramaContainer',
  components: {
    StreetView
  },
  props: {
    mapRef: Object,
    isUser: Boolean,
    markers: Array,
    userPosition: Object,
    userPov: Object,
    willUpdate: Boolean,
    updatePov: Function,
    updatePosition: Function
  },
  emits: ['markerChanged'],
  computed: {
    panoStyle() {
      return {
        "width": this.isUser ? "100%"
          : "50vw", "height": "100vh"
      }
    },
  },
  methods: {
    handleMarkerChange(event, id) {
      this.$emit('markerChanged', event, id);
    },
  },
};
</script>

    <!-- TO DO unpack this component !!!!! -->

<template>
  <section :style="panoStyle" id="pano-container">
    <StreetView :map="mapRef" :isUser="isUser" :markers="markers" :userPosition="userPosition" :userPov="userPov"
      :willUpdate="willUpdate" :updatePov="updatePov" :updatePosition="updatePosition"
      @markerChanged="handleMarkerChange"/>
  </section>
</template>
