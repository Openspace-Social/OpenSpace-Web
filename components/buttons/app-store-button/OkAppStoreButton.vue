<template>
    <a href="https://apps.apple.com/ca/app/openspace/id6467404678"  target="_blank" rel="noreferrer nofollow">
        <figure class="image">
            <img :src="appleAppStoreBadge" alt="Apple app store badge">
        </figure>
    </a>
</template>

<style lang="scss">

</style>

<script lang="ts">
    import { Component, Prop, Vue } from "nuxt-property-decorator"

    @Component({
        name: "OkAppStoreButton",
        components: {},
    })
    export default class OkAppStoreButton extends Vue {
        get appleAppStoreBadge (){
            return require('./assets/app-store-badge.png');
        }

    }
</script>
