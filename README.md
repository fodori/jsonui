# JSONUI

This is a Json markup language to define User Interface as a canvas where you can draw with Json definition.

When you change the Json definition, the interface immediately reflects on what you defined/changed.

Actually JSONUI is available for **react** and **react-native**.  It will be able to integrate to 99% of the cross-platform environments, thanks for reactjs ecosystem

The UI definition contains a layout definition and components configuration as well. The most important it has a built in **state management system**. Data can be **persistent** or not, depends on the name of the store.

## Core concept

Build a data driven UI. The "definition" is changeable by developer anytime and any reason.
If you would like to build a remote controlled app or a form generator app, I hope you will love it.

## Installation
On react environment
```bash
npm install @jsonui/react

yarn add @jsonui/react
```
On react-native environment
```bash
npm install @jsonui/reactnative @react-native-async-storage/async-storage

yarn add @jsonui/reactnative @react-native-async-storage/async-storage
```

## Basic Usage

The `JsonUI` Component is a canvas and the `viewDef` parameter contains the UI definition in Json format.

```js
import {JsonUI} from '@jsonui/reactnative';

const Canvas = () => <JsonUI viewDef={
    { "$comp": "Text", 
      "$children": "Hello World", 
      "style": { "fontSize": 30 }
    } />    
```

### How it works

The Json Markup language has 3 important part

#### 1, Components

The `"$comp"` key represents the name of a predefined react component. The predefined components:

- **View:** it's a simple `div` component in Web or `View` in react-native
- **Button:** it's a simple `button` component in Web or `Button` in react-native
- **Fragment:** it's a simple `React.Fragment` component
- **Image:** it's a simple `image` component in Web or `Image` in react-native
- **Text:** it's a simple `p` component in Web or `Text` in react-native

The props of the components are the same as in the normal react world.

The `"$children"` key represents the children of the component.
It can be array, object or primitive like text, number, boolean

```json
{ "$comp": "Text", "$children": "Hello World" }  
{ "$comp": "Text", "$children": 124 }  
{ "$comp": "Text", "$children": [1,2,3] }  
{ "$comp": "Text", "$children": null }   
{ "$comp": "View", "$children": [
   { "$comp": "Text", "$children": "Hello World" } 
  ] 
}  
```

#### 2, Actions

When the component has an interaction with user or a triggered event, the `"$action"` key will represent it, for example onClick, onChange or onPress

```json
{ "$comp": "Button", 
  "$children": "Login", 
  "onPress": { "$action": "navigate", "route": "LoginPage" }
}  
```
The action is really a predefined function when it will fire, when the event has triggered.

#### 3, Modifiers

The `"$action"` can add a dynamic value for properties or components. It's a function which will be called at render time of the component. Depends on environment data. For example JSONUI contains a basic internalisation solution.

```json
{ "$comp": "Text", "$children": "Hello World" }  
{ "$comp": "Text", "$children": { "$modifier": "t", "key": "Helló Világ" } }  
```

### How can you customise it?

Easily.

```js

const Canvas = () => <JsonUI viewDef={jsonData} 
  "components"={
    {
     nagivate: ({route}) => navigate(route)
    }
  }
  "functions"={
    {
     t: ({key}) => t(key)
    }
  }/>    
```

### State management or data storage

The state management is another layer of the JSNOUI. It's represent a permissive and dynamic tree graf structure. Like a JSON file.
Each app has a separated data space, based on the `id` param of `JsonUI` component.
Each app has multiple `store` represent multiple data tree or separate storage.
Actually the `data` store is persistent. (it will be configurable soon if there is interest in it)
You can define unlimited data store. What you need is, just use a specific name in JSON Definition, and it will automatically create at the first use.
JSONUI use [json-pointer](https://www.npmjs.com/package/json-pointer) to tell the `path` what kind of data we need.

We have 2 built-in function which can help to read and write your state management.


Let's see some example 

####Read data
#####Your data store Looks like:
```json
{ "users":[{"username": "John Doe"}] }
```
#####Use */username* in text field
```json
{ "$comp": "Text", "$children": { "$modifier": "get", "store": "data", "path": "/users/0/username" } }  
```


####Write data

#####When the user click on the button, it will modify the data
```json
{ "$comp": "Button", 
  "$children": "Change username", 
  "onPress": {"$modifier": "set", "store": "data", "path": "/users/0/username", "value":"John Doe 2" }
}  
```

#####Data will be:
```json
{ "users":[{"username": "John Doe2"}] }  
```

#####A simple input field solution
```json
{ "$comp": "Input",
  "value": { "$name": "get", "store": "questionnaire1", "path": "/firstName" },
  "onChange": { "$action": "set", "store": "questionnaire1", "path": "/firstName" },
}
```
You can manipulate the data when read or write it with [jsonata](https://jsonata.org/).

```json
{ "$comp": "Text",
  "children": { "$modifier": "get", "store": "data", "path": "/prevNumber", "jsonataDef": "'Next Number: ' & (1+$)" }
}
```

###Advanced technique

####Relative, absolute

You can use absolute, relative path and ./ ../ still works.
few examples

```json
{  "path": "/prevNumber" }
{  "path": "prevNumber" }
{  "path": "../prevNumber" }
{  "path": "../../prevNumber" }
```

####List

Somethimes we need to handle dynamic data for example a list.

#####Your data store looks like:

```json
{ "subscribed": { "list":[{"name": "John Doe"}] } }
```

```json
{  "$comp": "Fragment",
   "isList": true,
   "$pathModifiers": {
      "data": { "path": "/subscribed/list" }
   },
   "listItem": {
      "component": "Input",
      "value": { "$modifier": "get", "store": "data", "path": "name" },
      "onChange": { "$action": "set", "store": "data", "path": "name" }
   }
}
```

This little technique can change the relative path nestedly as well.


## LICENSE [MIT](LICENSE)

Copyright (c) 2022 Istvan Fodor.