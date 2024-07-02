<template>
    <section class="is-flex flex-column align-items-center">
        <ok-posts-stream
                ref="postsStream"
                :refresher="postsRefresher"
                :on-scroll-loader="postsOnScrollLoader"
                :post-container-class="postContainerClass"
        ></ok-posts-stream>
    </section>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator";
    import OkPostsStream from "~/components/posts-stream/OkPostsStream.vue";
    import { IUserService } from "../../services/user/IUserService";
    import { okunaContainer } from "../../services/inversify";
    import { TYPES } from "../../services/inversify-types";
    import { IPost } from "../../models/posts/post/IPost";
    import { ITrendingPost } from "~/models/posts/trending-post/ITrendingPost";

    @Component({
        name: "OkPublicPostsStream",
        components: {OkPostsStream}
    })
    export default class OkPublicPostsStream extends Vue {
        static infiniteScrollChunkPostsCount = 10;

        @Prop({
            type: String,
            required: false,
            default: ""
        }) readonly postContainerClass: string;

        $refs: {
            postsStream: OkPostsStream
        };

        private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
        private trendingPosts: IPost[] = [];

        async postsRefresher(): Promise<IPost[]> {
            const initialTrendingPosts = await this.userService.getPublicPosts({
                count: OkPublicPostsStream.infiniteScrollChunkPostsCount,
            });

            this.trendingPosts = initialTrendingPosts;

            return initialTrendingPosts.map(trendingPost => trendingPost);
        }

        async postsOnScrollLoader(): Promise<IPost[]> {
            const lastPost = this.trendingPosts[this.trendingPosts.length - 1];
            const lastPostId = lastPost.id;

            const newTrendingPosts = await this.userService.getPublicPosts({
                maxId: lastPostId,
                count: OkPublicPostsStream.infiniteScrollChunkPostsCount,
            });

            this.trendingPosts.push(...newTrendingPosts);

            return newTrendingPosts.map(trendingPost => trendingPost);
        }

        refresh() {
            console.log('Refreshing public posts stream');
            this.$refs.postsStream.refresh();
        }
    }
</script>
