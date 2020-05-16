import { PropsWithChildren } from "react";

export interface IAnyAttrOptions {
    [key: string]: any;
}

export interface AnyAttrProps extends PropsWithChildren<any> {
    attributes: IAnyAttrOptions;
}