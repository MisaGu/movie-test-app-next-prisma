import clsx from 'clsx';
import { useState } from 'react';
import Image from 'next/image';

interface CheckboxProps {
    className?: string;
    preview?: string;
    onChange: (value: Blob) => void;
}

const FileField: React.FC<CheckboxProps> = ({ className, preview, onChange }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileValue = e.target.files?.[0];
        if (!fileValue) return;

        onChange(fileValue);
    };

    return (
        <div className={clsx(className, 'file_field relative w-full h-[500px] select-none')}>
            <label
                className={clsx("relative flex justify-center w-full h-full px-4 transition bg-input_bg border-1 border-white border-dashed rounded-10 appearance-none cursor-pointer outline-none overflow-hidden")}>
                {preview && <div className='absolute top-0 left-0 bg-input_bg w-full h-full flex items-center'>
                    <Image src={preview}
                        width={500}
                        height={500}
                        alt={`Poster preview`}
                        priority={true}
                        className='rounded-12 ' />
                </div>
                }
                <div className="flex flex-col justify-center items-center space-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_3_346)">
                            <path d="M18 15V18H6V15H4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V15H18ZM17 11L15.59 9.59L13 12.17V4H11V12.17L8.41 9.59L7 11L12 16L17 11Z" fill={"white"} />
                        </g>
                        <defs>
                            <clipPath id="clip0_3_346">
                                <rect width="24" height="24" fill={"white"} />
                            </clipPath>
                        </defs>
                    </svg>
                    <p className="small">
                        Drop an image here, or
                        <span className="ml-4 underline">browse</span>
                    </p>
                </div>
                <input type="file" accept="image/png, image/jpeg" name="file_upload" className="hidden" onChange={handleFileChange} />
            </label>
        </div>
    );
};

export default FileField;

