<template>
    <article class="ok-user-list-item">
        <ok-user-tile :user="user" clickable>
            <template v-slot:trailing>
                <ok-block-button
                    @refresh="refreshUsers"
                    :user="user" :buttonSize="OkFollowButtonSize.small"></ok-block-button>
            </template>
        </ok-user-tile>
    </article>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator';
import OkUserTile from '~/components/tiles/OkUserTile.vue';
import { IUser } from '~/models/auth/user/IUser';
import { OkFollowButtonSize } from '~/components/buttons/lib/OkFollowButtonSize';
import OkBlockButton from "~/components/buttons/OkBlockButton.vue";

@Component({
    name: 'OkFollowListItem',
    components: {OkBlockButton, OkUserTile }
})
export default class OkFollowListItem extends Vue {
    @Prop({
        type: Object,
        required: true
    }) readonly user: IUser;

    OkFollowButtonSize = OkFollowButtonSize;


    async refreshUsers() {
        this.$emit('refresh')
    }
}
</script>
