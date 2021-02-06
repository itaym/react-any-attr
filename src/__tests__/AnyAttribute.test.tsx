import React from 'react';
import AnyAttribute, { asObject, asString } from '../index';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const container = document.createElement('div');

Enzyme.configure({ adapter: new Adapter() })

beforeAll((done) => {
    document.body.appendChild(container);
    done();
});
afterAll((done) => {
    document.body.removeChild(container);
    done();
})

describe('AnyAttribute Component ', () => {
    test('it sets any property as Obj or Str like expected', () => {
        const testFunction = function () { return ''; };
        const testObject = { value: 1 };
        const testBadObj = { value: window }
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
                <div id={'testDiv1'} ref={() => 'testDiv1'} />
                <div id={'testDiv2'} ref={'testDiv2'} />
                <div id={'testDiv3'} />
                not type 1 node
            </AnyAttribute>, { attachTo: container });

        function testAsObjectIndex(element:any, index:any, expected:any) {
            expect(element[index]).toBe(expected);
        }
        const divElement = document.getElementById('testDiv1');
        expect(divElement).not.toBeNull();
        if (divElement) {
            testAsObjectIndex(divElement, 'fnAsObject', testFunction);
            expect(divElement.getAttribute('fnAsString')).toBe('function () { return \'\'; }');
            testAsObjectIndex(divElement, 'objAsObject', testObject);
            expect(divElement.getAttribute('objAsString')).toBe('{"value":1}');
            expect(divElement.getAttribute('badAsString')).toBe('[object Object]');
            expect(divElement.getAttribute('fnAsIs')).toBe('function () { return \'\'; }');
            expect(divElement.getAttribute('objAsIs')).toBe('[object Object]');
            expect(divElement.getAttribute('asSimpleString')).toBe('hello world');
            expect(divElement.getAttribute('asNumber')).toBe('1');
            expect(divElement.getAttribute('asNumberString')).toBe('1');
            testAsObjectIndex(divElement, 'asNumberObject', 1);
        }
    });
});