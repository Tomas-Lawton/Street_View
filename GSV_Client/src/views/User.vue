<script>

import LocationInput from "../components/LocationInput.vue";
import MapContainer from "../components/MapContainer.vue";

export default {
  name: 'User-View',
  components: {
    MapContainer,
    LocationInput
  }
}

</script>

<template class="user">
  <LocationInput />
  <MapContainer :isUser=true key="user">
  </MapContainer>
</template>
