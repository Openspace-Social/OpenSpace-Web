<template>
    <div class="is-flex justify-center align-items-center">
        <ok-delete-account-settings class="ok-generic-modal" />
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'nuxt-property-decorator';
    import OkDeleteAccountSettings from "~/components/settings/account-settings/OkDeleteAccountSettings.vue";

    @Component({
        name: 'OkDeleteAccountModal',
        components: {OkDeleteAccountSettings }
    })
    export default class OkDeleteAccountModal extends Vue {
        @Prop({
            type: Function,
            required: false
        }) readonly returnDataSetter: (data: any) => void;
    }
</script>
