import {PropsWithChildren, DetailedHTMLProps, ComponentProps} from "react";

export interface IAnyHtmlAttrOptions {
    [key: string]: any;
}

export interface AnyHtmlAttrProps extends PropsWithChildren<any> {
    attributes: IAnyHtmlAttrOptions;
}