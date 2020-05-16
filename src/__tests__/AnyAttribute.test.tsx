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
        mount(
            <AnyAttribute attributes={{
                fnAsObject : asObject(testFunction),
                fnAsString: asString(testFunction),
                objAsObject: asObject(testObject),
                objAsString: asString(testObject),
                fnAsIs: testFunction,
                objAsIs: testObject,
            }}>
                <div id={'testDiv'} />
            </AnyAttribute>, { attachTo: container });

        const divElement = document.getElementById('testDiv');
        // @ts-ignore
        expect(divElement.fnAsObject).toBe(testFunction);
        // @ts-ignore
        expect(divElement.getAttribute('fnAsString')).toBe("function () { return ''; }");
        // @ts-ignore
        expect(divElement.objAsObject).toBe(testObject);
        // @ts-ignore
        expect(divElement.getAttribute('objAsString')).toBe("{\"value\":1}");
        // @ts-ignore
        expect(divElement.fnAsIs).toBe(testFunction);
        // @ts-ignore
        expect(divElement.objAsIs).toBe(testObject);
    });
});