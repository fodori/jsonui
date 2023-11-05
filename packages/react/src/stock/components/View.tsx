import React, { useContext } from 'react'
import { StockContext, wrapperUtil, constants as c } from '@jsonui/core'

function View({ [c.V_CHILDREN_NAME]: children, ...props }: any) {
  const stock = useContext(StockContext)
  return <div {...props}>{wrapperUtil.generateNewChildren(children, stock)}</div>
}

export default View
