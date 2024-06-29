<template>
    <div class="is-flex justify-center align-items-center karthik">
        <div class="ok-has-background-primary is-semi-rounded">
            <div class="box ok-has-background-primary-highlight">
                <div v-if="params.imageUrl" class="">
                    <img :src="params.imageUrl" alt="Full Screen" class=""/>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import {FullScreenImageModalParams} from '~/services/modal/IModalService';

@Component({
    name: 'OkFullScreenImageModal',
    components: {}
})
export default class OkFullScreenImageModal extends Vue {
    @Prop({
        type: Object,
        required: false
    }) readonly params: FullScreenImageModalParams;
}
</script>
