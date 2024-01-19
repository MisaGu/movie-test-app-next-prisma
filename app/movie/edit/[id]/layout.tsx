'use client';

import { usePathname } from 'next/navigation';
import { cloneElement } from 'react';

export default function Layout({ children }: any) {
    const pathname = usePathname();
    const page = pathname.split('/').pop() || "";

    return cloneElement(children, { ...children.props, page });
}
