import { maxLength } from 'vuelidate/lib/validators';

export const postMaxLength = 5000;

export const longPostMinLength = 500;

export const postValidators = {
    maxLength: maxLength(postMaxLength),
};

export const longPostValidators = {
    minLength: maxLength(500),
};

