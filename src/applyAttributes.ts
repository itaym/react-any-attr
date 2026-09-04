import { AttributeSetter, IAnyAttrOptions } from './module';

// A global symbol survives minification/mangling, unlike checking a
// function's `.name` (the previous, fragile detection mechanism).
const ATTRIBUTE_SETTER_MARKER = Symbol.for('react-any-attr/attribute-setter');

export function markAttributeSetter<F extends AttributeSetter>(fn: F): F {
    // @ts-ignore
    fn[ATTRIBUTE_SETTER_MARKER] = true;
    return fn;
}

export function isAttributeSetter(value: any): value is AttributeSetter {
    return typeof value === 'function' && value[ATTRIBUTE_SETTER_MARKER] === true;
}

// Applies `attributes` to `node`, removing any attribute that was present
// in `previous` but is no longer present in `attributes`.
export function applyAttributes(node: Element, attributes: IAnyAttrOptions, previous: IAnyAttrOptions) {
    for (const property of Object.keys(previous)) {
        if (!(property in attributes)) {
            node.removeAttribute(property);
        }
    }
    for (const property of Object.keys(attributes)) {
        const value = attributes[property];
        if (isAttributeSetter(value)) {
            value(node, property);
            continue;
        }
        if (value === undefined || value === null) {
            node.removeAttribute(property);
            continue;
        }
        node.setAttribute(property, value);
    }
}
