<template>
    <div class="content ok-has-text-primary-invert">
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

@Component({
    name: "OkPostMarkdownText",
    components: {VueMarkdown, OkTranslatableSmartText},
    subscriptions: function () {
        return {
            loggedInUser: this["userService"].loggedInUser
        }
    }
})
export default class extends Vue {
    @Prop(Object) readonly post: IPost;

    private userService: IUserService = okunaContainer.get<IUserService>(TYPES.UserService);

    $observables!: {
        loggedInUser?: BehaviorSubject<IUser>
    };

    // get highlightedItemUrl(value) {
    //     console.log(value)
    //     if (value.startsWith("#")) {
    //         this.$emit("onHashtagPressed", this.highlightedItemTextValue);
    //     } else if (value.startsWith("c/")) {
    //         this.$emit("onCommunityNamePressed", this.highlightedItemTextValue);
    //     } else if (value.startsWith("@")) {
    //         this.$emit("onUsernamePressed", this.highlightedItemTextValue);
    //     } else {
    //         this.$emit("onUrlPressed", this.highlightedItemTextValue);
    //     }
    //     switch (this.highlightedItemType) {
    //         case 'hashtag':
    //             return `/h/${textValue}`;
    //         case 'communityName':
    //             return `/c/${textValue}`;
    //         case 'username':
    //             return `/${textValue}`;
    //         case 'url':
    //             return textValue;
    //     }
    // },

    get processedContent() {
        let content = this.post.longText;
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
        console.log(content);
        return content;

        // return this.post.longText
        //     .replace(/@(\w+)/g, '<span class="ok-has-text-accent has-cursor-pointer text__highlight" @click="onMentionClick(\'$1\')">@$1</span>')
        //     .replace(/#(\w+)/g, '<span class="ok-has-text-accent has-cursor-pointer text__highlight" @click="onHashtagClick(\'$1\')">#$1</span>');
        // return this.post.longText
        //     .replace(/@(\w+)/g, `
        //     <span
        //     @click="onMentionClick('${$1}')
        //     class="ok-has-text-accent has-cursor-pointer text__highlight">@$1</span>
        //     `)
        //     .replace(/#(\w+)/g, '<span class="ok-has-text-accent has-cursor-pointer text__highlight">#$1</span>');
    }


    async translatePostText() {
        return await this.userService.translatePost({post: this.post});
    }

    get canTranslatePost() {
        return this.$observables.loggedInUser?.value?.canTranslatePost(this.post);
    }
}
</script>
