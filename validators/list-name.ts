import { required, maxLength, minLength } from 'vuelidate/lib/validators';
import {IUserService} from "~/services/user/IUserService";

export const listNameMaxLength = 32;
export const listNameMinLength = 1;

export const listNameValidator = {
    required,
    maxLength: maxLength(listNameMaxLength),
    minLength: minLength(listNameMinLength),
    // check api for list name
    // async isUnique(value: string) {
    //     if (value === '') return true
    //     try {
    //         await this.$followsApiService.listNameCheck(name);
    //         return true;
    //     } catch (error) {
    //         console.log(error);
    //         if (error.response.status === 400) {
    //             return false;
    //         }
    //         throw error;
    //     }
    // }
};

export function createListNameValidator(userApiService: IUserService) {
    return {
        required,
        maxLength: maxLength(listNameMaxLength),
        minLength: minLength(listNameMinLength),
        async isUnique(value: string) {
            if (value === '') return true;
            try {
                await userApiService.isListNameAvailable(value);
                return true;
            } catch (error) {
                console.log(error);
                if (error.response.status === 400) {
                    return false;
                }
                return false;
            }
        }
    };
}
