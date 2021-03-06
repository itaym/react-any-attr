import React, { ReactElement, ReactNode } from 'react';
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
        if (anyValue instanceof Object) {
            try {
                anyValue = JSON.stringify(anything);
            }
            catch {
                anyValue = anything;
            }
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
                const properties = Object.keys(attributes);
                for (const property of properties) {
                    if ((attributes[property] instanceof Function) &&
                        (attributes[property].name === '_asObjectOrAsStringClosure')) {
                        attributes[property](node, property);
                        continue;
                    }
                    node.setAttribute(property, attributes[property]);
                }
            });
        }
    }
    let maxIndices = -1;
    const kids:ReactNode[] = React.Children.map(arrChildren, (element: ReactNode) => {
        // do not clone text nodes, it cause an type is invalid error.
        if (element && typeof(element) === "string") {
            return element;
        }
        maxIndices++;
        return React.cloneElement(element as ReactElement, { ref });

        function ref(node:Element) {
            nodes.push(node);
            // string refs are not supported for it is deprecated
            // @ts-ignore
            if (element.ref instanceof Function) {
                // this is for ref in the form: <div ref={element => this.element = element} />
                // @ts-ignore
                element.ref(node);
            }
            else {
                // @ts-ignore
                if (element.ref && typeof (element.ref) === 'object' && Object.keys(element.ref).includes('current')) {
                    // this is for ref in the form:
                    // const elementRef = useRef()
                    // <div ref={elementRef} />
                    // @ts-ignore
                    element.ref.current = node;
                }
            }
            // refs are async in react, no callback or promise.
            afterRefs(nodes.length - 1 === maxIndices);
        }
    }) as ReactNode[];

    return (<>{kids}</>);
}
export default AnyAttribute;