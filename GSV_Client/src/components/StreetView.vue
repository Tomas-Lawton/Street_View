<script>

import MarkerContainer from "@/components/MarkerContainer.vue";
import SocketioService from '../services/socket';
import { store } from '@/store'

let initiated = false;

export default {
  name: "StreetView",
  components: { MarkerContainer },
  props: {
    map: Object,
    markers: [Object],
    isUser: Boolean,
    willUpdate: Boolean,
    userPosition: Object,
    userPov: Object,
    updatePosition: { type: Function },
    updatePov: { type: Function },
  },
  emits: ['marker-changed'],
  data() {
    return {
      pano: null,
      gMapsMarkers: [],
      renderedMarkers: [],
      isInitialized: false,
    }
  },
  mounted() {
    this.pano = new google.maps.StreetViewPanorama(
      this.$refs["pano"],
      {
        position: this.userPosition,
        pov: this.userPov,
        addressControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        linksControl: true,
        panControl: true,
        enableCloseButton: false,
        motionTracking: false,
        scrollwheel: false,
        zoomControl: false,
        showRoadLabels: false,
        addressControl: false,
        radius: 500
      });

    this.map.$mapPromise.then((mapObject) => {
      mapObject.setStreetView(this.pano);

      this.pano.addListener('position_changed', () => {
        const newPosition = this.pano.getPosition();
        const currentPosition = store.state.user.position;
        const newLat = newPosition.lat();
        const newLng = newPosition.lng();

        mapObject.setCenter(newPosition);
        this.startMutationObserving();

        if (currentPosition.lat !== newLat || currentPosition.lng !== newLng) {
          this.updatePosition({ lat: newLat, lng: newLng });
          if (SocketioService.socket && this.willUpdate) {
            SocketioService.socket.emit('position', newPosition);
          }
        }
      });

      this.pano.addListener("pov_changed", () => {
        let newPov = this.pano.getPov();
        newPov.zoom = this.isUser ? .5 : 1.5;

        if (store.state.user.pov !== newPov) {
          this.updatePov(newPov);
          if (SocketioService.socket && this.willUpdate) {

            console.log('emit pov changed')
            SocketioService.socket.emit('pov', newPov);
          }
        }
      });
    });

    this.addMarkersToPano();
    this.isInitialized = true;
  },
  methods: {
    checkAllMarkers() {

      let string = '[src*="woodie_3.png"]';  ///[id*='someId']
      const elem = document.querySelectorAll(string);

      Array.from(elem).forEach((el, index) => {
        // el.parentNode.style.transform = 'scale(1.0)';
        el.parentNode.style.overflow = 'unset';

        if (el.parentNode.childElementCount == 1) {
          const divNode = document.createElement('div');
          const markerNode = el.parentNode;
          markerNode.append(divNode);
          this.renderedMarkers.push({
            node: divNode,
            path: this.markers[index].model,
            markerPosition: this.markers[index].position
          });
        }
      });
    },
    hideAllMarker() {
      for (let i = 0; i < this.gMapsMarkers.length; i++) {
        this.gMapsMarkers[i].setPosition(null);
        this.gMapsMarkers[i].setMap(null);
      }
      this.gMapsMarkers = [];
    },
    startMutationObserving() {
      const target = document.querySelectorAll('[aria-roledescription="map"]');

      if (!initiated) {
        const observer = new MutationObserver(list => this.checkAllMarkers())
        // {
        //   for (const mutation of list) {
        //     if (mutation.type == "attributes") {
        //       this.checkAllMarkers();
        //     } else if (mutation.type == "childList") {
        //       this.checkAllMarkers();
        //     }
        //   }
        // });
        observer.observe(target[0], { attributes: true, attributeFilter: ['src'], childList: true, subtree: true });
        initiated = true;
      }
    },
    addMarkersToPano() {
      this.renderedMarkers = [];
      this.hideAllMarker();

      for (let i = 0; i < this.markers.length; i++) {
        // Create the icon
        const icon = new google.maps.MarkerImage("woodie_3.png",
          new google.maps.Size(1, 1),
          new google.maps.Point(0, 0),
          new google.maps.Point(48, 32)
        );
        // Determine a unique id somehow, perhaps from your data
        //const markerId = Math.floor(Math.random() * 1000000);
        icon.url += "#" + i;

        const marker = new google.maps.Marker({
          position: this.markers[i].position,
          map: this.pano,
          // optimized: false,
          draggable: true,
          icon: icon
        });

        google.maps.event.addListener(marker, 'dragend', () => {
          console.log('test')
          const id = marker.icon.url.split('#')[1];
          const newPosition = marker.position;


          // DO SOMETHING HERE IN PARENT
          this.$emit('marker-changed', newPosition, id);
        });

        this.gMapsMarkers.push(marker);
      }
    }
  },
  watch: {
    userPosition: {
      handler: function (val) {
        // console.log("set new pos ", val)
        if (this.isInitialized && this.pano) {
          this.pano.setPosition(val)
        }
      },
      deep: true,
    },
    userPov: {
      handler: function (val) {
        // console.log("set new pov ", val)
        if (this.isInitialized && this.pano) {
          if (this.pano.pov !== val) {
            this.pano.setPov(val);
          }
        }
      },
      deep: true,
      immediate: true
    },
    markers: {
      handler: function () {
        this.addMarkersToPano();
      },
      deep: true,
      immediate: true
    },
  }
}
</script>

<template>
  <section id="pano" ref="pano"></section>
  <MarkerContainer v-for="renderedElem in renderedMarkers" :key="renderedElem.node.id" :node="renderedElem.node"
    :position="renderedElem.markerPosition" :modelPath="renderedElem.path"/>
</template>

<style scoped>
#pano {
  float: left;
  height: 100%;
  width: 100%;
  background-color: #ff5a5f;
}


</style>