'use client';

import Route from '@app/models/routes';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '../button';
import FileField from '../file';
import InputField from '../input';
import Toast, { ToastProps } from '../toast';

interface FormContentProps {
    title: string;
    movie?: IMovie;
    submitLabel: string;
    onSubmit: (movie: IMovie) => void;
}

function FormContent({ title, movie, submitLabel, onSubmit }: FormContentProps) {
    const router = useRouter();
    const [movieTitle, setMovieTitle] = useState<string>('');
    const [moviePublishingYear, setMoviePublishingYear] = useState<string>('');
    const [formIsValid, setFormIsValid] = useState(true); // Change initial value to true
    const [movieImage, setMovieImage] = useState<Blob>();
    const [movieImagePreview, setMovieImagePreview] = useState<string | undefined>(undefined);
    const [movieImageBase64, setMovieImageBase64] = useState<string | undefined>(undefined);

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        if (!movieImage) {
            setMovieImagePreview(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(movieImage);
        setMovieImagePreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [movieImage]);

    useEffect(() => {
        if (movie) {
            setMovieTitle(movie.title);
            setMoviePublishingYear(movie.publishingYear.toString());
            if (movie.poster) {
                setMovieImageBase64(movie.poster);
                setMovieImagePreview(movie.poster);
            }
        }
    }, [movie]);


    useEffect(() => {
        if (!movieTitle && !moviePublishingYear) return;

        validateForm();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movieTitle, moviePublishingYear]);

    const movieTitleValidation = (value: string) => {
        if (!value) {
            return 'Title is required';
        }
        if (value.length < 0) {
            return 'Title cannot be empty';
        }


        return undefined;
    };

    const moviePublishingYearValidation = (value: string) => {
        const regexp = new RegExp('^(19[0-9]{2}|20[0-9]{2})$');
        if (!regexp.test(value) || value > '2024' || value < '1900') {
            return 'Publishing year must be a number between 1900 and 2024';
        }

        return undefined;
    };

    const moviePosterChange = (file: any) => {
        if (!file || file.length === 0) {
            setMovieImage(undefined);
            return;
        }

        // I've kept this example simple by using the first image instead of multiple
        setMovieImage(file);

        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            setMovieImageBase64(reader.result as string);
        };
        reader.onerror = function (error) {
            setMovieImageBase64(undefined);
        };
    };

    const validateForm = (force = false) => {
        if (!movieTitle || !moviePublishingYear) {
            if (force) {
                setFormIsValid(false);
            }
            return false;
        }

        const movieTitleError = movieTitleValidation(movieTitle);
        const moviePublishingYearError = moviePublishingYearValidation(moviePublishingYear);

        if (movieTitleError || moviePublishingYearError) {
            setFormIsValid(false);
            return false;
        }

        setFormIsValid(true);
        return true;
    };

    const handleSubmit = (event?: any) => {
        event.preventDefault();

        if (!validateForm(true)) return;

        const data: IMovie = {
            id: movie?.id ?? -1,
            title: movieTitle.trim(),
            publishingYear: parseInt(moviePublishingYear),
            poster: movieImageBase64
        };

        onSubmit(data);
    };

    return (
        <div className='flex flex-col font-semibold' key={movieTitle + moviePublishingYear.toString() + movieImageBase64} >
            <h2>{title}</h2>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-row mt-120'>
                    <div className='basis-5'>
                        <FileField
                            preview={movieImagePreview}
                            onChange={moviePosterChange}
                        />
                    </div>
                    <div className='basis-1' />
                    <div className='flex flex-col basis-5'>
                        <InputField
                            placeholder='Title'
                            value={movieTitle}
                            onChange={setMovieTitle}
                            validation={movieTitleValidation}
                            isValid={formIsValid}
                        />
                        <InputField
                            className='w-[60%]'
                            placeholder='Publishing Year'
                            value={moviePublishingYear}
                            onChange={setMoviePublishingYear}
                            validation={moviePublishingYearValidation}
                            isValid={formIsValid}
                        />
                        <div className='flex-row mt-40'>
                            <Button onClick={() => router.push(Route.movieList())} label='Cancel' type='secondary' className='w-160' />
                            <Button onClick={handleSubmit} label={submitLabel} className='ml-16 w-160' disabled={!formIsValid} />
                        </div>
                    </div>
                </div >
            </form>
        </div >
    );
}

interface MovieFormContentProps {
    movie?: IMovie;
}

export function MovieFormContent({ movie }: MovieFormContentProps) {
    const router = useRouter();
    const [toastOptions, setToastOptions] = useState<ToastProps>();

    function onSubmit(movie: IMovie) {
        fetch('/api/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movie)
        }).then(async (response) => {
            const json = await response.json();

            if (response.status === 200) {
                setToastOptions({
                    text: json.message,
                    duration: 1500,
                    type: 'success'
                }); // Set toastType to success
                setTimeout(() => {
                    router.push(Route.movieList(json.moviePage));
                }, 1500);
                // If the response is ok, redirect to the movies page
            } else {
                // If the response is not ok, display an error message
                setToastOptions({
                    text: json.message,
                    duration: 5000,
                    type: 'error'
                });
            }
        });
    }


    return <div>
        {toastOptions && <Toast text={toastOptions.text} duration={toastOptions.duration} type={toastOptions.type} />}
        <FormContent
            title={movie ? "Edit" : "Create a new movie"}
            submitLabel={movie ? "Update" : 'Submit'}
            onSubmit={onSubmit}
            movie={movie}
        />
    </div>; // Pass onSubmit to FormContent
}