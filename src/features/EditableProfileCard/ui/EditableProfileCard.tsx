import { useTranslation } from 'react-i18next';

import { ChangeEvent, PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { Text } from 'shared/ui/Text/Text';
import { Button } from 'shared/ui/Button';
import { ProfileCard } from 'entities/Profile';
import { useSelector } from 'react-redux';
import { classNames } from 'shared/lib/classNames/classNames';
import { useAppDispatch } from 'shared/hooks/useAppDispatch/useAppDispatch';
import { Currency } from 'entities/Currency';
import { Country } from 'entities/Country';
import { isNumber } from 'shared/lib/validators/isNumber';
import cls from './EditableProfileCard.module.scss';
import { getProfileLoading } from '../model/selectors/getProfileLoading/getProfileLoading';
import { getProfileError } from '../model/selectors/getProfileError/getProfileError';
import { fetchProfileData } from '../model/services/fetchProfileData/fetchProfileData';
import { getProfileReadOnly } from '../model/selectors/getProfileReadOnly/getProfileReadOnly';
import { profileActions } from '../model/slice/profileSlice';
import { getProfileForm } from '../model/selectors/getProfileForm/getProfileForm';
import { updateProfileData } from '../model/services/updateProfileData/updateProfileData';
import { getProfileValidateError } from '../model/selectors/getProfileValError/getProfileValError';
import { ValidateProfileError } from '../model/types/profile';

interface EditableProfileCardProps {
    className?: string;
}

export const EditableProfileCard = (props: PropsWithChildren<EditableProfileCardProps>) => {
    const { className } = props;
    const { t: commonT } = useTranslation();
    const { t } = useTranslation('profile');
    const dispatch = useAppDispatch();

    const isLoading = useSelector(getProfileLoading);
    const error = useSelector(getProfileError);
    const data = useSelector(getProfileForm);
    const readonly = useSelector(getProfileReadOnly);
    const validateError = useSelector(getProfileValidateError);

    const validateErrorTranslate: Record<ValidateProfileError, string> = useMemo(
        () => ({
            FailUpdate: t('errors.no_data'),
            InvalidAge: t('errors.invalid_age'),
            InvalidAvatar: t('errors.invalid_avatar'),
            InvalidCity: t('errors.invalid_city'),
            InvalidCountry: t('errors.invalid_country'),
            InvalidCurrency: t('errors.invalid_currency'),
            InvalidFirstName: t('errors.invalid_firstname'),
            InvalidLastName: t('errors.invalid_lastname'),
            InvalidUsername: t('errors.invalid_username'),
            NoData: t('errors.no_data'),
        }),
        [t],
    );

    useEffect(() => {
        if (__ENVIRONMENT__ !== 'storybook') dispatch(fetchProfileData());
    }, [dispatch]);

    const onCancel = () => {
        dispatch(profileActions.cancelEdit());
    };

    const onEdit = () => {
        dispatch(profileActions.setReadonly(false));
    };

    const onSave = () => {
        if (__ENVIRONMENT__ !== 'storybook') dispatch(updateProfileData());
    };

    const onChangeFirstName = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(profileActions.updateProfile({ firstname: e.target.value }));
        },
        [dispatch],
    );

    const onChangeLastName = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(profileActions.updateProfile({ lastname: e.target.value }));
        },
        [dispatch],
    );

    const onChangeAge = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            if (isNumber(e.target.value) && +e.target.value < 100) {
                dispatch(profileActions.updateProfile({ age: +e.target.value }));
            }
        },
        [dispatch],
    );

    const onChangeAvatar = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(profileActions.updateProfile({ avatar: e.target.value }));
        },
        [dispatch],
    );

    const onChangeCountry = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            dispatch(profileActions.updateProfile({ country: e.target.value as Country }));
        },
        [dispatch],
    );

    const onChangeCity = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(profileActions.updateProfile({ city: e.target.value }));
        },
        [dispatch],
    );

    const onChangeUserName = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(profileActions.updateProfile({ username: e.target.value }));
        },
        [dispatch],
    );

    const onChangeCurrency = useCallback(
        (e: ChangeEvent<HTMLSelectElement>) => {
            dispatch(profileActions.updateProfile({ currency: e.target.value as Currency }));
        },
        [dispatch],
    );

    return (
        <div className={classNames(cls.EditableProfileCard, {}, [className])}>
            <header className={cls.header}>
                <Text title={t('title')} className={cls.title} />
                {readonly || isLoading ? (
                    <Button theme='background' disabled={isLoading} onClick={onEdit}>
                        {commonT('button.edit')}
                    </Button>
                ) : (
                    <>
                        <Button theme='outlineRed' disabled={isLoading} onClick={onCancel}>
                            {commonT('button.cancel')}
                        </Button>
                        <Button theme='backgroundInverted' disabled={isLoading} onClick={onSave}>
                            {commonT('button.save')}
                        </Button>
                    </>
                )}
            </header>

            {validateError?.map((error) => (
                <Text theme='error' key={error} text={validateErrorTranslate[error]} />
            ))}

            <ProfileCard
                data={data}
                error={error}
                isLoading={isLoading}
                readonly={readonly}
                onChangeFirstName={onChangeFirstName}
                onChangeLastName={onChangeLastName}
                onChangeAge={onChangeAge}
                onChangeAvatar={onChangeAvatar}
                onChangeCity={onChangeCity}
                onChangeUserName={onChangeUserName}
                onChangeCountry={onChangeCountry}
                onChangeCurrency={onChangeCurrency}
            />
        </div>
    );
};
