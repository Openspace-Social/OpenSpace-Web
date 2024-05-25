declare module "*.vue" {
    import Vue from 'vue'
    export default Vue
}


declare module "webpack-hot-middleware" {
    const middleware: any;
    export interface Options {
        [proName: string]: any;
    }
    export default middleware;
}

declare module "vue-quill-editor";
declare module "quill-image-uploader";
