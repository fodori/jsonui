import React from 'react'

import { JsonUI } from '@jsonui/react'
import { axios } from '@jsonui/functions-example'
import { Button, TextField, Radio, Select, Checkbox, Icon, Slider, Switch, Tooltip } from '@jsonui/components-web-example'
import model from './model.json'
import '@jsonui/components-web-example/dist/style.css'

function AllInOne() {
  return (
    <JsonUI model={model} disabledPersist functions={{ axios }} components={{ Button, TextField, Checkbox, Radio, Select, Icon, Slider, Switch, Tooltip }} />
  )
}

export default AllInOne
