import clsx from 'clsx';
import { useRef, useState } from 'react';

interface CheckboxProps {
    className?: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    validation: (value: string) => string | undefined;
    defaultErrorText?: string;
}

const CheckboxField: React.FC<CheckboxProps> = ({ className, label, value, onChange, validation, defaultErrorText }) => {
    const [errorText, setErrorText] = useState(defaultErrorText);
    const [checked, setChecked] = useState(false);
    const ref = useRef<HTMLInputElement>(null);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checkboxValue = e.target.value;
        const errorMessage = validation(checkboxValue);
        if (errorMessage) {
            setErrorText(errorMessage);
        }
        onChange(checkboxValue);
        setChecked(ref.current?.checked ?? false);
    };

    return (
        <div className={clsx(className, 'checkbox_field relative mb-24 w-fit select-none')}>
            <label className={clsx('flex flex-row', errorText && 'text-input_error border-input_error')}>
                <input type="checkbox" className="absolute w-0 h-0 p-0 opacity-0 focus:outline-none" onChange={handleCheckboxChange} ref={ref} />
                <span className={clsx("relative bg-input_bg rounded-5 h-[18px] w-[18px] m-4 mr-8 border-1 border-transparent", errorText && '!border-input_error')}>
                    {checked && <span className={clsx("absolute w-[6px] h-[10px] mt-2 ml-4 border-chevron border-solid border-white rotate-45", errorText && '!border-input_error')}></span>}
                </span>
                <span className='leading-6'>{label}</span>
            </label>
            {errorText && <p className="absolute mt-8 text-xs text-input_error">{errorText}</p>}
        </div>
    );
};

export default CheckboxField;

