import { useLayoutEffect, useRef, useState } from 'react';
import { IAnyAttrOptions } from './module';
import { applyAttributes } from './applyAttributes';

// Alternative to wrapping <AnyAttribute>: attach directly as a ref on a single
// element, e.g. <input ref={useAnyAttributes({ attr: 'value' })} />. Works on
// plain function components' own DOM nodes too, sidestepping the fact that a
// plain function component can't itself receive an injected ref.
export function useAnyAttributes<T extends Element = Element>(
    attributes: IAnyAttrOptions = {}
): (node: T | null) => void {
    const [node, setNode] = useState<T | null>(null);
    const appliedRef = useRef<IAnyAttrOptions>({});

    useLayoutEffect(() => {
        if (node) {
            applyAttributes(node, attributes, appliedRef.current);
            appliedRef.current = attributes;
        }
        else {
            appliedRef.current = {};
        }
    }, [node, attributes]);

    return setNode;
}
