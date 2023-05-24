<script>

import MarkerContainer from "@/components/MarkerContainer.vue";
import SocketioService from '../services/socket';

let initiated = false;

export default {
  name: "StreetView",
  components: { MarkerContainer },
  props: {
    map: Object,
    latLng: Object,
    pov: Object,
    markers: [Object]
  },
  emits: ['marker-changed'],
  data() {
    return {
      pano: null,
      gMapsMarkers: [],
      renderedMarkers: [],
    }
  },
  mounted() {
    initiated = false;

    try {
      this.pano = new google.maps.StreetViewPanorama(this.$refs["pano"], {
        position: {
          lat: this.latLng.lat,
          lng: this.latLng.lng
        },
        pov: this.pov,
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
        addressControl: false
      });
      console.log(this.pano)
    } catch (e) {
      console.log("Couldn't create street view: ", e)
    }

    this.map.$mapPromise.then((mapObject) => {
      mapObject.setStreetView(this.pano);

      // User position event
      this.pano.addListener('position_changed', () => {
        const newPosition = this.pano.getPosition();
        mapObject.setCenter(newPosition);

        this.startMutationObserving();

        if (SocketioService.socket) {
          SocketioService.socket.emit('position', newPosition);
        }

        console.log("Updated position in streetview")
      });

      // User point of view event
      this.pano.addListener("pov_changed", () => {
        const newPov = this.pano.getPov();
        if (SocketioService.socket) {
          SocketioService.socket.emit('pov', newPov);
        }
      });

    });

    this.addMarkersToPano();

  },
  methods: {
    checkAllMarkers() {
      let string = '[src*="woodie_3.png"]';  ///[id*='someId']
      const elem = document.querySelectorAll(string);

      Array.from(elem).forEach((el, index) => {
        el.parentNode.style.transform = 'scale(1.0)';
        el.parentNode.style.overflow = 'unset';

        if (el.parentNode.childElementCount == 1) {
          const divNode = document.createElement('div');
          const markerNode = el.parentNode;
          markerNode.append(divNode);

          this.renderedMarkers.push({
            node: divNode,
            path: this.markers[index].model
          })
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

      //console.log("MUTATION OBSERVING");

      if (!initiated) {
        //console.log("TARGET");
        //console.log(target);

        const observer = new MutationObserver(list => {
          //console.log("observation test");
          //console.log(list);

          for (const mutation of list) {
            if (mutation.type == "attributes") {
              //console.log("ATTRIBUTE CHANGED");
              //console.log(mutation);

              this.checkAllMarkers();

            } else if (mutation.type == "childList") {
              //console.log("IMAGE ADDED");
              this.checkAllMarkers();

            }
          }

        });
        observer.observe(target[1], { attributes: true, attributeFilter: ['src'], childList: true, subtree: true });

        initiated = true;
      }
    },
    addMarkersToPano() {
      //console.log("WATCH MARKERS", this.markers.length);

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
          draggable: false,
          icon: icon
        });

        google.maps.event.addListener(marker, 'dragend', () => {
          console.log('test')
          const id = marker.icon.url.split('#')[1];
          const newPosition = marker.position //{ lat: marker.position.lat, lng: marker.position.lng };
          this.$emit('marker-changed', newPosition, id);
          //this.markers[pathName].position = newPosition;
        });

        this.gMapsMarkers.push(marker);
      }
    }
  },
  watch: {
    latLng: {
      handler: function (val) {
        this.pano.setPosition(val)
      },
      deep: true
    },
    pov: {
      handler: function (val) {
        this.pano.setPov(val)
      },
      deep: true
    },
    markers: {
      handler: function () {
        this.addMarkersToPano();
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<template>
  <section id="pano" ref="pano"></section>
  <MarkerContainer v-for="renderedElem in renderedMarkers" :key="renderedElem.node.id" :node="renderedElem.node"
    :position="latLng" :modelPath="renderedElem.path" />
</template>

<style scoped>
#pano {
  float: left;
  height: 100%;
  width: 100%;
  background-color: #ff5a5f;
}
</style>