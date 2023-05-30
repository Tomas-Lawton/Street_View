<script>

import { useStore } from 'vuex';
import { computed, ref } from 'vue';

import StreetView from "@/components/StreetView.vue";
import ModeratorMode from "@/components/ModeratorMode.vue";
import SocketioService from "../services/socket";
import SelectDropdown from "@/components/SelectDropdown.vue";
import LocationInput from "@/components/LocationInput.vue";
import MiniMap from "@/components/MiniMap.vue";
import Panorama from "@/components/Panorama.vue";

export default {
  name: 'SessionContainer',
  components: {
    StreetView, SelectDropdown, ModeratorMode, LocationInput, Panorama, MiniMap
  },
  props: {
    position: Object,
    isUser: Boolean
  },
  setup() {
    const store = useStore();
    const userPosition = computed(() => store.state.user.position);
    const userPov = computed(() => store.state.user.pov);

    return {
      userPosition,
      userPov,
      updatePosition: (data) => store.commit('updateUserPosition', data),
      updatePov: (data) => store.commit('updateUserPov', data),
    };
  },
  computed: {
    sessionKey() {
      return this.isUser ? "user" : "moderator"
    },
    willUpdate() {
      return (this.selectedMode !== "Free") // Ignores the free mode
    },
    willFollow() {
      return (this.selectedMode === "Controlling" && this.isUser)
        || (this.selectedMode === "Following" && !this.isUser)
    },

  },
  data() {
    return {
      markers: [],
      mapRef: null,
      isLoaded: false,
      showDropdown: false,
      menuPosition: {
        x: 0,
        y: 0
      },
      newMarkerPosition: {
        lat: 0,
        lng: 0
      },
      showRemove: false,
      selectedMarker: null,
      showMap: true,
      selectedMode: "Controlling",
      startingPosition: this.userPosition
    }
  },
  methods: {
    setMap(event) {
      this.showMap = event;
    },
    hideMenus() {
      this.showRemove = false;
      this.showDropdown = false;
    },
    mapClickEvent(event) {
      if (!this.isUser) {
        this.showRemove = false;
        this.newMarkerPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        }
        this.menuPosition = {
          x: event.domEvent.pageX,
          y: event.domEvent.pageY
        }
        this.showDropdown = true;
      }
    },
    selectMarkerEvent(event, index) {
      if (!this.isUser) {
        // delete + change animation?
        this.showRemove = true;
        this.showDropdown = false;
        const { left, top, width, height } = event.domEvent.target.getBoundingClientRect();
        this.menuPosition = {
          x: left + width / 2,
          y: top + height
        }
        this.selectedMarker = index;
      } else {
        alert("Moderator Only :)")
      }
    },
    markerChangedEvent(event, id) {
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };

      if (!this.isUser) {
        this.markers[id].position = position;
        console.log(this.markers[id].position)
        if (SocketioService.socket) {
          SocketioService.socket.emit('reposition', { position, id });
        }
      }
    },
    createMarker(event) {
      const markerData = {
        model: event.name,
        position: this.newMarkerPosition
      }
      this.markers.push(markerData)
      if (SocketioService.socket) {
        SocketioService.socket.emit('marker', markerData);
      }
      this.showDropdown = false;
    },
    deleteMarker() {
      const index = this.selectedMarker;
      this.markers.splice(index, 1);
      if (SocketioService.socket) {
        SocketioService.socket.emit('delete', { index });
      }
      this.selectedMarker = null;
      this.showRemove = false;
    },
    setFollowMode(setMode) {
      this.selectedMode = setMode;
      if (SocketioService.socket) {
        SocketioService.socket.emit('controlling', this.selectedMode);
        if (this.selectedMode !== "Free") {
          SocketioService.socket.emit('position', this.userPosition);
          SocketioService.socket.emit('pov', this.userPov);
        }
      }
    },
    goHome() {
      this.updatePosition({
        lat: -33.8985415, lng: 151.169633
      })
    },
    clearMarkers() {
      this.markers = [];
      if (SocketioService.socket) {
        console.log("clearing markers")
        SocketioService.socket.emit('clear');
      }
    },
  },
  mounted() {
    this.$refs.miniMapRef.mapRef.$mapPromise.then((mapObject) => {
      console.log("loaded mini map")
      this.isLoaded = true
      this.mapRef = this.$refs.miniMapRef.mapRef
    });

    const socket = SocketioService.setupSocketConnection(this.isUser);

    socket.on('controlling', (data) => {
      console.log('Received controlling event:', data);
      this.selectedMode = data
      console.log(this.isUser)
    });
    socket.on('position', (data) => {
      if (this.willFollow) {
        console.log('Received position event:', data);
        this.updatePosition({
          lat: data.lat,
          lng: data.lng
        })
      }
    });
    socket.on('pov', data => {
      if (this.willFollow) {
        console.log('Received pov event:', data);
        data.zoom = this.isUser ? .5 : 1.5;
        this.updatePov(data)
      }
    });
    socket.on('marker', (data) => {
      console.log('Received marker event:', data);
      this.markers.push(data);
      console.log(this.markers)
    });
    socket.on('delete', (data) => {
      if (this.isUser) {
        console.log('Received marker event:', data);
        this.markers.splice(data.index, 1);
        console.log(this.markers)
      }
    });
    socket.on('reposition', (data) => {
      if (this.isUser) {
        this.markers[data.id].position = data.position
      }
    });
    socket.on('clear', () => {
      if (this.isUser) {
        console.log('Received marker event');
        this.markers = [];
        console.log(this.markers)
      }
    });

    let setPov = this.userPov;
    setPov.zoom = this.isUser ? .5 : 1.5;
    this.updatePov(setPov)
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>

<template :class="sessionKey">
  <div id="map_wrapper">

    <LocationInput />
    <ModeratorMode v-if="!isUser" :setFollowMode="setFollowMode" />




    <!-- Map Controls -->
    <SelectDropdown v-if="showDropdown" :menuPosition="menuPosition" :createMarker="createMarker" />
    <button class="delete-button" v-if="showRemove" @click="deleteMarker" :style="{
        left: menuPosition.x + 'px',
        top: menuPosition.y + 'px'
      }">Remove
      <i class="window close icon"></i>
    </button>
    <div class="container-map-icon open-map" v-if="!showMap && isUser">
      <button @click="() => setMap(true)" class="ui active"><i class="map pin icon"></i></button>
    </div>
    <div class="container-moderator-buttons" v-if="!isUser">
      <button @click="goHome" class="ui follow-button active"><i class="home icon"></i></button>
      <button @click="clearMarkers" class="ui follow-button active"><i class="map marker alternate icon"></i></button>
    </div>

    <MiniMap v-if="showMap" :isUser="isUser" :startingPosition="startingPosition" :markers="markers" ref="miniMapRef" />

    <Panorama v-if="isLoaded" :mapRef="mapRef" :isUser="isUser" :markers="markers" :userPosition="userPosition"
      :userPov="userPov" :willUpdate="willUpdate" :updatePov="updatePov" :updatePosition="updatePosition" />

  </div>
</template>

<style>
#map_wrapper {
  display: flex;
}

.gm-style-cc {
  display: none;
}

.gm-style div a img {
  display: none;
}


.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

#map-container .vue-map-container {
  height: 100%;
}

.vue-map {
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 5px;
}

.container-follower {
  position: absolute;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: end;
}



.container-moderator-buttons {
  position: absolute;
  z-index: 12;
  display: flex;
  align-items: center;
  bottom: 0;
  left: 0;
}

.container-moderator-buttons button {
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 5px;
}

.container-map-icon {
  position: absolute;
  position: absolute;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: end;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border-radius: 2px;
  width: 40px;
  height: 40px;
  margin: 10px;
  bottom: 0;
  left: 0;
}

.container-map-icon button {
  width: 100%;
  height: 100%;
  border: none;
  cursor: pointer;
  /* border-radius: 2px; */
  border-radius: 5px;
}

.close-map button {
  background-color: rgb(255, 255, 255);
}

.open-map button {
  background: #222222;
  color: #8f8f8f8f;
}

.open-map button:hover i {
  color: #ffffff;
  transition: .6s;
}

.container-map-icon button i {
  color: #666666;
  margin: 0;
  font-size: 1.6em;
}

.follow-button {
  margin: 10px 0 10px 10px;
  background: #ffffff;
  color: #222222;
  cursor: pointer;
  display: inline-block;
  min-height: 1em;
  font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  padding: 0.78571429em 1.5em 0.78571429em;
  font-weight: 600;
  line-height: 1em;
  font-style: normal;
  text-align: center;
  text-decoration: none;
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  border: none;
  transition: .6s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

i.home.icon,
i.marker.icon {
  margin: 0;
}

.active.follow-button {
  background: #222222;
  /* color: #fff; */
  color: #b3b3b3;
}

.active.follow-button:hover {
  background: #222222;
  color: #fff;
}

.delete-button {
  background-color: rgb(255, 87, 87);
  width: 110px;
  height: 40px;
  position: absolute;
  border-radius: 5px;
  color: rgb(242, 242, 242);
  border: none;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  font-weight: 600;
  transition: background-color .6s;
  cursor: pointer;
  transform: translate(-50%, -5px);
  z-index: 30;
}

.delete-button:hover {
  background-color: rgb(255, 119, 119);
  color: white;
}

.delete-button i {
  color: rgb(242, 242, 242);
  transition: color .6s;
}

.delete-button:hover i {
  color: white;
}
</style>