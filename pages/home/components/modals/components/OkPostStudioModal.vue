<template>
    <div class="is-flex justify-center align-items-center">
        <div class="ok-post-studio-modal">
            <ok-post-studio :params="params" @onWantsToSharePost="onWantsToSharePost" @onSavedPost="onSavedPost"/>
        </div>
    </div>
</template>

<style lang="scss">
    .ok-post-studio-modal {
        //max-width: 390px;
        width: 60vh;
        height: 80vh;
        position: relative;
        overflow: hidden;
        margin: 20px;

        @include for-size(tablet-portrait-up) {
            //min-width: 500px;
        }

        @include for-size(desktop-up) {
            min-width: 635px;
        }
    }
</style>

<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator"
    import { PostStudioModalParams } from "~/services/modal/IModalService";
    import OkPostStudio from "~/components/post-studio/OkPostStudio.vue";
    import { OkPostStudioData } from "~/components/post-studio/lib/OkPostCreatorTypes";
    import OkPost from '~/components/post/OkPost.vue';

    @Component({
        name: "OkPostStudioModal",
        components: {OkPostStudio},
    })
    export default class OkPostStudioModal extends Vue {
        @Prop({
            type: Function,
            required: true
        }) readonly returnDataSetter: (data: any) => void;

        @Prop({
            type: Object,
            required: true
        }) readonly params: PostStudioModalParams;

        onWantsToSharePost(data: OkPostStudioData) {
            this.returnDataSetter(data);
            this.$parent["close"]();
        }

        onSavedPost(post: OkPost){
            this.returnDataSetter(post);
            this.$parent["close"]();
        }
    }
</script>
