'use client';

import React, { useId } from 'react';
import Button from '@app/button';
import { useRouter } from 'next/navigation';
import Route from '@app/models/routes';
import Image from 'next/image';
import clsx from 'clsx';
import { hashCode } from '@app/utils/client_service';

export const EmptyMoviesList: React.FC = () => {
    const router = useRouter();

    return (
        <div className='flex item-center justify-center h-screen'>
            <div className='m-auto text-center'>
                <h2>Your movie list is empty</h2>
                <Button
                    className='mt-40 font-semibold'
                    label='Add a new movie'
                    onClick={() => router.push(Route.movieCreate)}
                />
            </div>
        </div>
    );
};

interface FilledMoviesListProps extends IMoviesResponse { }

export const FilledMoviesList = ({ movies, totalPages, currentPage }: FilledMoviesListProps) => {
    const router = useRouter();
    const moviesArray = Array.from({ length: Math.ceil(movies.length / 4) }, (_, index) =>
        movies.slice(index * 4, (index + 1) * 4)
    );
    const moviesArrayHash = movies.map((movie) => {
        const data = movie.title + movie.publishingYear.toString() + movie.poster + movie.id.toString();

        return hashCode(data);
    }).reduce((acc, curr) => acc + curr, 0);

    function handleClick(movieId: number) {
        router.push(Route.movieEdit(movieId.toString()));
    }

    return <div key={totalPages + movies.length}>
        <header className='flex justify-between items-center'>
            <h2 className='flex flex-row items-center'>
                <span>Your movies</span>
                <svg xmlns="http://www.w3.org/2000/svg"
                    className='ml-12 w-32 h-32 cursor-pointer'
                    onClick={() => router.push(Route.movieCreate)}
                    viewBox="0 0 32 32"
                    fill="none"
                >
                    <g clipPath="url(#clip0_3_196)">
                        <path d="M17.3334 9.33332H14.6667V14.6667H9.33342V17.3333H14.6667V22.6667H17.3334V17.3333H22.6667V14.6667H17.3334V9.33332ZM16.0001 2.66666C8.64008 2.66666 2.66675 8.63999 2.66675 16C2.66675 23.36 8.64008 29.3333 16.0001 29.3333C23.3601 29.3333 29.3334 23.36 29.3334 16C29.3334 8.63999 23.3601 2.66666 16.0001 2.66666ZM16.0001 26.6667C10.1201 26.6667 5.33341 21.88 5.33341 16C5.33341 10.12 10.1201 5.33332 16.0001 5.33332C21.8801 5.33332 26.6667 10.12 26.6667 16C26.6667 21.88 21.8801 26.6667 16.0001 26.6667Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_3_196">
                            <rect width="32" height="32" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </h2>
            <a
                className='flex cursor-pointer'
                href={Route.logout}
            >
                <p className='regular h-fit mt-4'>Logout</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className='ml-12'>
                    <g clipPath="url(#clip0_7_232)">
                        <path d="M22.6667 10.6667L20.7867 12.5467L22.8933 14.6667H12V17.3333H22.8933L20.7867 19.44L22.6667 21.3333L28 16L22.6667 10.6667ZM6.66667 6.66667H16V4H6.66667C5.2 4 4 5.2 4 6.66667V25.3333C4 26.8 5.2 28 6.66667 28H16V25.3333H6.66667V6.66667Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_7_232">
                            <rect width="32" height="32" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </a>
        </header>
        <div className='flex flex-col my-120 space-y-24'>
            {moviesArray.map((row, rowIdx) => (<div key={rowIdx + moviesArrayHash} className='flex'>
                {row.map((movie) => (
                    <div className='relative basis-3 p-8 bg-input_bg rounded-12 border-1 border-transparent hover:border-white cursor-pointer' key={hashCode(movie.title + movie.publishingYear.toString() + movie.poster)} onClick={() => handleClick(movie.id)}>
                        <div className='h-[400px] rounded-12 overflow-hidden flex items-center' >
                            <Image
                                key={hashCode(movie?.poster ?? '')}
                                src={movie?.poster && movie.poster.length > 0 ? movie.poster : "/no_image.png"}
                                width={400}
                                height={400}
                                alt={`Poster of the ${movie.title} movie`}
                                priority={true}
                                className='rounded-12'
                            />
                        </div>
                        <div className='p-8'>
                            <p className='large'>{movie.title}</p>
                            <p className='small mt-8'>{movie.publishingYear}</p>
                        </div>
                    </div>
                ))}
            </div>))}
        </div>
        <Pagination totalPages={totalPages} currentPage={currentPage} />
    </div >;
};

interface PaginationProps extends Omit<FilledMoviesListProps, "movies"> { }


function Pagination({ totalPages, currentPage }: PaginationProps) {
    const router = useRouter();
    const prevIsDisabled = currentPage == 1;
    const nextIsDisabled = currentPage == totalPages;
    var pages: any[] = Array.from({ length: totalPages }, (_, index) => index + 1);

    if (totalPages > 5) {
        if (currentPage < 4) {
            pages = [1, 2, 3, 4, '...', totalPages];
        } else if (currentPage > totalPages - 3) {
            pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        } else {
            pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
        }
    }

    function hundredPages(value: number | string, index: number) {
        const currentPageIndex = pages.indexOf(currentPage);

        var page;
        if (typeof value == 'string') {
            page = currentPageIndex > index ? pages[0] + 1 : pages[pages.length - 1] - 1;
        } else {
            page = value;
        }

        router.push(Route.movieList(Math.min(page, totalPages)));
    };

    return (
        <div className="flex flex-row mx-auto w-fit items-center">
            <p
                className={clsx("regular cursor-pointer", prevIsDisabled && 'opacity-50 !cursor-default')}
                onClick={() => router.push(Route.movieList(Math.max(currentPage - 1, 1)))}
            >
                Prev
            </p>
            <div className='mx-12'>
                {pages.map((value, index) => (
                    <button
                        key={index}
                        className={`h-32 px-12 mx-4 rounded-4 text-center ${currentPage == value ? 'active bg-primary' : 'bg-input_bg'}`}
                        onClick={() => hundredPages(value, index)}
                    >
                        {value}
                    </button>
                ))}
            </div>
            <p
                className={clsx("regular cursor-pointer", nextIsDisabled && 'opacity-50 !cursor-default')}
                onClick={() => router.push(Route.movieList(Math.min(currentPage + 1, totalPages)))}
            >
                Next
            </p>
        </div>
    );
}