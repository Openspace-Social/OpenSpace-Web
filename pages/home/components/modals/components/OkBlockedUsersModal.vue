<template>
    <div class="is-flex justify-center align-items-center">
        <ok-blocked-users class="ok-generic-modal" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'nuxt-property-decorator';
    import OkBlockedUsers from '~/components/user-list/blocked/OkBlockedUsers.vue';

    @Component({
        name: 'OkBlockedUsersModal',
        components: { OkBlockedUsers }
    })
    export default class OkBlockedUsersModal extends Vue {
        @Prop({
            type: Function,
            required: false
        }) readonly returnDataSetter: (data: any) => void;
    }
</script>
