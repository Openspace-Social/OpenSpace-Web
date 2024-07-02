<template>
    <div class="is-flex justify-center align-items-center">
        <ok-account-settings style="max-width: 360px; width: 100%;"/>
    </div>
</template>


<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator"
    import OkAccountSettings from '~/components/settings/account-settings/OkAccountSettings.vue';

    @Component({
        name: "OkAccountSettingsModal",
        components: {OkAccountSettings},
    })
    export default class OkAccountSettingsModal extends Vue {

        @Prop({
            type: Function,
            required: false
        }) readonly returnDataSetter: (data: any) => void;


    }
</script>
