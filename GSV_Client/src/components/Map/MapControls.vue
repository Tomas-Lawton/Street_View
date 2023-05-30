  <script>
  export default {
    props: {
      showDropdown: Boolean,
      menuPosition: Object,
      createMarker: Function,
      showRemove: Boolean,
      isUser: Boolean
    },
    methods: {
      deleteMarker() {
        // Implement the deleteMarker functionality
      },
      setMap(show) {
        // Implement the setMap functionality
      },
      goHome() {
        // Implement the goHome functionality
      },
      clearMarkers() {
        // Implement the clearMarkers functionality
      }
    },
    computed: {
      deleteButtonStyle() {
        return {
          left: this.menuPosition.x + 'px',
          top: this.menuPosition.y + 'px'
        };
      }
    }
  };
  </script>
  

  <template>
    <div>
      <MarkerDropdown v-if="showDropdown" :menuPosition="menuPosition" :createMarker="createMarker" />
      <button class="delete-button" v-if="showRemove" @click="deleteMarker" :style="deleteButtonStyle">
        Remove
        <i class="window close icon"></i>
      </button>
      <div class="container-map-icon open-map" v-if="!showMap && isUser">
        <button @click="setMap(true)" class="ui active">
          <i class="map pin icon"></i>
        </button>
      </div>
      <div class="container-moderator-buttons" v-if="!isUser">
        <button @click="goHome" class="ui follow-button active">
          <i class="home icon"></i>
        </button>
        <button @click="clearMarkers" class="ui follow-button active">
          <i class="map marker alternate icon"></i>
        </button>
      </div>
    </div>
  </template>
  