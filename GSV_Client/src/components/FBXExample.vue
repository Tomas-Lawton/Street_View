<script>

// Model from mixamo.com
import { AnimationMixer, Clock, Vector3 } from 'three';
import {
  AmbientLight,
  Camera,
  FbxModel,
  Renderer,
} from 'troisjs';

export default {
  name: "FBXExample-Component",
  props: {
    modelPath: {
      type: String,
      required: true,
    }
  },
  components: {
    AmbientLight,
    Camera,
    FbxModel,
    Renderer,
  },
  data() {
    return {
      target: new Vector3(0, 100, 0),
      renderer: null,
    };
  },
  mounted() {
    // console.log(this.modelPath)
    this.renderer = this.$refs.renderer;
  },
  unmounted() {
    console.log("THREE OVERLAY UNMOUNT Here")
    this.renderer.renderer.forceContextLoss();
    this.renderer = null;
  },
  methods: {
    onLoad(object) {
      this.mixer = new AnimationMixer(object);
      const action = this.mixer.clipAction(object.animations[0]);
      action.play();
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      this.clock = new Clock();
      this.$refs.renderer.onBeforeRender(this.updateMixer);
    },
    updateMixer() {
      this.mixer.update(this.clock.getDelta());
    },
  },
};
</script>

<template>
  <Renderer ref="renderer" antialias :orbit-ctrl="{ enableDamping: true, target }" width="300" height="200" shadow alpha>
    <Camera :position="{ x: 10, y: 200, z: 200 }" />
    <Scene>
      <AmbientLight />
      <FbxModel :src="modelPath" @load="onLoad" />
    </Scene>
  </Renderer>
</template>
