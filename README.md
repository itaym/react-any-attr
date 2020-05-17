# react-any-attr
![Coverage Status](https://img.shields.io/badge/coverage-100%25-green) ![License](https://img.shields.io/badge/license-MIT-blue)

------------
The purpose of the package is to assist you adding any attribute to any HTML element in React environment. The package provides a component called AnyAttribute that wraps any HTML elements you wish to add any attribute to.

## Installation
`$ npm install react-any-attr`
## Usage
``import AnyAttribute, { asObject, asString } from 'react-any-attr';``

The component receives one property called **attributes**. This property defines the attributes to add to any HTML element it wraps <u>directly</u>.
The component also provides two helper functions called **asObject** and **asString**.
When adding a function to an HTML element it will appear as a string: `<input myfunction="function () { return ''; }"`. If you wish to add a function to a HTML elment you must do something like `input['fnName'] = myFunction` which is ugly and will cause problems with Typescript and it is for sure not the React way. Also, if you would like to add an object if will apear as: `<input myobject="[object Object]"` that is where those functions come to hand:

#### asString
Adds anything to an element converted to string. The attribute will be added to the "outerHTML" of the element and will be visible in the inspect.
**note** that any attribute name will convert to lowercase.
#### asObject
Adds anything to an element without any convertions. The attribute will **not** be added to the "outerHTML" of the element and will not be visible in the inspect.
**note** that these attributes will keep their camelCase format.

------------


You an avoid using the **asObject** and **asString** functions at all. Just be aware of the implications.

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
        anythingElse: 'Hello silence my old friend...'
    }}>
    <input id={"input"} />
</AnyAttribute>
```
#### The result

Note that any attribute set with **asObject** are not visible, and any attribute set with **asString** are visible and the attribute name is in lowercase.
```html
<input id="input" stringtimestamp="158970528706" objectasstring="{"data":{"name":"Your Name", "age": 120, "pet": "cat"}}" objectasis="[object Object]" anythingelse="Hello silence my old friend...">
```
------------

#Have a good productive day :)

<br><br><br><br><br><br><br><br>
<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
<input type="hidden" name="cmd" value="_s-xclick" />
<input type="hidden" name="hosted_button_id" value="Y55NMQV27RQ7S" />
<input type="image" src="https://www.paypalobjects.com/en_US/IL/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
<img alt="" border="0" src="https://www.paypal.com/en_IL/i/scr/pixel.gif" width="1" height="1" />
</form>Or <a href="https://paypal.me/ItayMerchav?locale.x=en_US" target="_blank">Click Here</a>

---
- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2015 © <a href="http://fvcproductions.com" target="_blank">FVCproductions</a>.