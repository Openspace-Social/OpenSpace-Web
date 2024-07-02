<template>
    <div class="is-flex justify-center align-items-center">
        <ok-change-email-settings
            class="ok-wide-modal"
            @onSaveComplete="onSaveComplete"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import OkChangeEmailSettings from '~/components/settings/account-settings/OkChangeEmailSettings.vue';

@Component({
    name: 'OkAccountSettingsModal',
    components: { OkChangeEmailSettings }
})
export default class OkAccountSettingsModal extends Vue {
    @Prop({
        type: Function,
        required: false
    }) readonly returnDataSetter: (data: any) => void;

    onSaveComplete() {
        this.$parent['close']();
    }
}
</script>
