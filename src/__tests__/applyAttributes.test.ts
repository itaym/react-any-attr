import { applyAttributes, isAttributeSetter, markAttributeSetter } from '../applyAttributes';

describe('applyAttributes', () => {
    test('sets, updates and removes attributes based on a diff against previous', () => {
        const node = document.createElement('div');
        applyAttributes(node, { a: '1', b: '2' }, {});
        expect(node.getAttribute('a')).toBe('1');
        expect(node.getAttribute('b')).toBe('2');

        applyAttributes(node, { a: '1', c: '3' }, { a: '1', b: '2' });
        expect(node.getAttribute('a')).toBe('1');
        expect(node.hasAttribute('b')).toBe(false);
        expect(node.getAttribute('c')).toBe('3');
    });

    test('removes an attribute when its value is undefined or null', () => {
        const node = document.createElement('div');
        applyAttributes(node, { a: '1' }, {});
        applyAttributes(node, { a: undefined, b: null }, { a: '1' });
        expect(node.hasAttribute('a')).toBe(false);
        expect(node.hasAttribute('b')).toBe(false);
    });

    test('routes marked attribute setters through their closure instead of setAttribute', () => {
        const node = document.createElement('div');
        const setter = markAttributeSetter(function (n: Element, property: string) {
            // @ts-ignore
            n[property] = 'closure-applied';
        });
        applyAttributes(node, { custom: setter }, {});
        // @ts-ignore
        expect(node.custom).toBe('closure-applied');
        expect(node.hasAttribute('custom')).toBe(false);
    });

    test('detects a marked setter even after its function name is stripped/renamed (minification safety)', () => {
        const fn = function _originalName(n: Element, property: string) {
            n.setAttribute(property, 'still-works');
        };
        Object.defineProperty(fn, 'name', { value: 'a' });
        const marked = markAttributeSetter(fn);
        expect(isAttributeSetter(marked)).toBe(true);

        const node = document.createElement('div');
        applyAttributes(node, { foo: marked }, {});
        expect(node.getAttribute('foo')).toBe('still-works');
    });

    test('isAttributeSetter is false for plain functions and non-functions', () => {
        expect(isAttributeSetter(function () {})).toBe(false);
        expect(isAttributeSetter('a string')).toBe(false);
        expect(isAttributeSetter(null)).toBe(false);
    });
});
