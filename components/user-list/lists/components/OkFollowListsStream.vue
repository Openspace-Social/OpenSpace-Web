<template>
    <div class="box ok-has-background-primary-highlight">
        <section v-if="!showCreateList" class="ok-follow-lists-stream" :style="{
            display: selectedList == null ? 'block' : 'none'
        }">
            <div class="flex flex-row justify-between items-center has-padding-bottom-20">
                <h2 class="is-size-5 ok-has-text-primary-invert has-text-weight-bold">
                    {{ $t('global.keywords.lists') }}
                </h2>
                <button
                    v-if="!isAddUserToFollowListEnabled"
                    @click="showCreateList = true"
                    class="button is-rounded ok-has-background-primary-highlight has-text-weight-bold is-small ok-has-text-primary-invert">
                    <ok-plus-icon/>
                    {{ $t('global.keywords.create') }}
                </button>
                <button
                    v-if="isAddUserToFollowListEnabled"
                    @click="onUpdateFollowList"
                    class="button is-rounded ok-has-background-primary-highlight has-text-weight-bold is-small ok-has-text-primary-invert">
                    {{ $t('global.keywords.update') }}
                </button>
            </div>
            <ok-http-list
                :refresher="followListsRefresher"
                :show-search-bar="false"
                :show-no-more="false"
                ref="okHttpList"
            >
                <ok-list-tile
                    slot-scope="props"
                    @refresh="refreshLists"
                    :show-checkbox="isAddUserToFollowListEnabled"
                    :checked="isListChecked(props.item)"
                    :list="props.item"
                    :clickable="true"
                    @item-clicked="onListTileClick"
                ></ok-list-tile>
            </ok-http-list>
        </section>
        <section class="ok-follow-lists-stream" v-if="selectedList != null">
            <div v-if="loadingSelectedList"
                 class="has-padding-20 ok-has-text-primary-invert">
                <ok-loading-indicator></ok-loading-indicator>
            </div>
            <OkSelectedList @back-clicked="selectedList = null" @list-updated="onListUpdated"
                            :selected-list="selectedList" v-else></OkSelectedList>
        </section>
        <section class="ok-follow-lists-stream" v-if="showCreateList">
            <OkCreateList @list-created="onListCreated" @back-clicked="showCreateList = false"/>
        </section>
    </div>
</template>

<style lang="scss" scoped>
.ok-follow-lists-stream {
    height: calc(100vh - 240px);
    width: 100%;
    overflow-y: auto;
}
</style>

<script lang="ts">
import {Component, Prop, Vue} from 'nuxt-property-decorator';
import {BehaviorSubject} from 'rxjs';
import {IUser} from '~/models/auth/user/IUser';
import {okunaContainer} from '~/services/inversify';
import {TYPES} from '~/services/inversify-types';
import {IUserService} from '~/services/user/IUserService';

import OkHttpList from '~/components/http-list/OkHttpList.vue';
import OkUserListItem from '~/components/user-list/common/user-list-item/OkUserListItem.vue';
import OkBlockedUserListItem from "~/components/user-list/common/user-list-item/OkBlockedUserListItem.vue";
import OkBlockButton from "~/components/buttons/OkBlockButton.vue";
import {CancelableOperation} from "~/lib/CancelableOperation";
import {IUtilsService} from "~/services/utils/IUtilsService";
import {IList} from "~/models/lists/list/IList";
import OkListTile from "~/components/user-list/lists/components/OkListTile.vue";
import OkListAvatar from "~/components/user-list/lists/components/OkListAvatar.vue";
import OkLoadingIndicator from "~/components/utils/OkLoadingIndicator.vue";
import OkCreateList from "~/components/user-list/lists/components/OkCreateList.vue";
import OkSelectedList from "~/components/user-list/lists/components/OkSelectedList.vue";
import OkCommunityTileSkeleton from "~/components/skeletons/tiles/OkCommunityTileSkeleton.vue";
import OkPostSkeleton from "~/components/skeletons/post/OkPostSkeleton.vue";
import OkCommunityCardSkeleton from "~/components/skeletons/cards/community-card/OkCommunityCardSkeleton.vue";
import OkNotificationSkeleton from "~/components/skeletons/notification/OkNotificationSkeleton.vue";
import {IModalService} from "~/services/modal/IModalService";

@Component({
    name: 'OkFollowListsStream',
    components: {
        OkNotificationSkeleton, OkCommunityCardSkeleton, OkPostSkeleton, OkCommunityTileSkeleton,
        OkSelectedList,
        OkCreateList,
        OkLoadingIndicator,
        OkListAvatar, OkListTile, OkBlockButton, OkBlockedUserListItem, OkHttpList, OkUserListItem
    },
    subscriptions: function () {
        return {
            loggedInUser: this['userService'].loggedInUser
        };
    }
})
export default class OkFollowListsStream extends Vue {
    static infiniteScrollChunkUsersCount = 10;

    @Prop({
        type: Object,
        required: false,
        default: null
    }) readonly user: IUser | null;

    get isAddUserToFollowListEnabled() {
        return this.user != null;
    }

    $observables!: {
        loggedInUser?: BehaviorSubject<IUser | undefined>
    };

    $refs!: {
        okHttpList: OkHttpList<IUser>
    };

    checkedLists: IList[] = [];

    showCreateList = false;

    requestInProgress = false;
    requestOperation?: CancelableOperation<any>;

    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private modalService: IModalService = okunaContainer.get<IModalService>(TYPES.ModalService);

    followLists: IList[] = [];

    selectedList: IList | null = null;
    loadingSelectedList = false;

    async followListsRefresher(): Promise<IList[]> {
        this.followLists = await this.userService.getLists();
        this.updateCheckedLists();
        return this.followLists;
    }

    async refreshLists() {
        await this.$refs.okHttpList.refresh();
    }

    async onListTileClick(list: IList) {
        if (this.isAddUserToFollowListEnabled) {
            const isListChecked = this.isListChecked(list);
            if (isListChecked) {
                this.checkedLists = this.checkedLists.filter(followList => followList.id !== list.id);
            } else {
                this.checkedLists.push(list);
            }
        } else {
            this.selectedList = list;
            this.loadingSelectedList = true;
            this.selectedList = await this.userService.getList(list.id);
            this.loadingSelectedList = false;
        }
    }

    onListUpdated() {
        this.refreshLists();
        this.onListTileClick(this.selectedList);
    }

    onListCreated() {
        this.showCreateList = false;
        this.refreshLists();
    }

    isListChecked(list: IList) {
        return this.checkedLists.some(followList => followList.id === list.id);
    }

    updateCheckedLists() {
        this.checkedLists = this.followLists.filter(list => this.isListChecked(list));
    }

    async onUpdateFollowList() {
        const username = this.user?.username;
        if (!username) {
            return;
        }
        const listIds = this.checkedLists.map(list => list.id);
        this.requestOperation = CancelableOperation.fromPromise<boolean>(
            this.user.isFollowing ?
                this.userService.updateFollowList(username, listIds) :
                this.userService.followFollowList(username, listIds)
        );
        const res = await this.requestOperation.value;
        if (res) {
            this.checkedLists = []
            this.modalService.ensureHasNoActiveModal();
        }
    }

    mounted() {
        this.checkedLists = this.user?.followLists || [];
        this.followListsRefresher();
    }
}
</script>
