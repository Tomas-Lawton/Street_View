<script>

export default {
  data() {
    return {
      renderer: null,
      box: null
    }
  },
  mounted() {
    this.renderer = this.$refs.renderer;
    this.box = this.$refs.box.mesh;
    this.renderer.onBeforeRender(() => {
      this.box.rotation.x += 0.01;
    });
  },
  unmounted() {
    console.log("THREE OVERLAY UNMOUNT")
    this.renderer.renderer.forceContextLoss();
    this.box = null;
    this.renderer = null;
  }
};

</script>


<template>
  <Renderer ref="renderer" antialias orbit-ctrl>
    <Camera :position="{ z: 1.5 }" />
    <Scene>
      <PointLight :position="{ y: 50, z: 50 }" />
      <Box ref="box" :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }">
        <LambertMaterial />
      </Box>
    </Scene>
  </Renderer>
</template>

<style>
body {
  margin: 0;
}
canvas {
  display: block;
}
</style>