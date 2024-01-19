import clsx from 'clsx';
import { useEffect, useState } from 'react';

interface InputProps {
    className?: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    validation: (value: string) => string | undefined;
    isValid?: boolean;
    type?: 'text' | 'password';
}

const InputField: React.FC<InputProps> = ({ className, placeholder, value, onChange, validation, isValid, type = 'text' }) => {
    const [errorText, setErrorText] = useState<string>();

    useEffect(() => {
        if (typeof isValid === 'undefined') return;
        if (isValid) {
            setErrorText(undefined);
        } else {
            const errorMessage = validation(value);
            setErrorText(errorMessage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isValid]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const errorMessage = validation(inputValue);
        setErrorText(errorMessage);
        onChange(inputValue);
    };

    return (
        <div className={clsx(className, 'input_field relative mb-24 select-none')}>
            <input type={type} className={clsx("bg-input_bg rounded-10 h-[45px] px-16 focus:outline-none border-1 border-input_bg text- w-full", errorText && 'text-input_error border-input_error')} placeholder={placeholder} onChange={handleInputChange} value={value} />
            {errorText && <p className="absolute mt-8 text-xs text-input_error">{errorText}</p>}
        </div>
    );
};

export default InputField;

