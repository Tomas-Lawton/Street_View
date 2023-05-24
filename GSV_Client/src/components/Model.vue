<script>
import {
  AmbientLight,
  Camera,
  GltfModel,
  Renderer,
  Scene,
} from 'troisjs';

export default {
  name: 'Model-Component',
  data() {
    return {
      renderer: null,
    }
  },
  components: {
    AmbientLight,
    Camera,
    GltfModel,
    Renderer,
    Scene,
  },
  mounted() {
    this.renderer = this.$refs.renderer;
  },
  unmounted() {
    console.log("THREE OVERLAY UNMOUNT")
    this.renderer.renderer.forceContextLoss();
    this.renderer = null;
  }
};
</script>

<template>
  <Renderer shallowRef="renderer" antialias :orbit-ctrl="{ enableDamping: true }" alpha resize>
    <Camera :position="{ x: 0.5, y: 0, z: 0 }" />
    <Scene>
      <AmbientLight></AmbientLight>
      <GltfModel src="test.glb" />
    </Scene>
  </Renderer>
</template>

