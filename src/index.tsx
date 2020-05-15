import React, {
    ReactElement,
    ReactNode,
} from 'react';
import {AnyHtmlAttrProps} from "./module";

export const asObject = function (anything:any) {
    return function (node:Element, property:string) {
        // @ts-ignore
        node[property] = anything;
    }
}
export const asString = function (anything:any) {
    return function (node:Element, property:string) {
        let anyValue = anything;
        if (anyValue instanceof Function) {
            node.setAttribute(property, anything);
            return;
        }
        if (anyValue instanceof Object){
            try {
                anyValue = JSON.stringify(anything);
            }
            finally {
                if (!anyValue) {
                    anyValue = anything;
                }
            }
        }
        if (anything.toString) {
            anything = anything.toString();
        }
        node.setAttribute(property, anyValue);
    }
}

export const AnyAttribute = function(props:AnyHtmlAttrProps) {
    const { children, attributes } = props;
    const nodes:Element[] = [];
    const arrChildren:ReactNode[] = [].concat(children);

    const afterRefs = function (isLast:boolean) {
        if (isLast) {
            nodes.forEach((node: Element) => {
                for (const property in attributes) {
                    if (attributes.hasOwnProperty(property)) {
                        if (attributes[property] instanceof Function) {
                            attributes[property](node, property);
                            continue;
                        }
                        if (!(attributes[property] instanceof Object)) {
                            node.setAttribute(property, attributes[property]);
                        }
                        // @ts-ignore
                        node[property] = attributes[property];
                    }
                }
            });
        }
    }


    const kids = React.Children.map(arrChildren, (element: ReactNode, index) => {
        return React.cloneElement(element as ReactElement, { ref });

        function ref(node:Element) {
            if (node.nodeType === 1) {
                nodes.push(node);
            }
            // @ts-ignore
            if (element && element.ref) {
                // @ts-ignore
                element.ref(node);
            }
            // refs is async in react, no callback or promise.
            afterRefs(index === arrChildren.length - 1);
        }
    });

    return (<>{kids}</>);
}