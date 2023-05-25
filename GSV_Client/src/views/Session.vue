<script>

import { computed } from "vue";
import LocationInput from "../components/LocationInput.vue";
import MapContainer from "../components/MapContainer.vue";

export default {
  name: 'Session',
  props: { 
    isUser: Boolean 
  },
  components: {
    MapContainer,
    LocationInput
  },
  computed: {
    sessionKey() {
      return this.isUser ? "user" : "moderator"
    } 
  },
}

</script>

<template :class="sessionKey">
  <LocationInput />
  <MapContainer :isUser="isUser" :key="sessionKey">
  </MapContainer>
</template>