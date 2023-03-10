import { Country } from 'entities/Country';
import { Currency } from 'entities/Currency';
import { ValidateProfileError } from 'features/EditableProfileCard/model/types/profile';

export interface Profile {
    firstname?: string;
    lastname?: string;
    age?: number;
    currency?: Currency;
    city?: string;
    country?: Country;
    username?: string;
    avatar?: string;
}

export interface ProfileSchema {
    data?: Profile;
    isLoading: boolean;
    error?: string;
    readonly: boolean;
    form?: Profile;
    validateError?: ValidateProfileError[];
}
