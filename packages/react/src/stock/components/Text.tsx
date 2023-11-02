import React, { useContext } from 'react'
import { StockContext, wrapperUtil, constants as c } from '@jsonui/core'

function Text({ value, [c.V_CHILDREN_NAME]: children, ...props }: any) {
  const stock = useContext(StockContext)
  return <p {...props}>{wrapperUtil.generateNewChildren(value || children, stock)}</p>
}

export default Text
