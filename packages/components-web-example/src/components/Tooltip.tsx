import React from 'react'
import MUITooltip, { TooltipProps as MUITooltipProps } from '@mui/material/Tooltip'

export type TooltipProps = MUITooltipProps

const Tooltip = (props: TooltipProps) => <MUITooltip {...props} />

export default Tooltip
