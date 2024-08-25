<template>
    <div>
        <ImagePreview v-if="imagePreview_path" :imagePreview="imagePreview_path"
            @remove-image-preview="handleRemoveImagePreview" ref="imagePreviewComponent" />

        <form @submit.prevent="onSubmit">
            <div class="field">
                <label for="text" class="label has-text-left ok-has-text-primary-invert-80 is-hidden">
                    {{ titleText }}
                </label>
                <div class="control">
                    <ok-resizable-text-area>
                        <text-complete name="text" id="commentPostPopup" required :placeholder="placeholderText"
                            ref="textareaInput" @focus="inputIsFocused = true" @blur="inputIsFocused = false"
                            :style="{ width: '100%', height: '100%' }" v-model="text" areaClass="textcomplete"
                            :strategies="strategies"></text-complete>
                    </ok-resizable-text-area>
                </div>
                <p class="help is-danger has-text-left" v-if="!$v.text.required && $v.text.$dirty">
                    {{ $t('global.errors.post_comment_text.required') }}
                </p>
                <p class="help is-danger has-text-left" v-if="!$v.text.maxLength && $v.text.$dirty">
                    {{ $t('global.errors.post_comment_text.max_length') }}
                </p>
            </div>



            <!-- Main container -->
            <nav class="level is-mobile" v-if="inputIsFocused || text || image">
                <!-- Left side -->
                <div class="level-left">
                    <div class="level-item">
                        <p class="subtitle is-5">
                            <ok-character-count :max-characters="postCommentMaxLength"
                                :character-count="text.length"></ok-character-count>
                        </p>
                    </div>
                </div>

                <!-- Right side -->
                <div class="level-right">
                    <div class="level-item">
                        <button
                            class="button is-success is-rounded ok-has-background-accent-gradient has-text-weight-bold is-small"
                            type="submit" :class="{ 'is-disabled': submitInProgress }"
                            :disabled="this.$v.$invalid || submitInProgress">
                            {{ submitText }}
                        </button>
                    </div>
                </div>
            </nav>
        </form>
    </div>
</template>


<style lang="scss">
.is-circular {
    width: 35px !important;
    height: 35px !important;
    border-radius: 500px !important;
}
</style>

<script lang="ts">
import { Validate } from "vuelidate-property-decorators";
import { Component, Prop, Vue, Watch } from "nuxt-property-decorator";
import { TYPES } from "~/services/inversify-types";
import { IUserService } from "~/services/user/IUserService";
import { okunaContainer } from "~/services/inversify";
import { IUtilsService } from "~/services/utils/IUtilsService";
import { CancelableOperation } from "~/lib/CancelableOperation";
import { IPost } from "~/models/posts/post/IPost";
import { IPostComment } from "~/models/posts/post-comment/IPostComment";
import { postCommentMaxLength, postCommentValidators } from "~/validators/post-comment";
import OkResizableTextArea from "~/components/OkResizableTextarea.vue";
import OkCharacterCount from "~/components/OkCharacterCount.vue";
import { IOkLogger } from "~/services/logging/types";
import { ILoggingService } from "~/services/logging/ILoggingService";
import TextComplete from 'v-textcomplete';
import OkPostCommenter from '@/components/post-theatre/post-theatre-sidebar/components/post-commenter/OkPostCommenter.vue';
import ImagePreview from "../post-theatre/post-theatre-sidebar/components/post-commenter/ImagePreview.vue";


@Component({
    name: "OkCommentPostForm",
    components: { OkCharacterCount, OkResizableTextArea, TextComplete, OkPostCommenter, ImagePreview }
})
export default class OkCommentPostForm extends Vue {

    @Prop(Object) readonly post: IPost;
    @Prop(Object) readonly postComment: IPostComment;
    @Prop(Object) readonly replyToPostComment: IPostComment;
    @Prop(Object) readonly editPostComment: IPostComment;
    @Prop(Function) readonly removeImagePreview: Function;
    @Prop({ type: File, default: null }) image: File | null;


    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private utilsService: IUtilsService = okunaContainer.get<IUtilsService>(TYPES.UtilsService);
    private loggingService: ILoggingService = okunaContainer.get<ILoggingService>(TYPES.LoggingService);
    private logger: IOkLogger;

    commentPostOperation?: CancelableOperation<IPostComment>;
    postCommentMaxLength = postCommentMaxLength;
    inputIsFocused = false;
    isPostCommentReply = false;
    isPostCommentEdit = false;
    formWasSubmitted = false;
    submitInProgress = false;

    imagePreview_path: string | null = null;

    image_edit: File | null = null;


    @Validate(postCommentValidators)
    text = "";

    replyToReplyPrependedMention = "";

    mounted() {
        this.logger = this.loggingService!.getLogger({
            name: "PostCommenter"
        });
    }

    destroyed() {
        if (this.commentPostOperation) this.commentPostOperation.cancel();
    }

    @Watch("postComment")
    onPostCommentChanged(val: IPostComment, oldVal: IPostComment) {
        this.isPostCommentReply = !!val;
    }

    @Watch("replyToPostComment")
    onReplyToPostCommentChanged(val: IPostComment, oldVal: IPostComment) {
        if (val) {
            this.replyToReplyPrependedMention = `@${this.postComment.commenter.username}`;
            this.text = `${this.replyToReplyPrependedMention} ${this.text}`;
        } else if (oldVal) {
            if (this.text.startsWith(this.replyToReplyPrependedMention)) {
                this.text = this.text.replace(this.replyToReplyPrependedMention, "");
            }
            this.replyToReplyPrependedMention = "";
        }
    }

    @Watch("editPostComment")
    async onEditPostCommentChanged(val: IPostComment, oldVal: IPostComment) {
        this.isPostCommentEdit = !!val;
        if (val) {
            this.text = val.text;
            if (val.image) {
                this.imagePreview_path = val.image.toString();
                // convert the string to a file
                this.image_edit = await this.utilsService.dataURLtoFile(val.image.toString());
                console.log("The image edit is", this.image_edit);

            } 

        }
    }


    handleRemoveImagePreview() {
        console.log("The handleremoveimagepreview is called");
        this.imagePreview_path = null;
        this.image = null;
        this.image_edit = null;
        this.removeImagePreview();
        this.$emit("update:imagePreview", null); // If needed to sync with parent
    }


    strategies = [{
        match: /(^|\s)@([a-z0-9+\-\_]*)$/,
        search: async (term, callback) => { },
        remote: async (term, callback) => {
            let v = await this.loadMentionItems('@', term, callback);
            callback(v);
        },
        template: (name) => {
            return name;
        },
        replace: (value) => {
            return '$1@' + value + ' ';
        },
    }, {
        match: /(^|\s)#([a-z0-9+\-\_]*)$/,
        search: async (term, callback) => { },
        remote: async (term, callback) => {
            let v = await this.loadMentionItems('#', term, callback);
            callback(v);
        },
        template: (name) => {
            return name;
        },
        replace: (value) => {
            return '$1#' + value + ' ';
        },
    }, {
        match: /(^|\s)c\/([a-z0-9+\-\_]*)$/,
        search: async (term, callback) => { },
        remote: async (term, callback) => {
            let v = await this.loadMentionItems('c/', term, callback);
            callback(v);
        },
        template: (name) => {
            return name;
        },
        replace: (value) => {
            return '$1c/' + value + ' ';
        },
    }];

    async loadMentionItems(mentionChar, searchTerm, callback) {
        let values;
        if (mentionChar === "@") {
            let users = [];
            if (searchTerm.length === 0) {
                users = await this.userService.linkedUsers();
            } else {
                users = await this.userService.searchUsers({
                    query: searchTerm
                });
            }
            values = users.map((user) => {
                return {
                    id: user.id,
                    value: user.username
                };
            });
            values = values.splice(0, 8);
        } else if (mentionChar === "#") {
            if (searchTerm.length === 0) {
                values = [];
            } else {
                let hashtags = await this.userService.searchHashtags({
                    query: searchTerm
                });
                values = hashtags.map((tag) => {
                    return {
                        id: tag.id,
                        value: tag.name
                    };
                });
                values = values.splice(0, 8);
            }
        } else if (mentionChar === "c/") {
            let communities = [];
            if (searchTerm.length === 0) {
                communities = await this.userService.getJoinedCommunities();
            } else {
                communities = await this.userService.searchCommunities({
                    query: searchTerm
                });
            }
            values = communities.map((user) => {
                return {
                    id: user.id,
                    value: user.name
                };
            });
            values = values.splice(0, 8);
        }
        return values.map((item) => {
            return item.value;
        });
        callback(values.map((item) => {
            return item.value;
        }));
    }

    get placeholderText() {
        return this.isPostCommentReply ?
            this.$t("forms.comment_post.placeholder_reply") :
            this.$t("forms.comment_post.placeholder");
    }

    get submitText() {
        return this.isPostCommentEdit ?
            this.$t("forms.comment_post.update_comment") :
            this.isPostCommentReply ?
                this.$t("forms.comment_post.submit_reply") :
                this.$t("forms.comment_post.submit");
    }

    get titleText() {
        return this.isPostCommentEdit ? this.$t("forms.comment_post.edit_comment") : this.isPostCommentReply ?
            this.$t("forms.comment_post.title_reply") :
            this.$t("forms.comment_post.title");
    }

    async onSubmit() {
        if (this.submitInProgress) return;
        this.submitInProgress = true;

        const formIsValid = await this._validateAll();

        this.formWasSubmitted = true;

        if (formIsValid) {
            await this._onSubmitWithValidForm();
        }

        this.submitInProgress = false;
    }

    async _onSubmitWithValidForm() {
        if (this.commentPostOperation) return;
        this.submitInProgress = true;

        try {
            this.commentPostOperation = CancelableOperation.fromPromise<IPostComment>(
                this.editPostComment ? this.userService.editPostComment({
                    text: this.text,
                    post: this.post,
                    image:  this.image_edit || this.image || null,
                    postComment: this.editPostComment
                }) :
                    this.postComment ? this.userService.replyToPostComment({
                        text: this.text,
                        post: this.post,
                        postComment: this.postComment
                    }) : this.userService.commentPost({
                        text: this.text,
                        post: this.post,
                        image: this.image || null
                    })
            );

            const postComment = await this.commentPostOperation.value;
            this._onCommentedPost(postComment, this.postComment);
            this.$v.$reset();
            this.reset();
        } catch (error) {
            const handledError = this.utilsService.handleErrorWithToast(error);
            if (handledError.isUnhandled) throw handledError.error;
        } finally {
            this.commentPostOperation = undefined;
        }
    }

    _validateAll() {
        this.$v.$touch();
        return !this.$v.$invalid;
    }

    reset() {
        this.text = "";
        this.replyToReplyPrependedMention = "";
        this.image = null;
        this.imagePreview_path = null;
        this.image_edit = null;
        this.removeImagePreview();
    }

    prependToText(value: string) {
        this.text = value + this.text;
    }

    setText(value: string) {
        this.text = value;
    }

    unprependFromText(value: string) {
        if (this.text.startsWith(value)) {
            this.text = this.text.replace(value, "");
        }
    }

    _onCommentedPost(postComment: IPostComment, parentPostComment: IPostComment) {
        this.logger.info("Commented post", postComment, parentPostComment);
        this.$emit("onCommentedPost", postComment, parentPostComment);
    }
}
</script>
