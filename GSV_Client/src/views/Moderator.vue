<script>

import LocationInput from "../components/LocationInput.vue";
import MapContainer from "../components/MapContainer.vue";

export default {
  name: 'Moderator-View',
  components: {
    MapContainer,
    LocationInput
  },
}

</script>

<template class="moderator">
  <LocationInput />
  <MapContainer :isUser=false key="moderator">
  </MapContainer>
</template>