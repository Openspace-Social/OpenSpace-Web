<template>
    <div class="is-flex justify-center align-items-center">
        <ok-change-password-settings
            class="ok-wide-modal"
            @onSaveComplete="onSaveComplete"
        />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import OkChangePasswordSettings from '~/components/settings/account-settings/OkChangePasswordSettings.vue';

@Component({
    name: 'OkChangePasswordModal',
    components: { OkChangePasswordSettings }
})
export default class OkChangePasswordModal extends Vue {
    @Prop({
        type: Function,
        required: false
    }) readonly returnDataSetter: (data: any) => void;

    onSaveComplete() {
        this.$parent['close']();
    }
}
</script>
