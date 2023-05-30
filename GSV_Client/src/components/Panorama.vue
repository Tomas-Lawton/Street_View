
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
  computed: {
    panoStyle() {
      return {
        "width": this.isUser ? "100%"
          : "50vw", "height": "100vh"
      }
    },
  }
};
</script>

<template>
  <section :style="panoStyle" id="pano-container">
    <!-- TO DO unpack this component -->
    <StreetView :map="mapRef" :isUser="isUser" :markers="markers" :userPosition="userPosition"
      :userPov="userPov" :willUpdate="willUpdate" :updatePov="updatePov" :updatePosition="updatePosition" />
  </section>
</template>
