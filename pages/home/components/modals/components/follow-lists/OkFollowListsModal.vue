<template>
    <div class="is-flex justify-center align-items-center">
        <ok-follow-lists :user="user" class="ok-generic-modal" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'nuxt-property-decorator';
    import OkFollowLists from "~/components/user-list/lists/OkFollowLists.vue";
    import {IUser} from "~/models/auth/user/IUser";

    @Component({
        name: 'OkFollowListsModal',
        components: {OkFollowLists }
    })
    export default class OkFollowListsModal extends Vue {
        @Prop({
            type: Object,
            required: false,
            default: null
        }) readonly params: { user: IUser };

        get user() {
            return this.params?.user || null;
        }
    }
</script>
