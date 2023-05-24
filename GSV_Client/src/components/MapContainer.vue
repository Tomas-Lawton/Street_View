<script>

import StreetView from "@/components/StreetView.vue";
import SelectDropdown from "@/components/SelectDropdown.vue";
import SocketioService from "../services/socket";
import { store } from '@/store'

export default {
  name: 'Map-Component',
  components: { StreetView, SelectDropdown },
  props: {
    position: Object,
    isUser: Boolean
  },
  computed: {
    mapStyle() {
      return this.isUser ? {
        "width": "20vw",
        "height": "20vw",
        "position": "absolute",
        "z-index": "20",
        "bottom": "0px",
        "left": "0px",
        "transform": "translateX(5px) translateY(-5px)",
      } :
        {
          "width": "50vw",
          "height": "100vh"
        }
    },
    panoStyle() {
      return {
        "width": this.isUser ? "100%"
          : "50vw", "height": "100vh"
      }
    },
    latLng() {
      return store.state.user.position
    },
    isFollowing() {
      return (this.isModeratorControlling && this.isUser) ||
        (!this.isModeratorControlling && !this.isUser)
    }
  },
  data() {
    return {
      markers: [],
      pov: {
        heading: 0,
        pitch: 0,
        zoom: this.isUser ? .5 : 1
      },
      mapRef: null,
      isLoaded: false,
      options: {
        mapTypeControl: false,
        fullscreenControl: false,
      },
      isModeratorControlling: true,
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
      selectedMarker: null
    }
  },
  methods: {
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
    markerChangedEvent(position, id) {
      console.log('changed marker')
      if (!this.isUser) {
        this.markers[id].position = position
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
    toggleFollow() {
      console.log("toggle")
      this.isModeratorControlling = !this.isModeratorControlling;
      if (SocketioService.socket) {
        console.log(this.isModeratorControlling)
        SocketioService.socket.emit('controlling', this.isModeratorControlling);
      }
    },
    goHome() {
      store.commit('updateUserPosition', {
            lat: -33.8985415, lng: 151.169633
      });
    },
    clearMarkers() {
      this.markers = [];
      if (SocketioService.socket) {
        console.log("clearing markers")
        SocketioService.socket.emit('clear');
      }
    }
  },
  mounted() {
    this.$refs.mapRef.$mapPromise.then((mapObject) => {

      this.isLoaded = true
      console.log("loaded")
      this.mapRef = this.$refs.mapRef

      mapObject.addListener("center_changed", () => {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
      });

    });

    const socket = SocketioService.setupSocketConnection(this.isUser);

    socket.on('controlling', (data) => {
      console.log('Received controlling event:', data);
      this.isModeratorControlling = data
      console.log(this.isUser)
    });
    socket.on('position', (data) => {
      if (this.isFollowing) {
        console.log('Received position event:', data);
        store.commit('updateUserPosition', {
          lat: data.lat,
          lng: data.lng
        });
      }
    });
    socket.on('pov', (data) => {
      if (this.isFollowing) {
        console.log('Received pov event:', data);
        this.pov = data;
      }
    });
    socket.on('marker', (data) => {
      if (this.isUser) {
        console.log('Received marker event:', data);
        this.markers.push(data);
        console.log(this.markers)
      }
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
        console.log('Received marker event:', data);
        this.markers[data.id].position = data.position
        console.log(this.markers)
      }
    });
      socket.on('clear', () => {
      if (this.isUser) {
        console.log('Received marker event');
        this.markers = [];
        console.log(this.markers)
      }
    });
  },
  beforeUnmount() {
    SocketioService.disconnect();
  }
}
</script>

<template>
  <div id="map_wrapper" style="display: flex;">

    <!-- TO DO refactor as component -->
    <div v-if="!isUser" class="container-follower">
      <button @click="goHome" class="ui follow-button active"><i class="home icon"></i></button>
      <button @click="clearMarkers" class="ui follow-button active"><i class="map marker alternate icon"></i></button>
      <button class="ui follow-button" v-bind:class="{ active: isModeratorControlling }" @click="toggleFollow">{{
        isModeratorControlling ?
        "Following" : "Controlling" }}
      </button>
      <div class="indicator" v-bind:class="{ active: isModeratorControlling }"></div>
    </div>


    <SelectDropdown v-if="showDropdown" :menuPosition="menuPosition" :createMarker="createMarker" />

    <!-- TO DO refactor as component -->
    <button class="delete-button" v-if="showRemove" @click="deleteMarker" :style="{
        left: menuPosition.x + 'px',
        top: menuPosition.y + 'px'
      }">
      Remove
      <i class="window close icon"></i>
    </button>

    <section :style="mapStyle" id="map-container" ref="map">
      <GMapMap ref="mapRef" :center=latLng :zoom="40" map-type-id="terrain" @click="mapClickEvent" :options="options"
        @dragstart="hideMenus">
        <GMapMarker :key="index" v-for="(m, index) in markers" :position="m.position" :clickable="true" :draggable="true"
          @click="selectMarkerEvent($event, index)" @dragend="markerChangedEvent($event.latLng, index)" />
      </GMapMap>
    </section>

    <section :style="panoStyle" id="pano-container">
      <StreetView @marker-changed="markerChangedEvent" v-if="isLoaded" :latLng="latLng" :pov="pov" :map="mapRef"
        :markers="markers" />
    </section>
  </div>
</template>

<style>
#map-container .vue-map-container {
  height: 100%;
}

.container-follower {
  position: absolute;
  position: absolute;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: end;
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
}

i.home.icon, i.marker.icon {
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


.indicator {
  width: 12px;
  height: 12px;
  background: orange;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;
  transition: .6s;
  margin-left: 10px;
}

.active.indicator {
  background: rgb(41, 183, 41);
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