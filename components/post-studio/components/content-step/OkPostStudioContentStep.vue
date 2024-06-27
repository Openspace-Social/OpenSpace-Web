<template>
    <div class="ok-post-creator-content has-height-100-percent is-flex flex-direction-column">
        <ok-mobile-header>
                <span class="ok-has-text-primary-invert has-text-weight-bold">
                                {{ headerTitle }}
                            </span>
            <template v-slot:trailing>
                <div class="has-padding-10">
                    <template v-if="isEdit">
                        <button
                            class="button is-success is-rounded ok-has-background-accent-gradient has-text-weight-bold is-small"
                            :class="{'is-disabled' : saveInProgress}"
                            :disabled="!isValidPostContent || saveInProgress"
                            @click="onWantsToSavePost"
                        >
                            {{ $t("global.keywords.save") }}
                        </button>
                    </template>
                    <template v-else-if="hasCommunity">
                        <button
                            class="button is-success is-rounded ok-has-background-accent-gradient has-text-weight-bold is-small"
                            @click="onWantsToGoNext"
                            :disabled="!isValidPostContent"
                        >
                            {{ $t("global.keywords.share") }}
                        </button>
                    </template>
                    <template v-else>
                        <button
                            class="button is-rounded ok-has-background-primary-highlight has-text-weight-bold is-small ok-has-text-primary-invert"
                            @click="onWantsToGoNext"
                            :disabled="!isValidPostContent"
                        >
                            {{ $t("global.keywords.next") }}
                        </button>
                    </template>
                </div>
            </template>
        </ok-mobile-header>
        <div class="">
            <section>
                <div class="flex space-x-4 p-2 rounded-lg shadow-md">
                    <button @click="type = 'P'" :class="{ 'active-tab text-white': type === 'P' }"
                            class="flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300">
                        Short Post
                    </button>
                    <button @click="type = 'LP'" :class="{ 'active-tab text-white': type === 'LP' }"
                            class="flex-1 py-2 px-4 rounded-md focus:outline-none focus:shadow-outline-blue transition-all duration-300 ">
                        Long Post
                    </button>
                </div>
            </section>
        </div>
        <div
            class="ok-post-creator-content-body columns is-paddingless is-marginless is-mobile is-flex-1 overflow-auto">
            <div v-if="type == 'LP'" class="has-padding-20">
                <quill-editor
                    class="editor"
                    ref="myTextEditor"
                    :value="content"
                    :options="editorOptions()"
                    @change="onEditorChange($event)"
                />
            </div>
            <div v-if="type === 'P'" class="column is-narrow is-paddingless">
                <div
                    class="has-padding-top-20 has-padding-left-20 has-padding-bottom-20 is-flex flex-direction-column align-items-center">
                    <div>
                        <ok-logged-in-user-avatar :avatar-size="OkAvatarSize.medium"/>
                    </div>
                    <div class="has-padding-top-10">
                        <ok-character-count :maxCharacters="textMaxCharacters"
                                            :characterCount="text.length"/>
                    </div>
                </div>
            </div>
            <div v-if="type === 'P'" class="column is-relative is-paddingless">
                <div style="position: absolute; left: 0; right: 0; bottom: 0; top: 0; overflow-y: auto;"
                     class="has-padding-20">
                    <div class="field" style="height: 100%">
                        <label for="text" class="label has-text-left ok-has-text-primary-invert-80 is-hidden">
                            {{ $t('global.snippets.whats_going_on') }}
                        </label>
                        <div class="control" style="height: 100%">

                            <ok-resizable-text-area
                                :maxHeight="Infinity">
                                <text-complete
                                    name="text"
                                    id="newPostTextPopup"
                                    required
                                    :placeholder="$t('global.snippets.whats_going_on')"
                                    ref="textareaInput"
                                    :style="{width: '100%', height: '100%'}"
                                    v-model="text" areaClass="textcomplete"
                                    :strategies="strategies"></text-complete>
                            </ok-resizable-text-area>
                        </div>
                    </div>
                    <div v-if="mediaFile || hasPost" class="has-padding-bottom-20">
                        <ok-post-studio-media-preview :data="postStudioData"
                                                      @onWantsToRemoveFile="onWantsToRemoveFile"/>
                    </div>
                    <div v-if="!mediaFile && linkToPreview">
                        <template v-if="linkPreviewInProgress">
                            <ok-loading-indicator/>
                        </template>
                        <template v-else-if="linkPreview">
                            <ok-post-link-preview :link-preview="linkPreview"/>
                        </template>
                    </div>
                    <div v-if="community" class="has-padding-bottom-20">
                        <div class="ok-has-text-primary-invert-60 has-padding-bottom-10">
                            {{ $t('global.snippets.sharing_post_to') }}
                        </div>
                        <ok-community-tile :community="community" style="max-width: 400px"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="columns is-multiline is-mobile is-paddingless is-marginless" v-if="!mediaFile && !hasPost">
            <div v-if="type === 'P'" class="column is-narrow">
                <button @click="onWantsToPickMedia"
                        class="button is-rounded has-text-weight-bold is-borderless ok-media-button">
                    <img :src="mediaIcon" alt="Media icon" width="30px" class="has-padding-right-5">
                    {{ $t('global.keywords.media') }}
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.ok-media-button {
    background-color: #FCC14B;
    color: white;

    &:hover, &:focus {
        color: white !important;
    }
}

.active-tab {
    background-color: #FCC14B;
    color: #000000;

    &:hover, &:focus {
        opacity: 1;
        color: #000000
    }
}
</style>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'nuxt-property-decorator'
import {TYPES} from "~/services/inversify-types";
import {okunaContainer} from "~/services/inversify";
import {OkPostStudioData, OkPostStudioParams} from "~/components/post-studio/lib/OkPostCreatorTypes";
import OkLoggedInUserAvatar from "~/components/avatars/logged-in-user-avatar/OkLoggedInUserAvatar.vue";
import OkResizableTextArea from "~/components/OkResizableTextarea.vue";
import {longPostMinLength, longPostValidators, postMaxLength, postValidators} from "~/validators/post";
import {Validate} from "~/node_modules/vuelidate-property-decorators";
import {OkAvatarSize} from "~/components/avatars/lib/OkAvatarSize";
import OkCharacterCount from "~/components/OkCharacterCount.vue";
import OkCommunityTile from "~/components/tiles/OkCommunityTile.vue";
import {IMediaService, OkFile, OkMediaDestination} from "~/services/media/IMediaService";
import OkMobileHeader from "~/components/mobile-only/OkMobileHeader.vue";
import {CancelableOperation} from "~/lib/CancelableOperation";
import {IPost} from "~/models/posts/post/IPost";
import {IUserService} from "~/services/user/IUserService";
import {IUtilsService} from "~/services/utils/IUtilsService";
import OkPostStudioMediaPreview
    from "~/components/post-studio/components/content-step/components/OkPostStudioMediaPreview.vue";
import UrlMatcher from '~/lib/matchers/UrlMatcher';
import {ILinkPreview} from '~/models/link-previews/link-preview/ILinkPreview';
import OkLoadingIndicator from '~/components/utils/OkLoadingIndicator.vue';
import OkPostLinkPreview from '~/components/post/components/post-link-preview/OkPostLinkPreview.vue';
import TextComplete from 'v-textcomplete'

import Quill from 'quill'

import BlotFormatter from 'quill-blot-formatter';

Quill.register('modules/blotFormatter', BlotFormatter);

import ImageUploader from 'quill-image-uploader';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';

Quill.register("modules/imageUploader", ImageUploader);

import "quill-mention";
// import {Mention, MentionBlot} from "quill-mention";
// Quill.register({ "blots/mention": MentionBlot, "modules/mention": Mention });

var BlotsInline = Quill.import('blots/inline');
Quill.register('format/blotsInline', BlotsInline);

var DirectionAttribute = Quill.import('attributors/attribute/direction');
Quill.register(DirectionAttribute, true);
var AlignClass = Quill.import('attributors/class/align');
Quill.register(AlignClass, true);
var BackgroundClass = Quill.import('attributors/class/background');
Quill.register(BackgroundClass, true);
var ColorClass = Quill.import('attributors/class/color');
Quill.register(ColorClass, true);
var DirectionClass = Quill.import('attributors/class/direction');
Quill.register(DirectionClass, true);
var FontClass = Quill.import('attributors/class/font');
Quill.register(FontClass, true);
var SizeClass = Quill.import('attributors/class/size');
Quill.register(SizeClass, true);
var AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);
var BackgroundStyle = Quill.import('attributors/style/background');
Quill.register(BackgroundStyle, true);
var ColorStyle = Quill.import('attributors/style/color');
Quill.register(ColorStyle, true);
var DirectionStyle = Quill.import('attributors/style/direction');
Quill.register(DirectionStyle, true);
var FontStyle = Quill.import('attributors/style/font');
Quill.register(FontStyle, true);

@Component({
    name: "OkPostStudioContentStep",
    components: {
        OkPostLinkPreview,
        OkLoadingIndicator,
        OkPostStudioMediaPreview,
        OkMobileHeader,
        OkCommunityTile, OkCharacterCount, OkResizableTextArea, OkLoggedInUserAvatar,
        TextComplete
    },
})
export default class OkPostStudioContentStep extends Vue {


    @Prop({
        type: Object,
        required: true
    }) readonly params: OkPostStudioParams;

    @Prop({
        type: Object,
        required: true
    }) readonly data: OkPostStudioData;

    $refs: {
        textareaInput: HTMLInputElement
    };

    textInputFocused = false;

    OkAvatarSize = OkAvatarSize;

    saveInProgress = false;
    type = "P";

    @Validate(postValidators)
    text = "";

    @Validate(longPostValidators)
    longText = "";

    content = '';

    mentionItems = [
        {
            value: 'cat',
            label: 'Mr Cat',
        },
        {
            value: 'dog',
            label: 'Mr Dog',
        },
    ];

    strategies = [{
        match: /(^|\s)@([a-z0-9+\-\_]*)$/,
        search: async (term, callback) => {
        },
        remote: async (term, callback) => {
            let v = await this.loadMentionItems('@', term, callback)
            console.log(v);
            callback(v);
        },
        template: (name) => {
            return name;
        },
        replace: (value) => {
            return '$1@' + value + ' '
        },
    }, {
        match: /(^|\s)#([a-z0-9+\-\_]*)$/,
        search: async (term, callback) => {
        },
        remote: async (term, callback) => {
            let v = await this.loadMentionItems('#', term, callback)
            console.log(v);
            callback(v);
        },
        template: (name) => {
            return name;
        },
        replace: (value) => {
            return '$1#' + value + ' '
        },
    }, {
        match: /(^|\s)c\/([a-z0-9+\-\_]*)$/,
        search: async (term, callback) => {
        },
        remote: async (term, callback) => {
            let v = await this.loadMentionItems('c/', term, callback)
            console.log(v);
            callback(v);
        },
        template: (name) => {
            return name;
        },
        replace: (value) => {
            return '$1c/' + value + ' '
        },
    }];

    linkToPreview = '';
    linkPreviewInProgress = false;
    linkPreview: ILinkPreview = null;


    mediaFile: OkFile | null = null;

    textMaxCharacters = postMaxLength;
    private saveOperation?: CancelableOperation<IPost>;
    private mediaService: IMediaService = okunaContainer.get<IMediaService>(TYPES.MediaService);
    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private utilsService: IUtilsService = okunaContainer.get<IUtilsService>(TYPES.UtilsService);
    private linkPreviewOperation?: CancelableOperation<ILinkPreview>;

    mounted() {
        if (this.data) {
            if (this.data.text) this.text = this.data.text;
            if (this.data.media && this.data.media.length) this.mediaFile = this.data.media[0];
            if (this.data.postType) this.type = this.data.postType;
            if (this.data.longText) {
                this.content = this.data.longText;
                this.longText = this.data.longText;
            }
        }

        if (this.params.data) {
            if (this.params.data.text) this.text = this.params.data.text;
            if (this.params.data.postType) this.type = this.params.data.postType;
            if (this.params.data.longText) {
                this.content = this.params.data.longText;
                this.longText = this.params.data.longText;
            }
        }

        if (this.params.post) {
            this.text = this.params.post.text || "";
            if (this.params.post.type) this.type = this.params.post.type;
            if (this.params.post.longText) {
                this.content = this.params.post.longText;
                this.longText = this.params.post.longText;
            }
        }
        // this.$nextTick(() => this.$refs.textareaInput.focus());
    }

    destroyed() {
        this.linkPreviewOperation?.cancel();
    }

    onWantsToGoNext() {
        this.$emit("onWantsToGoToNextStep", this.postStudioData);
    }

    onEditorChange({html, text}) {
        this.content = html
        this.longText = html
    }

    @Watch('text')
    onTextChanged(val: string, oldVal: string) {
        const link = this.text.split(' ').find((word: string) => UrlMatcher.test(word));
        if (link) {
            if (link !== this.linkToPreview) {
                this.linkToPreview = link;
                this.previewLink();
            }
        } else if (this.linkToPreview) {
            this.linkToPreview = '';
            this.linkPreview = null;
        }
    }

    private async previewLink() {
        this.linkPreviewOperation?.cancel();
        this.linkPreviewInProgress = true;

        try {
            this.linkPreviewOperation = CancelableOperation.fromPromise(this.userService.previewLink({
                link: this.linkToPreview
            }));

            this.linkPreview = await this.linkPreviewOperation.value;
        } catch (error) {
            this.linkToPreview = '';
            this.linkPreview = null;
        } finally {
            this.linkPreviewInProgress = false;
        }
    }

    get postStudioData() {
        const postStudioData: OkPostStudioData = {
            text: this.text,
            longText: this.longText,
            postType: this.type
        };

        if (this.community) postStudioData.community = this.community;

        if (this.post) postStudioData.post = this.post;

        if (this.mediaFile) {
            postStudioData.media = [
                this.mediaFile
            ];
        }

        return postStudioData;
    }


    async onWantsToSavePost() {
        if (this.saveInProgress) return;
        this.saveInProgress = true;


        try {
            this.saveOperation = CancelableOperation.fromPromise(this.userService.editPost({
                post: this.post,
                text: this.text,
                longText: this.longText,
                type: this.type,
            }));

            const savedPost = await this.saveOperation.value;

            this.$emit("onSavedPost", savedPost);
        } catch (error) {
            this.utilsService.handleErrorWithToast(error);
        } finally {
            this.saveOperation = null;
            this.saveInProgress = false;
        }
    }

    async onWantsToPickMedia() {
        const file = await this.mediaService.pickMedia({
            destination: OkMediaDestination.post
        });

        if (file) {
            this.onPickedFile(file);
        }
    }

    onWantsToRemoveFile() {
        this.mediaFile = null;
    }

    get post() {
        return this.params?.post;
    }

    get hasPost() {
        return !!this.post;
    }

    get community() {
        return this.params?.community;
    }

    get hasCommunity() {
        return !!this.community;
    }


    get isEdit() {
        return !!this.params.post;
    }

    get headerTitle() {
        return this.isEdit ? this.$t("global.snippets.edit_post") : this.$t("global.snippets.create_post")
    }

    get isValidPostContent() {
        if (this.type === 'P') {
            if (this.text) {
                if (this.text.length > postMaxLength) return false;
            } else if (!this.mediaFile) {
                return false;
            }
        } else {
            if (this.type === 'LP') {
                return this.longText.length >= longPostMinLength;
            }
        }


        return true;
    }

    private onPickedFile(file: OkFile) {
        this.mediaFile = file;
    }


    get mediaIcon() {
        return require("./assets/media-icon.png");
    }

    async loadMentionItems(mentionChar, searchTerm, callback) {
        // this.mentionItems = [];
        console.log(mentionChar, searchTerm);
        let values;
        if (mentionChar === "@") {
            let users = []
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
                }
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
                    }
                });
                values = values.splice(0, 8);
            }
        } else if (mentionChar === "c/") {
            // this.userService.getJoinedCommunities();
            let communities = []
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
                }
            });
            values = values.splice(0, 8);
        }
        console.log(values);
        console.log(values.map((item) => {
            return item.value
        }));
        return values.map((item) => {
            return item.value
        });
        callback(values.map((item) => {
            return item.value
        }));
    }


    editorOptions() {
        return {
            placeholder: this.$t('global.snippets.whats_going_on'),
            modules: {
                toolbar: [
                    ['bold', 'italic', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{'header': 1}, {'header': 2}],
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'script': 'sub'}, {'script': 'super'}],
                    [{'indent': '-1'}, {'indent': '+1'}],
                    [{'direction': 'rtl'}],
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],
                    [{'font': []}],
                    [{'color': []}, {'background': []}],
                    [{'align': []}],
                    ['clean'],
                    ['link', 'image', 'video']
                ],
                imageUploader: {
                    upload: (file) => {
                        return this.userService.uploadGenericMedia(file)
                            .then((response) => {
                                return response.url;
                            })
                            .catch((error) => {
                                console.error(error);
                                return '';
                            });
                    },
                },
                blotFormatter: {
                    // see config options below
                },
                mention: {
                    allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
                    mentionDenotationChars: ["@", "#", "c/"],
                    source: async (searchTerm, renderList, mentionChar) => {
                        let values;
                        if (mentionChar === "@") {
                            let users = []
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
                                }
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
                                    }
                                });
                                values = values.splice(0, 8);
                            }
                        } else if (mentionChar === "c/") {
                            // this.userService.getJoinedCommunities();
                            let communities = []
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
                                }
                            });
                            values = values.splice(0, 8);
                        }
                        renderList(values, searchTerm);
                    }
                }
            }
        };
    }
}
</script>
