<template>
    <article
        @click="onTileClick"
        class="media has-overflow-hidden is-flex align-items-center has-padding-5 cursor-pointer">
        <ok-checkbox :checked="checked" />
        <figure class="media-left">
            <ok-list-avatar :list="list" class="has-padding-left-10"></ok-list-avatar>
        </figure>
        <div class="media-content has-z-index-1" :class="mediaExtraClasses">
            <div class="has-text-overflow-ellipsis">
                <div class="is-flex align-center">
                    <span class="ok-has-text-primary-invert has-text-weight-bold">
                        {{list.name}}
                    </span>
                </div>

                <div class="is-flex align-center">
                    <span class="ok-has-text-primary-invert has-text-weight-bold">
                        {{ list.followsCount }} <span class="lowercase">{{ $t('global.keywords.users') }}</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="media-right has-z-index-1">
            <slot name="trailing"></slot>
        </div>
    </article>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator"
import { OkUserBadgeSize } from "~/components/user-badges/lib/OkUserBadgeSize";
import { INavigationService } from "~/services/navigation/INavigationService";
import { okunaContainer } from "~/services/inversify";
import { TYPES } from "~/services/inversify-types";
import {IList} from "~/models/lists/list/IList";
import OkListAvatar from "~/components/user-list/lists/components/OkListAvatar.vue";
import OkCheckbox from "~/components/input/OkCheckbox.vue";

@Component({
    name: "OkListTile",
    components: {OkCheckbox, OkListAvatar},
})
export default class OkListTile extends Vue {
    @Prop({
        type: Object,
        required: true,
    }) readonly list: IList;

    @Prop({
        type: Boolean,
        required: false
    }) readonly showCheckbox: boolean;

    @Prop({
        type: Boolean,
        required: false,
        default: false
    }) readonly checked: boolean;


    @Prop({
        type: Boolean,
        required: false
    }) readonly clickable: boolean;

    private navigationService: INavigationService = okunaContainer.get<INavigationService>(TYPES.NavigationService);

    OkUserBadgeSize = OkUserBadgeSize;

    get mediaExtraClasses() {
        return this.clickable ? 'has-cursor-pointer' : '';
    }

    onTileClick() {
        if (!this.clickable) {
            return;
        }
        this.$emit('item-clicked', this.list);

        // this.navigationService.navigateToProfile({ user: this.user });
    }
}
</script>
