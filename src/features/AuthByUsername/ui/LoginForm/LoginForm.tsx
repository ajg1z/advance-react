/* eslint-disable indent */
import { useTranslation } from 'react-i18next';
import { ChangeEvent, memo, PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { classNames } from 'shared/lib/classNames/classNames';
import { Button } from 'shared/ui/Button';
import { Input } from 'shared/ui/Input/Input';
import { Field } from 'shared/ui/Field/Field';
import { Text } from 'shared/ui/Text';
import { useSelector } from 'react-redux';
import {
    DynamicModuleLoader,
    ReducersList,
} from 'shared/lib/components/DynamicModuleLoader/DynamicModuleLoader';
import { useAppDispatch } from 'shared/hooks/useAppDispatch/useAppDispatch';
import { getLoginError } from '../../model/selectors/getLoginError/getLoginError';
import { getLoginLoading } from '../../model/selectors/getLoginLoading/getLoginLoading';
import { getLoginUsername } from '../../model/selectors/getLoginUsername/getLoginUsername';
import { loginActions, loginReducer } from '../../model/slice/loginSlice';
import cls from './LoginForm.module.scss';
import { loginByUsername } from '../../model/services/loginByUsername/loginByUsername';
import { getLoginPassword } from '../../model/selectors/getLoginPassword/getLoginPassword';

interface LoginFormProps {
    className?: string;
    onSuccess: () => void;
}

const initialReducers: ReducersList = {
    login: loginReducer,
};

const LoginForm = memo((props: PropsWithChildren<LoginFormProps>) => {
    const { className, onSuccess } = props;
    const { t } = useTranslation();

    const password = useSelector(getLoginPassword);
    const username = useSelector(getLoginUsername);
    const isLoading = useSelector(getLoginLoading);
    const error = useSelector(getLoginError);

    const dispatch = useAppDispatch();

    const onChangeUsername = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(loginActions.setUsername(e.target.value));
        },
        [dispatch],
    );

    const onChangePassword = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            dispatch(loginActions.setPassword(e.target.value));
        },
        [dispatch],
    );

    const onLoginClick = useCallback(async () => {
        const result = await dispatch(
            loginByUsername({
                password,
                username,
            }),
        );
        if (result.meta.requestStatus === 'fulfilled') onSuccess();
    }, [dispatch, onSuccess, password, username]);

    useEffect(() => {
        dispatch(loginActions.setEmptyState());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DynamicModuleLoader isRemoveAfterUnmount reducers={initialReducers}>
            <div className={classNames(cls.LoginForm, {}, [className])}>
                <Text title={t('form_auth')} />
                <Field label={t('login')} className={cls.field}>
                    <Input
                        autofocus
                        theme='backgroundInverted'
                        value={username}
                        onChange={onChangeUsername}
                    />
                </Field>

                <Field label={t('password')} className={cls.field}>
                    <Input
                        theme='backgroundInverted'
                        value={password}
                        onChange={onChangePassword}
                    />
                </Field>
                <div className={cls.footer}>
                    {error && <Text theme='error' text={error} />}
                    <Button disabled={isLoading} className={cls.sign} onClick={onLoginClick}>
                        {t('sign')}
                    </Button>
                </div>
            </div>
        </DynamicModuleLoader>
    );
});

export default LoginForm;
