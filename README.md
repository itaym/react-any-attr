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
![result](data:image/png;base64,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)
Note that any attribute set with **asObject** are not visible, and any attribute set with **asString** are visible and the attribute name is in lowercase.

[========]
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