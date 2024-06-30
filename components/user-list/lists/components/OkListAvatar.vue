<template>
    <div>
        <ok-image-avatar v-if="list.emoji.image" :avatar-url="list.emoji.image" :avatar-size="this.avatarSize"
                         :avatar-border-radius="avatarBorderRadius">
        </ok-image-avatar>
        <ok-letter-avatar v-else :letter="list.name.charAt(0)" :avatar-size="this.avatarSize"
                          :avatar-border-radius="avatarBorderRadius"></ok-letter-avatar>
    </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator"
import { OkAvatarSize } from "~/components/avatars/lib/OkAvatarSize";
import OkImageAvatar from "~/components/avatars/image-avatar/OkImageAvatar.vue";
import { OkAvatarBorderRadius } from "~/components/avatars/lib/OkAvatarBorderRadius";
import { ICommunity } from "~/models/communities/community/ICommunity";
import OkLetterAvatar from "~/components/avatars/letter-avatar/OkLetterAvatar.vue";
import {IList} from "~/models/lists/list/IList";

@Component({
    name: "OkListAvatar",
    components: {OkLetterAvatar, OkImageAvatar},
})
export default class extends Vue {
    @Prop(Object) readonly list: IList;
    @Prop(Number) readonly avatarSize: OkAvatarSize;
    @Prop(Number) readonly avatarBorderRadius: OkAvatarBorderRadius;

}
</script>
