import React, { ReactElement, ReactNode, useLayoutEffect, useRef } from 'react';
import { AnyAttrProps, AttributeSetter, IAnyAttrOptions } from './module';
import { applyAttributes, markAttributeSetter } from './applyAttributes';

export { useAnyAttributes } from './useAnyAttributes';

export const asObject = function <T>(anything: T): AttributeSetter {
    return markAttributeSetter(function _asObjectOrAsStringClosure(node: Element, property: string) {
        // @ts-ignore
        node[property] = anything;
    });
}
export const asString = function <T>(anything: T): AttributeSetter {
    return markAttributeSetter(function _asObjectOrAsStringClosure(node: Element, property: string) {
        let anyValue: any = anything;
        if (anyValue instanceof Function) {
            node.setAttribute(property, anything as any);
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
    });
}
// Opt-in helper for HTML-idiomatic boolean attributes: present (empty string) when
// truthy, absent when falsy. Kept separate from the default `setAttribute` path so
// plain `true`/`false` values keep their existing (stringified) behavior.
export const asBoolean = function (anything: any): AttributeSetter {
    return markAttributeSetter(function _asBooleanClosure(node: Element, property: string) {
        if (anything) {
            node.setAttribute(property, '');
        }
        else {
            node.removeAttribute(property);
        }
    });
}

function isPlainFunctionComponent(type: any): boolean {
    if (typeof type !== 'function') {
        // host tags ("div"), class components, forwardRef/memo objects all support refs.
        return false;
    }
    return !(type.prototype && type.prototype.isReactComponent);
}

const AnyAttribute = function (props: AnyAttrProps) {
    const { children, attributes = {} as IAnyAttrOptions } = props;
    const nodesRef = useRef<Element[]>([]);
    const appliedRef = useRef<IAnyAttrOptions>({});
    const arrChildren: ReactNode[] = [].concat(children);

    const applyToAllNodes = function () {
        nodesRef.current.forEach((node: Element) => {
            applyAttributes(node, attributes, appliedRef.current);
        });
        appliedRef.current = attributes;
    }

    // Re-applies (and diffs away stale) attributes whenever the `attributes` prop
    // changes on an already-mounted set of nodes, not just once at mount time.
    useLayoutEffect(() => {
        applyToAllNodes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attributes]);

    let maxIndices = -1;
    const nodes: Element[] = [];
    const kids: ReactNode[] = React.Children.map(arrChildren, (element: ReactNode) => {
        // do not clone text/null/boolean nodes, it causes a "type is invalid" error.
        if (!element || typeof element === 'string' || typeof element === 'boolean') {
            return element;
        }
        maxIndices++;
        if (process.env.NODE_ENV !== 'production' && isPlainFunctionComponent((element as ReactElement).type)) {
            console.warn(
                'react-any-attr: AnyAttribute cannot attach a ref to a plain function component child. ' +
                'Wrap it with React.forwardRef, or call the useAnyAttributes hook inside it instead.'
            );
        }
        return React.cloneElement(element as ReactElement<any>, { ref });

        function ref(node: Element | null) {
            // string refs are not supported for it is deprecated
            // refs fire with null on detach/unmount; nothing to collect or apply then.
            if (!node) {
                return;
            }
            nodes.push(node);
            // @ts-ignore
            if (element.ref instanceof Function) {
                // this is for ref in the form: <div ref={element => this.element = element} />
                // @ts-ignore
                element.ref(node);
            }
            else {
                // @ts-ignore
                if (element.ref && typeof (element.ref) === 'object' && 'current' in element.ref) {
                    // this is for ref in the form:
                    // const elementRef = useRef()
                    // <div ref={elementRef} />
                    // @ts-ignore
                    element.ref.current = node;
                }
            }
            // refs are async in react, no callback or promise.
            if (nodes.length - 1 === maxIndices) {
                nodesRef.current = nodes;
                applyToAllNodes();
            }
        }
    }) as ReactNode[];

    return (<>{kids}</>);
}
export default AnyAttribute;
