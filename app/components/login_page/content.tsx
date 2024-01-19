'use client';

import Button from '@app/button';
import CheckboxField from '@app/checkbox';
import InputField from '@app/input';
import Route from '@app/models/routes';
import Toast, { ToastProps } from '@app/toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPageContent() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formIsValid, setFormIsValid] = useState(true); // Change initial value to true
    const [toastOptions, setToastOptions] = useState<ToastProps>();

    useEffect(() => {
        if (!email && !password) return;

        validateForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [email, password]);

    const handleLogin = (event?: any) => {
        event.preventDefault();

        if (!validateForm(true)) return;

        fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password,
            }),
        }).then(async (response) => {
            const responseText = await response.text();

            if (response.status === 200) {
                setToastOptions({
                    text: responseText,
                    duration: 1500,
                    type: 'success'
                }); // Set toastType to success

                // If the response is ok, redirect to the movies page
                router.push(Route.movieList());
            } else {
                // If the response is not ok, display an error message
                setToastOptions({
                    text: responseText,
                    duration: 5000,
                    type: 'error'
                });
            }
        });
    };

    const validateEmail = (value: string) => {
        if (value === '') {
            return 'Email is required';
        }

        return undefined;
    };

    const validatePassword = (value: string) => {
        if (value === '') {
            return 'Password is required';
        }

        return undefined;
    };

    const validateForm = (force = false) => {
        if (!email || !password) {
            if (force) {
                setFormIsValid(false);
            }
            return false;
        }

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setFormIsValid(false);
            return false;
        }

        setFormIsValid(true);
        return true;
    };


    return (
        <div className='flex flex-row justify-center content-center h-screen -my-120'>
            {toastOptions && <Toast text={toastOptions.text} duration={toastOptions.duration} type={toastOptions.type} />}
            <div className='m-auto basis-4'>
                <h1 className='text-center'>Sign in</h1>
                <form onSubmit={handleLogin} >
                    <InputField
                        className='mt-40'
                        placeholder="Email"
                        type="text"
                        value={email}
                        onChange={setEmail}
                        validation={validateEmail}
                        isValid={formIsValid}
                    />
                    <InputField
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={setPassword}
                        validation={validatePassword}
                        isValid={formIsValid}
                    />
                    <CheckboxField
                        className='mx-auto'
                        label="Remember me"
                        value={password}
                        onChange={setPassword}
                        validation={validatePassword}
                    />
                    <Button type="submit" className='w-full' onClick={handleLogin} label="Login" disabled={!formIsValid} />
                </form>
            </div>
        </div>
    );
};
