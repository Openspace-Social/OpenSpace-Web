<template>
  <div v-if="imagePreview" class="image-preview-container">
    <img :src="imagePreview" class="image-preview" />
    <button @click="removeImagePreview" class="delete-image-button">✕</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component({
    name: "ImagePreview"
})
export default class ImagePreview extends Vue {

    @Prop(String) readonly imagePreview!: string | null;

    removeImagePreview() {
        console.log("The removeImagePreview method was called");
        
        this.$emit("remove-image-preview");
    }
}
</script>

<style scoped>
.image-preview-container {
    position: relative;
    display: inline-block;
}

.image-preview {
    max-width: 100px;
    max-height: 100px;
    border-radius: 4px;
    object-fit: cover;
}

.delete-image-button {
    position: absolute;
    top: 0;
    right: 0;
    background: red;
    border: none;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    width: 20px;
    height: 20px;
    text-align: center;
    font-size: 14px;
}
</style>
