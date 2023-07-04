<script>

// Model from mixamo.com
import { AnimationMixer, Clock, Vector3, Color } from 'three';
import * as THREE from 'three';
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
    this.fbxModel = this.$refs.fbxmodel;
    this.camera = this.$refs.camera;
    this.scene = this.$refs.scene;
    //console.log(this.camera.lookAt);

    //const box = this.$refs.box.mesh;

    //this.renderer.scene.background = new THREE.Color( 0xff0000 );

    const geometry = new THREE.PlaneGeometry( 100, 100 );
    //geometry.rotateX( - Math.PI / 2 );

    const material = new THREE.ShadowMaterial();
    material.opacity = 0.5;

    const plane = new THREE.Mesh( geometry, material );
    plane.position.z = -20;
    plane.receiveShadow = true;
    this.scene.add( plane );

    //this.scene.background = transparent;

    // enabling shadows
    //this.renderer.shadowMap.enabled = true;
    //this.renderer.shadowMap.type = THREE.BasicShadowMap;

    /*const planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
    planeGeometry.rotateX( - Math.PI / 2 );
    const planeMaterial = new THREE.ShadowMaterial( { color: 0xFF0000, opacity: 0.2 } );

    const plane = new THREE.Mesh( planeGeometry, planeMaterial );
    plane.position.y = -1;
    plane.receiveShadow = true;
    this.renderer.scene.add( plane );

    const helper = new THREE.GridHelper( 2000, 100 );
    helper.position.y = -1;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    this.renderer.scene.add( helper );

    box.castShadow = true;
    box.receiveShadow = true;

    //this.renderer.scene.add( new THREE.AmbientLight( 0xf0f0f0, 3 ) );
    const light = new THREE.SpotLight( 0xffffff, 2.5 );
    light.position.set( 1000, 1000, 200 );
    light.angle = Math.PI * 0.2;
    light.decay = 0;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = - 0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.renderer.scene.add( light );

    this.renderer.onBeforeRender(() => {
      //box.rotation.x += 0.1;
    });*/


  },
  unmounted() {
    console.log("THREE OVERLAY UNMOUNT Here")
    this.renderer.forceContextLoss();
    this.renderer = null;
  },
  methods: {
    onLoad(object) {
      this.mixer = new AnimationMixer(object);
      object.scale.multiplyScalar(100);
      object.scale.set(100, 100, 100);
      if (object.animations.length>0) {
        const action = this.mixer.clipAction(object.animations[0]);
        action.play();
      }
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          //child.scale.set(30,30,30);
        }
      });
      console.log(this.camera);
      this.fbxModel.castShadow = true;
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
  <Renderer shadow alpha>
    <Camera :position="{ z: 100 }" />
    <Scene ref="scene">
      <PointLight :position="{ y: 50, z: 50 }" cast-shadow :shadow-map-size="{ width: 512, height: 512 }" />
      <Box :size="10" :rotation="{ x: 1, z: 1 }" cast-shadow>
        <LambertMaterial />
      </Box>
      <!--<Plane :width="100" :height="100" :position="{ z: -20 }" receive-shadow>
        <ShadowMaterial />
      </Plane>-->
    </Scene>
  </Renderer>
</template>
