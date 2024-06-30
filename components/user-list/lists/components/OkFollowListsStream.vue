<template>
    <section class="ok-follow-lists-stream">
        <ok-http-list
            :refresher="followListsRefresher"
            :show-search-bar="false"
            :show-no-more="false"
            ref="okHttpList"
        >
            <ok-list-tile
                slot-scope="props"
                @refresh="refreshUsers"
                :list="props.item"
            ></ok-list-tile>
        </ok-http-list>
    </section>
</template>

<style lang="scss" scoped>
    .ok-follow-lists-stream {
        height: calc(100vh - 240px);
        width: 100%;
        overflow-y: auto;
    }
</style>

<script lang="ts">
    import { Component, Vue } from 'nuxt-property-decorator';
    import { BehaviorSubject } from 'rxjs';
    import { IUser } from '~/models/auth/user/IUser';
    import { okunaContainer } from '~/services/inversify';
    import { TYPES } from '~/services/inversify-types';
    import { IUserService } from '~/services/user/IUserService';

    import OkHttpList from '~/components/http-list/OkHttpList.vue';
    import OkUserListItem from '~/components/user-list/common/user-list-item/OkUserListItem.vue';
    import OkBlockedUserListItem from "~/components/user-list/common/user-list-item/OkBlockedUserListItem.vue";
    import OkBlockButton from "~/components/buttons/OkBlockButton.vue";
    import {CancelableOperation} from "~/lib/CancelableOperation";
    import {IUtilsService} from "~/services/utils/IUtilsService";
    import {IList} from "~/models/lists/list/IList";
    import OkListTile from "~/components/user-list/lists/components/OkListTile.vue";

    @Component({
        name: 'OkFollowListsStream',
        components: {OkListTile, OkBlockButton, OkBlockedUserListItem, OkHttpList, OkUserListItem },
        subscriptions: function () {
            return {
                loggedInUser: this['userService'].loggedInUser
            };
        }
    })
    export default class OkFollowListsStream extends Vue {
        static infiniteScrollChunkUsersCount = 10;

        $observables!: {
            loggedInUser?: BehaviorSubject<IUser | undefined>
        };

        $refs!: {
            okHttpList: OkHttpList<IUser>
        };

        requestInProgress = false;
        requestOperation?: CancelableOperation<any>;

        private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
        private utilsService: IUtilsService = okunaContainer.get<IUtilsService>(TYPES.UtilsService);

        followLists: IList[] = [];

        async followListsRefresher(): Promise<IList[]> {
            return this.userService.getLists();
        }

        async refreshUsers() {
            await this.$refs.okHttpList.refresh();
        }

    }
</script>
