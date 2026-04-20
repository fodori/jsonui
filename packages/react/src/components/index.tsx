import type { ComponentMap } from '../componentMap.js'
import { View } from './View.js'
import { Text } from './Text.js'
import { Button } from './Button.js'
import { Input } from './Input.js'
import { Slider } from './Slider.js'
import { Fragment } from './Fragment.js'
import { Image } from './Image.js'
import { StoreDebugger } from './StoreDebugger.js'
import { SubmitButton } from './SubmitButton.js'
import { FormLayout } from './FormLayout.js'
import { Undefined } from './Undefined.js'

export const builtinComponents: ComponentMap = {
  View,
  Text,
  Button,
  Input,
  Fragment,
  Image,
  StoreDebugger,
  SubmitButton,
  FormLayout,
  Slider,
  _Undefined: Undefined,
}

export { View, Text, Button, Input, Fragment, Image, StoreDebugger, SubmitButton, FormLayout, Slider, Undefined }
