<template>
    <div class="">
        <section v-if="!showEditList" class="">
            <div class="flex flex-row justify-between pb-8 items-center">
                <button
                    @click="onClickBack"
                    class="is-rounded has-text-weight-bold is-small ok-has-text-accent">
                    <ok-chevron-left-icon />
                    {{ $t('global.keywords.back')}}
                </button>
                <button
                    @click="showEditList = true"
                    class="button is-rounded ok-has-background-primary-highlight has-text-weight-bold is-small ok-has-text-primary-invert">
                    {{ $t('global.keywords.edit')}}
                </button>
            </div>
            <div class="flex flex-col">
                <article
                    v-if="selectedList != null"
                    class="media has-overflow-hidden is-flex align-items-center cursor-pointer">
                    <div class="media-content has-z-index-1">
                        <div class="has-text-overflow-ellipsis">
                            <div class="is-flex align-center">
                                <span class="ok-has-text-primary-invert text-3xl has-text-weight-bold">
                                    {{selectedList.name}}
                                </span>
                            </div>
                        </div>
                    </div>
                    <figure class="media-left">
                        <ok-list-avatar :list="selectedList" class="has-padding-left-10"></ok-list-avatar>
                    </figure>
                </article>
                <div class="has-text-overflow-ellipsis mt-5">
                    <div class="is-flex align-center">
                    <span class="ok-has-text-primary-invert text-2xl has-text-weight-bold">
                        {{ $t('global.keywords.users') }}
                    </span>
                    </div>
                </div>
                <div class="flex flex-col">
                    <template v-for="user of selectedList.users">
                        <ok-user-list-item :user="user" ></ok-user-list-item>
                    </template>
                </div>
            </div>
        </section>
        <section v-if="showEditList">
            <OkCreateList @list-updated="onListUpdated" :existing-list="selectedList" @back-clicked="showEditList = false" />
        </section>
    </div>
</template>

<style scoped lang="scss">

</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import OkUserListItem from "~/components/user-list/common/user-list-item/OkUserListItem.vue";
import OkListAvatar from "~/components/user-list/lists/components/OkListAvatar.vue";
import OkLoadingIndicator from "~/components/utils/OkLoadingIndicator.vue";
import {IList} from "~/models/lists/list/IList";
import {Prop} from "nuxt-property-decorator";
import OkCreateList from "~/components/user-list/lists/components/OkCreateList.vue";

@Component({
    components: {OkCreateList, OkLoadingIndicator, OkListAvatar, OkUserListItem}
})
export default class OkSelectedList extends Vue {

    @Prop({
        type: Object,
        required: true
    }) selectedList: IList;

    showEditList = false;

    onClickBack() {
        this.$emit('back-clicked');
    }

    onListUpdated() {
        this.showEditList = false;
        this.$emit('list-updated');
    }

}
</script>
