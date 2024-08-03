import { required, maxLength, requiredIf } from 'vuelidate/lib/validators';

export const postCommentMaxLength = 5000;

export const postCommentValidators = {
        required: requiredIf(function() {
            return this.image === null;
        }),
        maxLength: maxLength(postCommentMaxLength)
};
