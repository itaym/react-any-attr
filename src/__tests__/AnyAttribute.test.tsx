import React from 'react';
import AnyAttribute, { asObject, asString } from '../index';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

let container: HTMLDivElement;
let refObject: string;

Enzyme.configure({ adapter: new Adapter() })

beforeEach((done) => {
    refObject = {current: undefined} as unknown as string;
    container = document.createElement('div');
    document.body.appendChild(container);
    done();
});
afterEach((done) => {
    document.body.removeChild(container);
    done();
})
type SELF = {
    testDiv1: HTMLDivElement|undefined|null
}

describe('AnyAttribute Component ', () => {
    test('it sets any property as Obj or Str like expected', () => {
        const
            self = {testDiv1: undefined} as SELF,
            getRef = function () { return refObject },
            testFunction = function () { return ''; },
            testObject = { value: 1 },
            testBadObj = { value: window };
        mount(
            <AnyAttribute attributes={{
                fnAsObject : asObject(testFunction),
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
                <div id={'testDiv1'} ref={(testDiv1) => self.testDiv1 = testDiv1} />
                <div id={'testDiv2'} ref={'testDiv2'} />
                <div id={'testDiv3'} ref={getRef()} />
                <div id={'testDiv4'} />
                not type 1 node
            </AnyAttribute>, { attachTo: container });

        function testAsObjectIndex(element:any, index:any, expected:any) {
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
        // @ts-ignore
            expect(divElement1).toBe(self.testDiv1);
            // @ts-ignore
            expect(divElement3).toBe(refObject.current);
    });
});