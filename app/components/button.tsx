import clsx from 'clsx';
import React from 'react';

interface ButtonProps {
    className?: string;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    type?: 'primary' | 'secondary' | 'submit';
}

const Button: React.FC<ButtonProps> = ({ className, onClick, label, disabled, type = 'primary' }) => {
    return (
        <button className={clsx(className, 'relative h-56 px-24 align-middle rounded-10 border-1 box-border', type !== 'secondary' && 'bg-primary border-primary', type === 'secondary' && 'bg-transparent border-white', disabled && 'cursor-default')} onClick={!disabled ? onClick : () => { }}>
            {disabled && <div className='absolute w-full h-full bg-black opacity-50 rounded-10 top-0 left-0' />}
            <p className='regular'>{label}</p>
        </button>
    );
};

export default Button;
