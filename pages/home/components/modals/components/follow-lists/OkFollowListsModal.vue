<template>
    <div class="is-flex justify-center align-items-center">
        <ok-follow-lists class="ok-generic-modal" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'nuxt-property-decorator';
    import OkFollowLists from "~/components/user-list/lists/OkFollowLists.vue";

    @Component({
        name: 'OkFollowListsModal',
        components: {OkFollowLists }
    })
    export default class OkFollowListsModal extends Vue {
        @Prop({
            type: Function,
            required: false
        }) readonly returnDataSetter: (data: any) => void;
    }
</script>
