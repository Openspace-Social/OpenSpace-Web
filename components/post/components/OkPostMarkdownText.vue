<template>
    <div class="">
        <div
            :style="{
            'max-height': hideContent ? '300px' : 'none',
            'overflow': hideContent ? 'hidden' : 'none',
        }"
            ref="postMarkdownContent" class="content ok-has-text-primary-invert">
            <vue-markdown
                :anchorAttributes="{
                target: '_blank',
            }"
                :toc-anchor-class="'has-text-weight-bold ok-has-text-accent has-cursor-pointer text__highlight'"
                toc-anchor-link-class="has-text-weight-bold ok-has-text-accent has-cursor-pointer text__highlight"
                :html="true" :source="processedContent" class="content post-markdown ok-has-text-primary-invert"/>
            <!--        <ok-translatable-smart-text :initial-text="post.text"-->
            <!--                                    :can-translate-text="canTranslatePost"-->
            <!--                                    :translate-text="translatePostText"-->
            <!--        >-->
            <!--        </ok-translatable-smart-text>-->
            <!--        Show more and show less button -->
        </div>
        <div v-if="showMoreButton" class="has-padding-top-5">
            <a @click="hideContent = !hideContent" class="has-text-weight-bold ok-has-text-accent has-cursor-pointer">
                {{ hideContent ? 'Show More' : 'Show Less' }}
            </a>
        </div>
        <ok-translate-button v-if="canTranslatePost"
                             class="has-padding-top-10"
                             :is-showing-translation="showTranslatedText"
                             :is-translation-in-progress="translationInProgress"
                             :toggle-translate-text="toggleTranslatePostText">
        </ok-translate-button>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import {Component, Prop, Vue} from "nuxt-property-decorator"
import {IPost} from "~/models/posts/post/IPost";
import {okunaContainer} from "~/services/inversify";
import {TYPES} from "~/services/inversify-types";
import {IUserService} from "~/services/user/IUserService";
import {BehaviorSubject} from "rxjs";
import {IUser} from "~/models/auth/user/IUser";
import OkTranslatableSmartText from "~/components/smart-text/OkTranslatableSmartText.vue";
import VueMarkdown from "vue-markdown";

import {IUtilsService} from "~/services/utils/IUtilsService";
import OkTranslateButton from "~/components/smart-text/components/OkTranslateButton.vue";
import {IModalService} from "~/services/modal/IModalService";

@Component({
    name: "OkPostMarkdownText",
    components: {OkTranslateButton, VueMarkdown, OkTranslatableSmartText},
    subscriptions: function () {
        return {
            loggedInUser: this["userService"].loggedInUser
        }
    }
})
export default class extends Vue {
    @Prop(Object) readonly post: IPost;

    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);
    private utilsService: IUtilsService = okunaContainer.get<IUtilsService>(TYPES.UtilsService);
    private modalService: IModalService = okunaContainer.get<IModalService>(TYPES.ModalService);

    $observables!: {
        loggedInUser?: BehaviorSubject<IUser>
    };

    hideContent = false;
    showMoreButton = false;

    get processedContent() {
        let content = this.showTranslatedText ? this.translatedText : this.post.longText;
        const mentions = content.match(/@(\w+)/g);
        const hashtags = content.match(/#(\w+)/g);
        const communities = content.match(/c\/(\w+)/g);
        if (mentions) {
            mentions.forEach(mention => {
                content = content.replace(mention, `<a href="/${mention.replace('@', '')}"
                class="ok-has-text-accent has-cursor-pointer text__highlight">${mention}</a>`);
            });
        }
        if (hashtags) {
            hashtags.forEach(hashtag => {
                content = content.replace(hashtag, `<a href="/h/${hashtag.replace('#', '')}"
                class="ok-has-text-accent has-cursor-pointer text__highlight">${hashtag}</a>`);
            });
        }
        if (communities) {
            communities.forEach(community => {
                content = content.replace(community, `<a href="/c/${community.replace('c/', '')}"
                class="ok-has-text-accent has-cursor-pointer text__highlight">${community}</a>`);
            });
        }
        if (content.indexOf("<iframe>") !== -1) {
            content = content.replace("<iframe>", '\`<iframe>\`');
        }
        return content;
    }

    created() {
        this.$nextTick(() => {
            if (this.$refs.postMarkdownContent) {
                const scrollHeight = (this.$refs.postMarkdownContent as HTMLDivElement).scrollHeight;
                if (scrollHeight > 300) {
                    this.showMoreButton = true;
                    this.hideContent = true;
                }
                if (this.post.longText.indexOf("Lecture Outline") !== -1) {
                    this.translatePostText();
                }
                const imageTags = (this.$refs.postMarkdownContent as HTMLDivElement).querySelectorAll("img");
                for (let i = 0; i < imageTags.length; i++) {
                    imageTags[i].removeEventListener("click", this.openFullScreenImageModal);
                    imageTags[i].addEventListener("click", this.openFullScreenImageModal);
                }
            }
        });
    }

    openFullScreenImageModal(e: PointerEvent) {
        try {
            const imageUrl = (e.target as HTMLImageElement).src;
            this.modalService.openFullScreenImageModal({
                imageUrl
            });
        } catch (e) {}
    }

    translatedText: String = undefined;
    showTranslatedText: Boolean = false;
    translationInProgress: Boolean = false;

    async toggleTranslatePostText() {
        let showTranslated = !this.showTranslatedText;

        if (showTranslated && !this.translatedText) {
            try {
                this.translationInProgress = true;
                this.translatedText = await this.translatePostText();
            } catch (e) {
                showTranslated = false;
                const handledError = this.utilsService.handleErrorWithToast(e);
                if (handledError.isUnhandled) throw handledError.error;
            } finally {
                this.translationInProgress = false;
            }
        }

        this.showTranslatedText = showTranslated;
    }

    async translatePostText() {
        return await this.userService.translatePost({post: this.post});
    }

    get canTranslatePost() {
        return this.$observables.loggedInUser?.value?.canTranslatePost(this.post);
    }
}
</script>
