<script>

export default {
  name: 'MarkerDropdown',
  props: {
    menuPosition: Object,
    createMarker: Function,
  },
  methods: {
    onClick(e) {
      // add marker with selected name at correct position
      this.createMarker({
        name: e.target.innerHTML,
      })
    }
  },
  data() {
    return {
      models: [
        { key: 'animations/1.fbx' },
        { key: 'animations/2.fbx' },
        { key: 'animations/3.fbx' },
        { key: 'animations/4.fbx' },
        { key: 'animations/5.fbx' },
        { key: 'animations/6.fbx' },
      ],
    };
  },
};

</script>

<template>
  <ul label="Model Path" 
    class="default" 
    :style="{
      left: menuPosition.x + 'px',
      top: menuPosition.y + 'px'
    }">
    <li class="default-item" v-for="item in models" @click=onClick>
      {{ item.key }}
    </li>
  </ul>
</template>

<style scoped>
.default {
  position: absolute;
  z-index: 30;
  transform: translate(-50%, 0);
  background-color: white;
  padding: 5px;
  border-radius: 5px;
}
.default-item {
  color: grey;
  cursor: pointer;
  list-style-type: none;
  padding: 5px 15px;
  border-radius: 5px;
}
.default-item:hover {
background-color: rgb(241, 241, 241);
}
</style>

