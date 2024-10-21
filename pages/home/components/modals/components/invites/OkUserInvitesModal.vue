<template>
    <div class="is-flex justify-center align-items-center">
        <ok-user-invites-list class="ok-generic-modal" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'nuxt-property-decorator';
    import {IUser} from "~/models/auth/user/IUser";
    import OkUserInvitesList from "~/components/invites/OkUserInvitesLists.vue";

    @Component({
        name: 'OkUserInvitesModal',
        components: {OkUserInvitesList }
    })
    export default class OkUserInvitesModal extends Vue {
    }
</script>
