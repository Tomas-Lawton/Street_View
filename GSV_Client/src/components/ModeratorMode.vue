<script>
export default {
    name: "ModeratorMode",
    data() {
        return {
            selectedMode: "Controlling",
            dropdownOptions: [
                "Controlling",
                "Following",
                "Free",
            ],
        };
    },
    computed: {
        willControl() {
            return (this.selectedMode === "Controlling");
        },
    },
    methods: {
        updateParent() {
            this.$parent.setFollowMode(this.selectedMode)
        }
    }
};
</script>

<template>
    <div class="container-moderator-mode">
        <SelectButton v-model="selectedMode" 
            :options="dropdownOptions" 
            :unselectable="false" 
            @click="updateParent"
            class="selector" 
        />
        <div class="indicator" :class="{ active: !willControl }"></div>
    </div>
</template>

<style>

.selector {
    border-radius: 2px;
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

.container-moderator-mode {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    left: 0;
    z-index: 12;
    margin: 10px;
    height: 40px;
}
</style>
