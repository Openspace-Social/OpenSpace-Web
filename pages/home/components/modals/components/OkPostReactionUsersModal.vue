<template>
    <div class="is-flex justify-center align-items-center">
        <div class="ok-has-background-primary is-semi-rounded has-width-100-percent ok-generic-modal">
            <div class="box ok-has-background-primary-highlight">
                <div class="flex flex-row space-x-2">
                    <h2 class="is-size-5 has-padding-bottom-10 ok-has-text-primary-invert has-text-weight-bold">
                        {{ $t('global.keywords.users') }}
                    </h2>
                    <div class="">
                        <button
                            class="button is-rounded is-small ok-has-background-primary-highlight is-borderless has-text-weight-bold"
                        >
                        <span class="image is-16x16">
                            <img :src="currentEmojiCount.emoji.image" :alt="currentEmojiCount.emoji.keyword">
                        </span>
                            <span class="has-padding-left-10 ok-has-text-primary-invert">
                            {{ currentEmojiCount.count }}
                        </span>
                        </button>
                    </div>
                </div>

                <div>
                    <ok-load-more
                        :class="{'is-hidden': loadMoreIsBootstrapping}"
                        :load-more-bottom="loadMoreBottomPostComments"
                        :load-more-bottom-text="$t('components.reaction_users.load_more')"
                        :load-more-top-text="$t('components.reaction_users.load_more')"
                        ref="loadMore">
                        <div class="has-padding-bottom-20" v-for="reaction in reactionsUsers" :key="reaction.id">
                            <ok-user-tile :user="reaction.reactor" clickable>
                                <template v-slot:trailing>
                                    <ok-follow-button :user="reaction.reactor" :buttonSize="OkFollowButtonSize.small"></ok-follow-button>
                                </template>
                            </ok-user-tile>
                        </div>
                    </ok-load-more>
                    <ok-loading-indicator v-if="loadMoreIsBootstrapping"></ok-loading-indicator>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'nuxt-property-decorator';
import {PostReactionUsersModalParams} from '~/services/modal/IModalService';
import {IUserService} from "~/services/user/IUserService";
import {okunaContainer} from "~/services/inversify";
import {TYPES} from "~/services/inversify-types";
import {IPostReaction} from "~/models/posts/post-reaction/IPostReaction";
import OkPostComment
    from "~/components/post-theatre/post-theatre-sidebar/components/post-comments/components/post-comment/OkPostComment.vue";
import OkLoadingIndicator from "~/components/utils/OkLoadingIndicator.vue";
import OkLoadMore from "~/components/utils/load-more/OkLoadMore.vue";
import {CancelableOperation} from "~/lib/CancelableOperation";
import {IPostComment} from "~/models/posts/post-comment/IPostComment";
import {IUtilsService} from "~/services/utils/IUtilsService";
import OkUserTile from "~/components/tiles/OkUserTile.vue";
import OkFollowButton from "~/components/buttons/OkFollowButton.vue";
import {OkFollowButtonSize} from "~/components/buttons/lib/OkFollowButtonSize";

@Component({
    name: 'OkPostReactionUsersModal',
    components: {OkFollowButton, OkUserTile, OkLoadMore, OkLoadingIndicator, OkPostComment}
})
export default class OkPostReactionUsersModal extends Vue {
    @Prop({
        type: Object,
        required: false
    }) readonly params: PostReactionUsersModalParams;

    OkFollowButtonSize = OkFollowButtonSize;
    loadMoreIsBootstrapping = false;

    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private utilsService: IUtilsService = okunaContainer.get<IUtilsService>(TYPES.UtilsService);

    reactionsUsers: IPostReaction[] = [];
    private bootstrapLoadMoreOperation: CancelableOperation<IPostReaction[]>;

    get currentEmojiCount() {
        return this.params.post.reactionsEmojiCounts.find(reactionsEmojiCount => reactionsEmojiCount.emoji.id === this.params.emojiId);
    }

    mounted() {
        this.getReactionUsers();
    }

    async getReactionUsers() {
        if (this.bootstrapLoadMoreOperation) return;
        this.loadMoreIsBootstrapping = true;

        try {
            this.bootstrapLoadMoreOperation = CancelableOperation.fromPromise(this.userService.getPostReactions({
                post: this.params.post,
                emojiId: this.params.emojiId,
            }));
            this.reactionsUsers = await this.bootstrapLoadMoreOperation.value;
        } catch (error) {
            const handledError = this.utilsService.handleErrorWithToast(error);
            if (handledError.isUnhandled) throw handledError.error;
        } finally {
            this.bootstrapLoadMoreOperation = undefined;
            this.loadMoreIsBootstrapping = false;
        }
    }
    async loadMoreBottomPostComments() {
        if (this.bootstrapLoadMoreOperation) return;
        let localReactions = []
        // this.loadMoreIsBootstrapping = true;
        try {
            this.bootstrapLoadMoreOperation = CancelableOperation.fromPromise(this.userService.getPostReactions({
                post: this.params.post,
                emojiId: this.params.emojiId,
                maxId: this.reactionsUsers[this.reactionsUsers.length - 1].id,
            }));
            localReactions = await this.bootstrapLoadMoreOperation.value;
            this.reactionsUsers = this.reactionsUsers.concat(localReactions);
        } catch (error) {
            const handledError = this.utilsService.handleErrorWithToast(error);
            if (handledError.isUnhandled) throw handledError.error;
        } finally {
            this.bootstrapLoadMoreOperation = undefined;
            // this.loadMoreIsBootstrapping = false;
        }

        return localReactions.length > 0;
    }
}
</script>
