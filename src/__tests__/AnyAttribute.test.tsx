import React, { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AnyAttribute, { asObject, asString, asBoolean } from '../index';

type SELF = {
    testDiv1: HTMLDivElement | undefined | null
}

describe('AnyAttribute Component ', () => {
    test('it sets any property as Obj or Str like expected', () => {
        const
            self = { testDiv1: undefined } as SELF,
            refObject = { current: undefined } as unknown as { current: any },
            testFunction = function () { return ''; },
            testObject = { value: 1 },
            testBadObj = { value: window };
        render(
            <AnyAttribute attributes={{
                fnAsObject: asObject(testFunction),
                fnAsString: asString(testFunction),
                objAsObject: asObject(testObject),
                objAsString: asString(testObject),
                fnAsIs: testFunction,
                objAsIs: testObject,
                badAsString: asString(testBadObj),
                asSimpleString: 'hello world',
                asNumber: 1,
                asNumberString: asString(1),
                asNumberObject: asObject(1),
            }}>
                <div id={'testDiv1'} ref={(testDiv1: HTMLDivElement | null) => { self.testDiv1 = testDiv1; }} />
                <div id={'testDiv2'} ref={'testDiv2' as any} />
                <div id={'testDiv3'} ref={refObject as any} />
                <div id={'testDiv4'} />
                not type 1 node
            </AnyAttribute>);

        function testAsObjectIndex(element: any, index: any, expected: any) {
            expect(element[index]).toBe(expected);
        }
        const divElement1 = document.getElementById('testDiv1');
        const divElement2 = document.getElementById('testDiv2');
        const divElement3 = document.getElementById('testDiv3');
        const divElement4 = document.getElementById('testDiv4');

        [divElement1, divElement2, divElement3, divElement4].forEach(divElement => {
            expect(divElement).not.toBeNull();
            if (divElement) {
                testAsObjectIndex(divElement, 'fnAsObject', testFunction);
                expect(divElement.getAttribute('fnAsString')).toBe('function () { return \'\'; }');
                testAsObjectIndex(divElement1, 'objAsObject', testObject);
                expect(divElement.getAttribute('objAsString')).toBe('{"value":1}');
                expect(divElement.getAttribute('badAsString')).toBe('[object Object]');
                expect(divElement.getAttribute('fnAsIs')).toBe('function () { return \'\'; }');
                expect(divElement.getAttribute('objAsIs')).toBe('[object Object]');
                expect(divElement.getAttribute('asSimpleString')).toBe('hello world');
                expect(divElement.getAttribute('asNumber')).toBe('1');
                expect(divElement.getAttribute('asNumberString')).toBe('1');
                testAsObjectIndex(divElement1, 'asNumberObject', 1);
            }
        });
        expect(divElement1).toBe(self.testDiv1);
        expect(divElement3).toBe(refObject.current);
    });

    test('does not throw when the attributes prop is omitted', () => {
        expect(() => render(
            <AnyAttribute>
                <div id="noAttrsDiv" />
            </AnyAttribute>
        )).not.toThrow();
    });

    test('does not throw when a child unmounts', () => {
        const { unmount } = render(
            <AnyAttribute attributes={{ foo: 'bar' }}>
                <div id="unmountDiv" />
            </AnyAttribute>
        );
        expect(() => unmount()).not.toThrow();
    });

    test('reactively updates attributes, and removes ones set to undefined/null, on re-render', async () => {
        const user = userEvent.setup();
        function Demo() {
            const [attrs, setAttrs] = useState<Record<string, any>>({ status: 'idle', keep: 'me' });
            return (
                <>
                    <button onClick={() => setAttrs({ status: 'active', removed: undefined, gone: null })}>
                        update
                    </button>
                    <AnyAttribute attributes={attrs}>
                        <div id="reactiveDiv" />
                    </AnyAttribute>
                </>
            );
        }
        render(<Demo />);
        const div = document.getElementById('reactiveDiv') as HTMLDivElement;
        expect(div.getAttribute('status')).toBe('idle');
        expect(div.getAttribute('keep')).toBe('me');

        await user.click(screen.getByText('update'));

        expect(div.getAttribute('status')).toBe('active');
        expect(div.hasAttribute('keep')).toBe(false);
        expect(div.hasAttribute('removed')).toBe(false);
        expect(div.hasAttribute('gone')).toBe(false);
    });

    test('asBoolean sets/removes a presence attribute without touching plain booleans', () => {
        render(
            <AnyAttribute attributes={{
                trueBoolean: asBoolean(true),
                falseBoolean: asBoolean(false),
                plainTrue: true,
                plainFalse: false,
            }}>
                <div id="booleanDiv" />
            </AnyAttribute>
        );
        const div = document.getElementById('booleanDiv') as HTMLDivElement;
        expect(div.getAttribute('trueBoolean')).toBe('');
        expect(div.hasAttribute('falseBoolean')).toBe(false);
        expect(div.getAttribute('plainTrue')).toBe('true');
        expect(div.getAttribute('plainFalse')).toBe('false');
    });

    test('warns when wrapping a plain function component without forwardRef', () => {
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
        function PlainFunctionComponent() {
            return <div id="plainFnDiv" />;
        }
        render(
            <AnyAttribute attributes={{ foo: 'bar' }}>
                <PlainFunctionComponent />
            </AnyAttribute>
        );
        expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('cannot attach a ref'));
        warnSpy.mockRestore();
    });
});
