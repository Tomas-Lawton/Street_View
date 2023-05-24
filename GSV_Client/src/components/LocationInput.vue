<script>
import axios from "axios";
import { store } from '@/store'

export default {
  data() {
    return {
      address: "",
      error: "",
      spinner: false,
    };
  },
  methods: {
    setPlace(place) {
      store.commit('updateUserPosition', {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      });
    },
    locatorButtonPressed() {
      this.spinner = true;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {

            this.getAddressFrom(
              position.coords.latitude,
              position.coords.longitude
            );
            store.commit('updateUserPosition', {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            this.error =
              "Locator is unable to find your address. Please type your address manually.";
            this.spinner = false;
            console.log(error.message);
          }
        );
      } else {
        this.error = error.message;
        this.spinner = false;
        console.log("Your browser does not support geolocation API ");
      }
    },
    getAddressFrom(lat, long) {
      axios
        .get(
          "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
          lat +
          "," +
          long +
          "&key=" +
          store.state.apiKey
        )
        .then((response) => {
          if (response.data.error_message) {
            this.error = response.data.error_message;
            console.log(response.data.error_message);
          } else {
            this.address = response.data.results[0].formatted_address;
          }
          this.spinner = false;
        })
        .catch((error) => {
          this.error = error.message;
          this.spinner = false;
          console.log(error.message);
        });
    },
  },
  emits: ['marker-pressed', 'sizeChanged-pressed'],
};
</script>

<template>
  <!--<div class="ui message red" v-show="error">{{error}}</div>-->
  <div class="ui icon input large google-input" :class="{ loading: spinner }">
    <GMapAutocomplete placeholder="Search Google Maps" @place_changed="setPlace" />
    <i class="search link icon" @click="locatorButtonPressed"></i>
  </div>
</template>



<style scoped>
.google-input {
  position: absolute;
  left: 50%;
  z-index: 12;
  /* margin: 10px; */
  margin: 5px 0;
  transform: translateX(-50%);
  background: transparent;
}

.ui.input {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02);
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  height: 48px;
  width: 392px;
  color: #202124;
  font-size: 15px;

  -webkit-transition-property: box-shadow;
  transition-property: box-shadow;
  -webkit-transition-duration: .3s;
  transition-duration: .3s;

  position: absolute;
}

.ui.input:focus {
  outline: none;
  box-shadow: none;
}

::placeholder {
  color: rgb(32 32 32 / 87%);
  font-weight: 500;
}
</style>



