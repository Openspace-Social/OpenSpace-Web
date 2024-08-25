<template>
    <section class="has-padding-20 ok-has-background-primary-highlight ok-post-commenter" v-if="loggedInUser">
        <div v-if="postComment" class="has-padding-bottom-20">
            <div class="card ok-has-background-primary-highlight">
                <header class="card-header">
                    <div class="card-header-icon has-padding-10" aria-label="remove reply" @click="reset" role="button">
                        <ok-close-icon class="ok-svg-icon-primary-invert"></ok-close-icon>
                    </div>
                </header>
                <div>
                    <p v-if="editComment"
                        class="has-padding-top-20 has-padding-left-20 font-bold ok-has-text-primary-invert is-size-6">
                        <span>{{ $t("forms.comment_post.edit_comment") }}</span>
                    </p>
                    <ok-post-comment :post="post" :post-comment="displayedPostComment" :show-actions="false"
                        :show-reactions="false" class=""></ok-post-comment>
                </div>
            </div>
        </div>
        <div class="media">
            <div class="media-left">
                <ok-user-avatar :user="loggedInUser" :avatar-size="this.OkAvatarSize.medium">
                </ok-user-avatar>
            </div>
            <div class="media-content">
                <ok-comment-post-form ref="commentPostForm" :post="post" :image="image" :post-comment="postComment"
                    :edit-post-comment="editComment" :remove-image-preview="removeImagePreview"
                    @onCommentedPost="onCommentedPost"></ok-comment-post-form>

                <!-- <div v-if="imagePreview" class="image-preview-container">
                    <img :src="imagePreview" class="image-preview" />
                    <button @click="removeImagePreview" class="delete-image-button">✕</button>
                </div> -->

                <ImagePreview :imagePreview="imagePreview" :isVisible="isPostCommentEdit"
                    @remove-image-preview="removeImagePreview" />
            </div>

            <label class="card-header-icon has-padding-5" aria-label="attach file" role="button" for="fileInput">
                <span class="material-symbols-outlined">attach_file</span>
            </label>
            <input type="file" id="fileInput" ref="fileInput" @change="handleFileUpload" accept="image/*"
                style="display: none;" />
        </div>
    </section>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

.ok-post-commenter {
    .card-content {
        padding-top: 0 !important;
    }

    .media {
        display: flex;
        align-items: center;

        .media-left {
            margin-right: 10px;
        }

        .media-content {
            flex: 1;
            overflow: hidden;
            width: 70%;

            .image-preview-container {
                position: relative;
                display: inline-block;

                .image-preview {
                    max-width: 100px;
                    margin-top: 10px;
                    border-radius: 5px;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
                }

                .delete-image-button {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: rgba(237, 13, 13, 0.8);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    padding: 0;
                }
            }
        }

        .card-header-icon {
            margin-left: 10px;
            font-size: 80px;
        }
    }

    .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
        font-size: 30px;
    }
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { Route } from "vue-router";
import { IUserService } from "~/services/user/IUserService";
import { TYPES } from "~/services/inversify-types";
import { okunaContainer } from "~/services/inversify";
import { IPost } from "~/models/posts/post/IPost";
import OkUserAvatar from "~/components/avatars/user-avatar/OkUserAvatar.vue";
import { OkAvatarSize } from "~/components/avatars/lib/OkAvatarSize";
import { IUser } from "~/models/auth/user/IUser";
import OkCommentPostForm from "~/components/forms/OkCommentPostForm.vue";
import { IPostComment } from "~/models/posts/post-comment/IPostComment";

import OkPostComment from "~/components/post-theatre/post-theatre-sidebar/components/post-comments/components/post-comment/OkPostComment.vue";
import {
    EditCommentParams,
    OnCommentedPostParams,
    ReplyToCommentParams,
    ReplyToReplyParams
} from "~/components/post-theatre/post-theatre-sidebar/lib/PostTheatreEventParams";
import ImagePreview from "./ImagePreview.vue";

@Component({
    name: "OkPostCommenter",
    components: { OkPostComment, OkCommentPostForm, OkUserAvatar, ImagePreview },
    subscriptions: function () {
        return {
            loggedInUser: this["userService"].loggedInUser
        };
    }
})
export default class OkPostCommenter extends Vue {
    @Prop(Object) readonly post: IPost;
    @Prop(Boolean) readonly isPostCommentEdit!: boolean;
    

    postComment: IPostComment = null;
    displayedPostComment: IPostComment = null;
    editComment: IPostComment = null;
    imagePreview: string | null = null;
    // store the image so that it can also be passed as a prop
    image: File | null = null;
    $route!: Route;

    $refs!: {
        commentPostForm: OkCommentPostForm;

        fileInput: HTMLInputElement; // Ensure TypeScript recognizes fileInput as an HTMLInputElement
    };

    OkAvatarSize = OkAvatarSize;

    loggedInUser: IUser;

    prependedUsernameMention = "";

    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);

    onCommentedPost(createdPostComment: IPostComment, parentPostComment: IPostComment) {
        const params: OnCommentedPostParams = {
            post: this.post,
            createdPostComment: createdPostComment,
            parentPostComment: parentPostComment,
            isEditComment: !!this.editComment
        };

        this.$emit("onCommentedPost", params);
        this.reset();
    }

    setReplyToCommentParams(params: ReplyToCommentParams) {
        this.postComment = params.postComment;
        this.displayedPostComment = params.postComment;
    }

    setEditCommentParams(params: EditCommentParams) {
        this.postComment = params.postComment;
        this.displayedPostComment = params.postComment;
        this.editComment = params.postComment;
        this.$refs.commentPostForm.setText(params.postComment.text);
    }

    setReplyToReplyParams(params: ReplyToReplyParams) {
        this.postComment = params.parentPostComment;
        this.displayedPostComment = params.postCommentReplyingTo;
        this.prependedUsernameMention = `@${params.postCommentReplyingTo.commenter.username} `;
        this.$refs.commentPostForm.prependToText(this.prependedUsernameMention);
    }

    reset() {
        this.postComment = null;
        this.$refs.commentPostForm.unprependFromText(this.prependedUsernameMention);
        if (this.editComment) {
            this.$refs.commentPostForm.reset();
        }
        this.editComment = null;
        this.prependedUsernameMention = "";
        this.displayedPostComment = null;
        this.imagePreview = null;
        this.image = null;
    }

    handleFileUpload() {
        const file = this.$refs.fileInput.files[0];
        if (file) {
            this.image = file; // Store the file directly
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview = e.target?.result as string; // Store the base64 for preview
            };
            reader.readAsDataURL(file);
        }
    }

    public removeImagePreview() {

        this.imagePreview = null;
        this.image = null;
        this.$refs.fileInput.value = null;
    
    }
}
</script>
