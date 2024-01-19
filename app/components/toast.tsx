import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

export interface ToastProps {
    text: string;
    duration?: number;
    type?: 'success' | 'error';
}

const Toast: React.FC<ToastProps> = ({ text, duration = 3000, type }) => {
    const [visible, setVisible] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => prev + 50);
        }, 50);
        const timer = setTimeout(() => {
            setVisible(false);
            setProgress(0);
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className={clsx('toast top-24 left-0 flex w-full mx-auto', visible ? 'fixed' : 'hidden')}>
            <div className={clsx('relative bg-input_bg p-12 rounded-10 mx-auto basis-4 text-center overflow-hidden', type == 'success' && 'bg-primary', type == 'error' && 'bg-input_error')}>
                <span>{text}</span>
                <div className='bg-white absolute bottom-0 h-2 left-0 transition-all' style={{ width: ((progress / duration) * 100) + '%' }} />
            </div>

        </div>
    );
};

export default Toast;
