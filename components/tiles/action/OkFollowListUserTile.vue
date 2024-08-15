<template>
    <ok-tile :on-click="onWantsToToggle">
        <template v-slot:leading>
            <ok-lists-icon
                    class="ok-svg-icon-primary-invert"></ok-lists-icon>
        </template>

        <template v-slot:content>
            <span class="ok-has-text-primary-invert">
                {{ user.followLists.length == 0 ? $t('global.snippets.add_account_to_lists') : $t('global.snippets.update_account_in_lists')}}
            </span>
        </template>
    </ok-tile>
</template>

<style lang="scss">

</style>

<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator"
    import OkTile from "~/components/tiles/OkTile.vue";
    import { okunaContainer } from "~/services/inversify";
    import { TYPES } from "~/services/inversify-types";
    import { IUser } from '~/models/auth/user/IUser';
    import {IModalService} from "~/services/modal/IModalService";

    @Component({
        name: "OkFollowListUserTile",
        components: {OkTile},
    })
    export default class OkFollowListUserTile extends Vue {

        @Prop({
            type: Object,
            required: false,
            default: null
        }) readonly user: IUser;

        private modalService: IModalService = okunaContainer.get<IModalService>(TYPES.ModalService);

        async onWantsToToggle() {
            await this.modalService.openFollowListsModal({
                user: this.user
            });
            this.$emit('onFollowListsUpdated');
        }

    }
</script>
