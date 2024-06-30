<template>
    <div class="ok-has-background-primary is-semi-rounded has-width-100-percent">
        <div class="box ok-has-background-primary-highlight">
            <h2 class="is-size-5 has-padding-bottom-10 ok-has-text-primary-invert has-text-weight-bold">
                {{ $t('global.snippets.blocked_users')}}
            </h2>
            <ok-blocked-users-stream></ok-blocked-users-stream>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'nuxt-property-decorator';

    import OkBlockedUsersStream from "~/components/user-list/blocked/components/OkBlockedUsersStream.vue";

    @Component({
        name: 'OkBlockedUsers',
        components: { OkBlockedUsersStream }
    })
    export default class OkBlockedUsers extends Vue {
    }
</script>
