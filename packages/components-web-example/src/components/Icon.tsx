import React from 'react'
import MUIIcon, { IconProps as MUIIconProps } from '@mui/material/Icon'
import '../../public/material-icons/material-icons.css'
import '../../public/fontawesome/css/all.min.css'
import '../../public/fontawesome/css/brands.min.css'
import '../../public/fontawesome/css/regular.min.css'
import '../../public/fontawesome/css/solid.min.css'
import '../../public/fontawesome/css/v4-shims.min.css'

export type IconProps = MUIIconProps & {
  type: 'MaterialIcons' | 'FontAwesome'
  name: string
}

const Icon = (props: IconProps) => {
  const type = ['FontAwesome', 'MaterialIcons'].includes(props.type) ? props.type : 'MaterialIcons'
  return (
    <MUIIcon {...props} className={type === 'FontAwesome' ? `fa fa-${props.name}` : undefined}>
      {type === 'FontAwesome' ? undefined : props.name}
    </MUIIcon>
  )
}

export default Icon
