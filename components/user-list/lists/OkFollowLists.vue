<template>
    <div class="ok-has-background-primary is-semi-rounded has-width-100-percent">
        <div class="box ok-has-background-primary-highlight">
            <h2 class="is-size-5 has-padding-bottom-10 ok-has-text-primary-invert has-text-weight-bold">
                {{ $t('global.keywords.lists')}}
            </h2>
            <ok-follow-lists-stream></ok-follow-lists-stream>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'nuxt-property-decorator';

    import OkFollowListsStream from "~/components/user-list/lists/components/OkFollowListsStream.vue";

    @Component({
        name: 'OkFollowLists',
        components: { OkFollowListsStream }
    })
    export default class OkFollowLists extends Vue {
    }
</script>
