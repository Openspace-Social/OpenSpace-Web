<template>
    <div class="ok-posts-stream">
        <slot name="leading"></slot>
        <ok-http-list
                :refresher="refresher" :on-scroll-loader="onScrollLoader" ref="okHttpList"
                :item-class="postContainerClass" list-type="post">
            <div
                slot-scope="props">
                <ok-post
                    :post="props.item"
                    :post-display-context="postsDisplayContext"
                    @onPostDeleted="removePost"
                    @onPostReported="removePost"></ok-post>
                <div class="" v-if="props.index == 0">
                    <adsbygoogle
                        style="display:block"
                        data-ad-client="ca-pub-5544049773367307"
                        data-ad-slot="1659574095"
                        data-ad-format="autorelaxed"
                        data-full-width-responsive="true"></adsbygoogle>
                </div>

            </div>
        </ok-http-list>
    </div>
</template>

<style lang="scss">
    .ok-posts-stream {
        min-width: 100vw;

        @include for-size(tablet-portrait-up) {
            min-width: 500px;
        }

        @include for-size(desktop-up) {
            min-width: 635px;
        }
    }
</style>

<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator"
    import { IPost } from "~/models/posts/post/IPost";
    import OkPost from "~/components/post/OkPost.vue";
    import { PostDisplayContext } from "~/components/post/lib/PostDisplayContext";
    import {
        OkPostsStreamOnScrollLoader,
        OkPostsStreamRefresher
    } from "~/components/posts-stream/lib/OkPostsStreamParams";
    import OkHttpList from '~/components/http-list/OkHttpList.vue';
    import OkPostSkeleton from '~/components/skeletons/post/OkPostSkeleton.vue';

    @Component({
        name: "OkPostsStream",
        components: {OkHttpList, OkPost, OkPostSkeleton},
    })
    export default class OkPostsStream extends Vue {
        @Prop({
            type: Function,
            required: true
        }) readonly refresher: OkPostsStreamRefresher;

        @Prop({
            type: Function,
            required: true
        }) readonly onScrollLoader: OkPostsStreamOnScrollLoader;


        @Prop({
            type: Number,
            required: false,
            default: PostDisplayContext.timelinePosts
        }) readonly postsDisplayContext: PostDisplayContext;

        @Prop({
            type: String,
            required: false,
            default: ""
        }) readonly postContainerClass: string;

        $refs!: {
            okHttpList: OkHttpList<IPost>
        };


        // Public API methods

        refresh() {
            this.$refs.okHttpList.refresh();
        }

        addPostToTop(post: IPost) {
            this.$refs.okHttpList.addItemToTop(post);
        }

        removePost(post: IPost) {
            this.$refs.okHttpList.removeItem(post);
        }

    }
</script>
