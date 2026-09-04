# react-any-attr
![Coverage Status](https://img.shields.io/badge/coverage-100%25-green) ![License](https://img.shields.io/badge/license-MIT-blue) [![CI](https://github.com/itaym/react-any-attr/actions/workflows/ci.yml/badge.svg)](https://github.com/itaym/react-any-attr/actions/workflows/ci.yml)

------------
From time to time you might have the need to add a custom attribute to an HTML element and React won't let you. It is not very common situation, but when it presents itself you must do things not the REACT WAY. This is the purpose of this package. it assists adding any attribute to any HTML element in React environment. The package provides a component called AnyAttribute that wraps any HTML elements you wish to add any attribute to, and a `useAnyAttributes` hook for attaching them to a single element directly.

## Installation
`$ npm install react-any-attr`

Peer dependencies: React/ReactDOM 16.3+ through 19.

## Usage
``import AnyAttribute, { asObject, asString, asBoolean, useAnyAttributes } from 'react-any-attr';``

The component receives one property called **attributes**. This property defines the attributes to add to any HTML element it wraps <u>directly</u>. Attributes are applied reactively: changing the **attributes** prop on a later render updates the DOM accordingly, and any key that's no longer present is removed.

The component also provides three helper functions called **asObject**, **asString** and **asBoolean**.

#### asString
Adds anything to an element converted to string. The attribute will be added to the "outerHTML" of the element and will be visible in the developer tools.
**note** that any attribute name will convert to lowercase.
#### asObject
Adds anything to an element without any convertions. The attribute will **not** be added to the "outerHTML" of the element and will not be visible in the inspect.
**note** that these attributes will keep their camelCase format.
#### asBoolean
Adds an HTML-idiomatic boolean attribute: truthy sets the attribute present (as an empty string), falsy removes it entirely. This is opt-in — a plain (unwrapped) `true`/`false` value keeps the older behavior of being written as the literal string `"true"`/`"false"`.

------------

You can avoid using the **asObject**, **asString** and **asBoolean** functions at all. Just be aware of the implications. Setting a value to `undefined` or `null` removes that attribute.

------------
### Example
```html
<AnyAttribute
    attributes={{
        objectTimestamp: asObject((new Date()).valueOf()),
        stringTimestamp: asString((new Date()).valueOf()),
        objectAsString : asString({data: myDataObject}),
        objectAsObject : asObject({data: myDataObject}),
        objectAsIs: myDataObject,
        anythingElse: 'Hello darkness my old friend...'
    }}>
    <input id={"input"} />
</AnyAttribute>
```
#### The result

Note that any attribute set with **asObject** are not visible, and any attribute set with **asString** are visible and the attribute name is in lowercase.
```html
<input id="input" stringtimestamp="158970528706" objectasstring="{"data":{"name":"Your Name", "age": 120, "pet": "cat"}}" objectasis="[object Object]" anythingelse="Hello darkness my old friend...">
```
------------
### useAnyAttributes hook
If wrapping in `<AnyAttribute>` isn't convenient — for example the element lives inside a plain function component, which can't itself receive an injected `ref` — attach the hook's returned ref callback directly:
```jsx
function MyInput() {
    const ref = useAnyAttributes({ anythingElse: 'Hello darkness my old friend...' });
    return <input ref={ref} />;
}
```
------------
#### Notes
- From version 1.1 useRef is supported. String ref is not supported and WILL NOT WORK because it's deprecated!!!
- `AnyAttribute` cannot attach a ref to a plain function component child (React itself doesn't allow it) — wrap that child in `React.forwardRef`, or use the `useAnyAttributes` hook inside it instead. A `console.warn` is emitted in development if this happens.
- Attributes are applied imperatively after mount/update, so a server-rendered page won't include them until the client hydrates.

------------
## Playground
A small interactive playground lives in `playground/` (Vite + React), demonstrating the README example, reactive updates, the hook, and `asBoolean`/attribute removal. Run it with:
```
npm run playground
```
then open the printed local URL.

------------
## Have a good productive day :)

If you like this package please consider donation <a href="https://paypal.me/ItayMerchav?locale.x=en_US" target="_blank">Click Here</a>

---
- **[MIT license](http://opensource.org/licenses/mit-license.php)**
