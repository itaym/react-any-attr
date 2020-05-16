import React, {
    ReactElement,
    ReactNode,
} from 'react';
import { AnyAttrProps } from "./module";



export const asObject = function (anything:any) {
    return function _asObjectOrAsStringClosure (node:Element, property:string) {
        // @ts-ignore
        node[property] = anything;
    }
}
export const asString = function (anything:any) {
    return function _asObjectOrAsStringClosure (node:Element, property:string) {
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

const AnyAttribute = function (props:AnyAttrProps) {
    const { children, attributes } = props;
    const nodes:Element[] = [];
    const arrChildren:ReactNode[] = [].concat(children);

    const afterRefs = function (isLast:boolean) {
        if (isLast) {
            nodes.forEach((node: Element) => {
                for (const property in attributes) {
                    if (attributes.hasOwnProperty(property)) {
                        if ((attributes[property] instanceof Function) &&
                            (attributes[property].name === '_asObjectOrAsStringClosure')) {
                            attributes[property](node, property);
                            continue;
                        }
                        if (!(attributes[property] instanceof Object)) {
                            node.setAttribute(property, attributes[property]);
                            continue;
                        }
                        // @ts-ignore
                        node[property] = attributes[property];
                    }
                }
            });
        }
    }


    const kids:ReactNode[] = React.Children.map(arrChildren, (element: ReactNode, index) => {
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
    }) as ReactNode[];

    return (<>{kids}</>);
}
export default AnyAttribute;