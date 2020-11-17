/// <reference types="react" />
import * as React from 'react';
export declare const buttonClass: string;
export declare const Button: (props: React.HTMLProps<HTMLButtonElement>) => JSX.Element;
export declare const Alert: (props: {
    children?: any;
}) => JSX.Element;
export declare const AlertSuccess: (props: {
    children?: any;
}) => JSX.Element;
export declare const Vertical: ({children, className}: {
    children?: any;
    className?: string | undefined;
}) => JSX.Element;
export declare const Horizontal: ({children}: {
    children?: any;
}) => JSX.Element;
export declare const fadeIn: string;
