<script>
import { store } from '@/store'

export default {
  name: "Authentication",
  data() {
    return {
      api_input: "",
    };
  },
  methods: {
    valueSubmitted: function () {
      console.log(this.api_input);
      console.log(this.$route.query.redirect);

      store.commit('login', this.api_input)
      this.$router.replace(this.$route.query.redirect || '/');


      // if (searchParams.has("redirect")) {
      //   this.$router.push({ path: `${searchParams.get("redirect")}` });
      // } else { 
      //   this.$router.push({ path: "/" }); 
      // }


    }
  },
  mounted() {
    console.log("Loaded Auth View");
  }
}
</script>

<template>
  <!--<div>LANDING PAGE</div>-->
  <div class="ui middle aligned center aligned grid">
    <div class="column" style="width: 30%;">
      <form class="ui large form">
        <div class="ui stacked segment">
          <div class="field">
            <input type="text" placeholder="Your API key" v-model="api_input">
          </div>
          <button class="ui fluid large red submit button" @click="valueSubmitted">Connect</button>
        </div>
      </form>
    </div>
  </div>
</template>


<style>
body {
  background-color: lightgrey;
  height: 100%;
}

#app {
  height: 100%;
}

#app>.grid {
  height: 100%;
  background-color: lightgrey;
}
</style>