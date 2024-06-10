<template>
    <div
        class="ok-post-media"
        :style="{ width: postElementWidth + 'px', height: mediaContainerHeight + 'px', backgroundImage: `url('${post.mediaThumbnail}')` }"
        @click="onWantsToExpandPost"
    >
        <div v-if="postMedia.length > 0" class="ok-post-media-item-container">
            <ok-fitted-img
                v-if="hasImageMedia"
                :key="firstMediaItem?.id || post.mediaThumbnail"
                :src="mediaUrl"
                :alt="'Post Image'"
                :style="{ maxHeight: '100%', maxWidth: '100%', objectFit: imageFitStyle }"
                class="ok-post-media-image"
            ></ok-fitted-img>
            <ok-post-media-video
                v-else
                :post-media="firstMediaItem"
                :is-responsive="videoIsResponsive"
                :media-height="mediaContainerHeight"
                :media-width="postElementWidth"
                :post-uuid="post.uuid"
            ></ok-post-media-video>
            <ok-post-media-cropped-icon v-if="displayCroppedIcon" class="cropped-icon"></ok-post-media-cropped-icon>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { IPost } from "~/models/posts/post/IPost";
import OkPostMediaImage from "~/components/post/components/post-media/components/OkPostMediaImage.vue";
import { PostMediaType } from "~/models/posts/post-media/lib/PostMediaType";
import { IPostMedia } from "~/models/posts/post-media/IPostMedia";
import { TYPES } from "~/services/inversify-types";
import { IUserService } from "~/services/user/IUserService";
import { IModalService } from "~/services/modal/IModalService";
import { okunaContainer } from "~/services/inversify";
import OkPostMediaVideo from "~/components/post/components/post-media/components/OkPostMediaVideo.vue";
import { PostDisplayContext } from "~/components/post/lib/PostDisplayContext";
import OkFittedImg from "~/components/images/OkContainedImage.vue";
import OkPostMediaCroppedIcon from "~/components/post/components/post-media/components/OkPostMediaCroppedIcon.vue";

@Component({
    name: "OkPostMedia",
    components: { OkFittedImg, OkPostMediaVideo, OkPostMediaImage, OkPostMediaCroppedIcon },
})
export default class extends Vue {
    @Prop(Object) readonly post!: IPost;
    @Prop(Number) readonly postElementWidth!: number;
    @Prop({ type: Boolean, default: false }) readonly videoIsResponsive!: boolean;
    @Prop(Number) readonly postDisplayContext!: PostDisplayContext;

    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private modalService: IModalService = okunaContainer.get<IModalService>(TYPES.ModalService);

    postMedia: IPostMedia[] = [];
    displayCroppedIcon: boolean = false;
    imageFitStyle: string = "contain"; // Default image fit style

    mounted() {
        this.refreshPostMedia();
    }

    refreshPostMedia() {
        this.userService.getPostMedia({ post: this.post }).then((postMedia) => {
            this.post.media = postMedia;
            this.postMedia = postMedia;
            this.displayCroppedIcon = window.innerHeight * 0.7 < this.mediaContainerHeight;
            this.setImageFitStyle(); // Set initial image fit style after media is loaded
        });
    }

    get mediaContainerHeight(): number {
        const thumbnailAspectRatio = this.post.mediaWidth / this.post.mediaHeight;
        return this.postElementWidth / thumbnailAspectRatio;
    }

    get hasImageMedia(): boolean {
        const imageItem = this.postMedia.find((mediaItem) => mediaItem.type === PostMediaType.image);
        return !!imageItem; // Ensure it returns true/false correctly
    }

    get firstMediaItem(): IPostMedia | undefined {
        return this.postMedia.length > 0 ? this.postMedia[0] : undefined;
    }

    get mediaUrl(): string {
        if (this.firstMediaItem && this.firstMediaItem.mediaUrl) {
            return this.firstMediaItem.mediaUrl;
        } else {
            return this.post.mediaThumbnail;
        }
    }

    onWantsToExpandPost(e: Event): void {
        const element = e.target as HTMLElement;
        if (element?.closest(".vjs-control-bar")) {
            // User clicked on a videojs control item, don't show modal in this scenario.
            return;
        }

        this.modalService.openPostModal({ post: this.post });
    }

    setImageFitStyle(): void {
        const mediaItem = this.firstMediaItem;
        if (mediaItem && mediaItem.type === PostMediaType.image) {
            const imageWidth = mediaItem.width || this.postElementWidth;
            const imageHeight = mediaItem.height || this.mediaContainerHeight;

            if (imageWidth > this.postElementWidth || imageHeight > this.mediaContainerHeight) {
                this.imageFitStyle = "contain"; // Zoom out
            } else {
                this.imageFitStyle = "cover"; // Zoom in
            }
        } else {
            // Fallback to handle the thumbnail
            const imageWidth = this.post.mediaWidth;
            const imageHeight = this.post.mediaHeight;

            if (imageWidth > this.postElementWidth || imageHeight > this.mediaContainerHeight) {
                this.imageFitStyle = "contain"; // Zoom out
            } else {
                this.imageFitStyle = "cover"; // Zoom in
            }
        }
    }
}
</script>


<style lang="scss" scoped>
.ok-post-media {
    position: relative;
    max-height: 70vh;
    overflow: hidden;
    background-position: center;
    background-size: contain;
    cursor: pointer;

    .ok-post-media-item-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .ok-post-media-image {
        display: block;
        max-width: 100%;
        max-height: 100%;
        object-fit: contain; // Adjust object-fit as needed
    }

    .cropped-icon {
        position: absolute;
        bottom: 5px; // Adjust as needed
        right: 5px; // Adjust as needed
        z-index: 10; // Ensure it's above other content
    }
}
</style>
