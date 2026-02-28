### 1, Components

The `"$comp"` key represents the name of a component. This library contains few predefined components, just for test purpose:

- **View:** it's a simple `div` html tag
- **Button:** it's a simple `button` html tag
- **Fragment:** it's a simple `React.Fragment` component
- **Image:** it's a simple `image` html tag
- **Text:** it's a simple `p` html tag

The props of the components are the same as in the normal react world.

The `"$children"` key represents the children of the component.
It can be an array, object or primitive like text, number, boolean

```json
{ "$comp": "Text", "$children": "Hello World" }
{ "$comp": "Text", "$children": 124 }
{ "$comp": "Text", "$children": [1,2,3] }
{ "$comp": "Text", "$children": null }
{ "$comp": "View", "$children": [
   { "$comp": "Text", "$children": "Hello World" },
  ]
}
```

### 2, Actions

When the component has an interaction with a user or a triggered event, the `"$action"` key will represent it, for example, onClick, onChange or onPress.

```json
{
  "$comp": "Button",
  "$children": "Login",
  "onPress": { "$action": "navigate", "route": "LoginPage" }
}
```

The action is a predefined function that will run when the event has been triggered.

### 3, Modifiers

The `"$modifier"` can add a dynamic value for properties or components. It's a function which will be called at **render time** of the component. For example translate a text.

```json
{ "$comp": "Text", "$children": "Hello World" }
{ "$comp": "Text", "$children": { "$modifier": "translate", "key": "Helló Világ" } }
```

### How can you customise it?

Easily.

```js

const Canvas = () => <JsonUI model={jsonData}
  "functions"={
    {
     translate: ({key}) => translate(key)
     navigate: ({route}) => navigate(route)
    }
  }/>
```

### State management or data storage

The state management stores form state or any information what is needed to store. It is independent from **model**. It represents a permissive and dynamic tree graf structure. Like a JSON file. Each JSONUI instance has multiple stores (each one has a name/key) representing multiple data tree or separate storage. What you need is, just use a specific name in JSON Definition.
JSONUI use [json-pointer](https://www.npmjs.com/package/json-pointer) to tell the `path` what kind of data we need.

We have 2 built-in functions which can help to read and write your state management.

Let's see some example

#### Read data

##### if your defaultValues looks like:

```json
{ "users": [{ "userName": "John Doe" }] }
```

##### Use _/username_ in text field

```json
{
  "$comp": "Text",
  "$children": {
    "$modifier": "get",
    "store": "users",
    "path": "/0/userName"
  }
}
```

#### Write data

##### When the user click on the button, it will modify the data

```json
{
  "$comp": "Button",
  "$children": "Change username",
  "onPress": {
    "$modifier": "set",
    "store": "users",
    "path": "/0/userName",
    "value": "John Doe 2"
  }
}
```

##### Data will be:

```json
{ "users": [{ "userName": "John Doe 2" }] }
```

##### A simple input field solution

```json
{
  "$comp": "Edit",
  "value": { "$modifier": "get", "store": "questionnaire", "path": "/firstName" },
  "onChange": { "$action": "set", "store": "questionnaire", "path": "/firstName" }
}
```

You can manipulate the data when read or write it with [jsonata](https://jsonata.org/).

```json
{
  "$comp": "Text",
  "children": {
    "$modifier": "get",
    "store": "data",
    "path": "/prevNumber",
    "jsonataDef": "'Next Number: ' & (1+$)"
  }
}
```

### Advanced technique

#### Relative, absolute

You can use absolute, relative path and ./ ../ still works.
few examples

```json
{  "path": "/prevNumber" }
{  "path": "prevNumber" }
{  "path": "../prevNumber" }
{  "path": "../../prevNumber" }
```

#### List

JSONUI we need to handle dynamic data, for example a list.

##### if your data store looks like:

```json
{ "data": { "users": { "list": [{ "name": "John Doe" }] } } }
```

```json
{
  "$comp": "Fragment",
  "isList": true,
  "$pathModifiers": {
    "data": { "path": "/users/list" }
  },
  "listItem": {
    "$comp": "Edit",
    "value": { "$modifier": "get", "store": "data", "path": "name" },
    "onChange": { "$action": "set", "store": "data", "path": "name" }
  }
}
```
