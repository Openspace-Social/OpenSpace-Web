<template>
    <section class="ok-blocked-users-stream">
        <ok-http-list
            :refresher="blockedUsersRefresher"
            :on-scroll-loader="blockedUsersOnScrollLoader"
            :searcher="blockedUsersSearcher"
            ref="okHttpList"
        >
            <ok-blocked-user-list-item
                slot-scope="props"
                @refresh="refreshUsers"
                :user="props.item"
            ></ok-blocked-user-list-item>
        </ok-http-list>
    </section>
</template>

<style lang="scss" scoped>
    .ok-blocked-users-stream {
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

    @Component({
        name: 'OkBlockedUsersStream',
        components: {OkBlockButton, OkBlockedUserListItem, OkHttpList, OkUserListItem },
        subscriptions: function () {
            return {
                loggedInUser: this['userService'].loggedInUser
            };
        }
    })
    export default class OkBlockedUsersStream extends Vue {
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

        blockedUsers: IUser[] = [];

        async blockedUsersSearcher(query: string): Promise<IUser[]> {
            return this.userService.searchBlockedUsers({
                query
            });
        }

        async blockedUsersRefresher(): Promise<IUser[]> {
            return this.userService.getBlockedUsers({
                count: OkBlockedUsersStream.infiniteScrollChunkFollowersCount
            });
        }

        async blockedUsersOnScrollLoader(users: IUser[]): Promise<IUser[]> {
            const lastFollowing = users[users.length - 1];
            const lastFollowingId = lastFollowing.id;

            return this.userService.getBlockedUsers({
                count: OkBlockedUsersStream.infiniteScrollChunkUsersCount,
                maxId: lastFollowingId
            });
        }

        async refreshUsers() {
            await this.$refs.okHttpList.refresh();
        }

    }
</script>
