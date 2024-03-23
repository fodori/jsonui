import { constants as c } from '@jsonui/core'
import Text from './components/Text'
import Button from './components/Button'
import Edit from './components/Edit'
import View from './components/View'
import Image from './components/Image'
import _Undefined from './components/Undefined'
import _PrimitiveProp from './components/PrimitiveProp'
import Fragment from './components/Fragment'

const Components = {
  View,
  [c.PRIMITIVE_COMP_NAME]: _PrimitiveProp,
  [c.UNDEFINED_COMP_NAME]: _Undefined,
  Fragment,
  Image,
  Text,
  Button,
  Edit,
}

export default Components
