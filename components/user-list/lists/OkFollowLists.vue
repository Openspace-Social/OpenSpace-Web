<template>
    <div class="ok-has-background-primary is-semi-rounded has-width-100-percent">
        <ok-follow-lists-stream :user="user"></ok-follow-lists-stream>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'nuxt-property-decorator';
import OkFollowListsStream from "~/components/user-list/lists/components/OkFollowListsStream.vue";
import {IUser} from "~/models/auth/user/IUser";

    @Component({
        name: 'OkFollowLists',
        components: { OkFollowListsStream }
    })
    export default class OkFollowLists extends Vue {

        @Prop({
            type: Object,
            required: false,
            default: null
        }) readonly user: IUser | null;
    }
</script>
